#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol, symbol_short};

#[contracttype]
pub enum LingoTokenEvent {
    Transfer { from: Address, to: Address, amount: u64 },
    Mint { to: Address, amount: u64 },
    Burn { from: Address, amount: u64 },
    Approval { owner: Address, spender: Address, amount: u64 },
}

#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    InsufficientBalance = 1,
    InsufficientAllowance = 2,
    Unauthorized = 3,
    InvalidAmount = 4,
}

impl From<Error> for soroban_sdk::Error {
    fn from(e: Error) -> Self {
        match e {
            Error::InsufficientBalance => soroban_sdk::Error::from_contract_error(1),
            Error::InsufficientAllowance => soroban_sdk::Error::from_contract_error(2),
            Error::Unauthorized => soroban_sdk::Error::from_contract_error(3),
            Error::InvalidAmount => soroban_sdk::Error::from_contract_error(4),
        }
    }
}

// Storage keys as Symbols
const BALANCE_PREFIX: Symbol = symbol_short!("balance");
const ALLOWANCE_PREFIX: Symbol = symbol_short!("allowance");
const TOTAL_SUPPLY_KEY: Symbol = symbol_short!("total_sup");
const ADMIN_KEY: Symbol = symbol_short!("admin");

// Token metadata
const TOKEN_NAME: &str = "LINGO";
const TOKEN_SYMBOL: &str = "LINGO";
const TOKEN_DECIMALS: u32 = 7; // Standard for Stellar

#[contract]
pub struct LingoTokenContract;

#[contractimpl]
impl LingoTokenContract {
    /// Initialize the token contract
    pub fn initialize(env: Env, admin: Address, initial_supply: u64) -> Result<(), Error> {
        admin.require_auth();
        
        // Set admin
        env.storage().instance().set(&ADMIN_KEY, &admin);
        
        // Set total supply
        env.storage().instance().set(&TOTAL_SUPPLY_KEY, &initial_supply);
        
        // Give initial supply to admin
        let balance_key = (BALANCE_PREFIX, admin.clone());
        env.storage().instance().set(&balance_key, &initial_supply);
        
        Ok(())
    }
    
    /// Get token name
    pub fn name(env: Env) -> String {
        String::from_str(&env, TOKEN_NAME)
    }
    
    /// Get token symbol
    pub fn symbol(env: Env) -> String {
        String::from_str(&env, TOKEN_SYMBOL)
    }
    
    /// Get token decimals
    pub fn decimals(_env: Env) -> u32 {
        TOKEN_DECIMALS
    }
    
    /// Get total supply
    pub fn total_supply(env: Env) -> u64 {
        env.storage().instance()
            .get(&TOTAL_SUPPLY_KEY)
            .unwrap_or(0)
    }
    
    /// Get balance of an account
    pub fn balance(env: Env, account: Address) -> u64 {
        let balance_key = (BALANCE_PREFIX, account);
        env.storage().instance()
            .get(&balance_key)
            .unwrap_or(0)
    }
    
    /// Transfer tokens
    pub fn transfer(env: Env, from: Address, to: Address, amount: u64) -> Result<(), Error> {
        from.require_auth();
        
        if amount == 0 {
            return Err(Error::InvalidAmount);
        }
        
        // Get balances
        let from_balance = Self::balance(env.clone(), from.clone());
        let to_balance = Self::balance(env.clone(), to.clone());
        
        // Check sufficient balance
        if from_balance < amount {
            return Err(Error::InsufficientBalance);
        }
        
        // Update balances
        let from_balance_key = (BALANCE_PREFIX, from.clone());
        let to_balance_key = (BALANCE_PREFIX, to.clone());
        
        env.storage().instance().set(&from_balance_key, &(from_balance - amount));
        env.storage().instance().set(&to_balance_key, &(to_balance + amount));
        
        Ok(())
    }
    
    /// Approve spender to spend tokens
    pub fn approve(env: Env, owner: Address, spender: Address, amount: u64) -> Result<(), Error> {
        owner.require_auth();
        
        let allowance_key = (ALLOWANCE_PREFIX, owner.clone(), spender.clone());
        env.storage().instance().set(&allowance_key, &amount);
        
        Ok(())
    }
    
    /// Get allowance
    pub fn allowance(env: Env, owner: Address, spender: Address) -> u64 {
        let allowance_key = (ALLOWANCE_PREFIX, owner, spender);
        env.storage().instance()
            .get(&allowance_key)
            .unwrap_or(0)
    }
    
    /// Transfer from (using allowance)
    pub fn transfer_from(
        env: Env,
        spender: Address,
        from: Address,
        to: Address,
        amount: u64
    ) -> Result<(), Error> {
        spender.require_auth();
        
        if amount == 0 {
            return Err(Error::InvalidAmount);
        }
        
        // Check allowance
        let current_allowance = Self::allowance(env.clone(), from.clone(), spender.clone());
        if current_allowance < amount {
            return Err(Error::InsufficientAllowance);
        }
        
        // Check balance
        let from_balance = Self::balance(env.clone(), from.clone());
        if from_balance < amount {
            return Err(Error::InsufficientBalance);
        }
        
        // Update allowance
        let allowance_key = (ALLOWANCE_PREFIX, from.clone(), spender.clone());
        env.storage().instance().set(&allowance_key, &(current_allowance - amount));
        
        // Update balances
        let from_balance_key = (BALANCE_PREFIX, from.clone());
        let to_balance_key = (BALANCE_PREFIX, to.clone());
        let to_balance = Self::balance(env.clone(), to.clone());
        
        env.storage().instance().set(&from_balance_key, &(from_balance - amount));
        env.storage().instance().set(&to_balance_key, &(to_balance + amount));
        
        Ok(())
    }
    
    /// Mint new tokens (admin only)
    pub fn mint(env: Env, admin: Address, to: Address, amount: u64) -> Result<(), Error> {
        admin.require_auth();
        
        // Verify admin
        let stored_admin: Address = env.storage().instance()
            .get(&ADMIN_KEY)
            .ok_or(Error::Unauthorized)?;
        
        if admin != stored_admin {
            return Err(Error::Unauthorized);
        }
        
        if amount == 0 {
            return Err(Error::InvalidAmount);
        }
        
        // Update total supply
        let current_supply = Self::total_supply(env.clone());
        env.storage().instance().set(&TOTAL_SUPPLY_KEY, &(current_supply + amount));
        
        // Update recipient balance
        let to_balance = Self::balance(env.clone(), to.clone());
        let to_balance_key = (BALANCE_PREFIX, to.clone());
        env.storage().instance().set(&to_balance_key, &(to_balance + amount));
        
        Ok(())
    }
    
    /// Burn tokens
    pub fn burn(env: Env, from: Address, amount: u64) -> Result<(), Error> {
        from.require_auth();
        
        if amount == 0 {
            return Err(Error::InvalidAmount);
        }
        
        // Check balance
        let from_balance = Self::balance(env.clone(), from.clone());
        if from_balance < amount {
            return Err(Error::InsufficientBalance);
        }
        
        // Update total supply
        let current_supply = Self::total_supply(env.clone());
        env.storage().instance().set(&TOTAL_SUPPLY_KEY, &(current_supply - amount));
        
        // Update balance
        let from_balance_key = (BALANCE_PREFIX, from.clone());
        env.storage().instance().set(&from_balance_key, &(from_balance - amount));
        
        Ok(())
    }
    
    /// Get admin address
    pub fn get_admin(env: Env) -> Option<Address> {
        env.storage().instance().get(&ADMIN_KEY)
    }
    
    /// Transfer admin rights
    pub fn transfer_admin(env: Env, current_admin: Address, new_admin: Address) -> Result<(), Error> {
        current_admin.require_auth();
        
        // Verify current admin
        let stored_admin: Address = env.storage().instance()
            .get(&ADMIN_KEY)
            .ok_or(Error::Unauthorized)?;
        
        if current_admin != stored_admin {
            return Err(Error::Unauthorized);
        }
        
        // Update admin
        env.storage().instance().set(&ADMIN_KEY, &new_admin);
        
        Ok(())
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, LingoTokenContract);
        let client = LingoTokenContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let initial_supply = 1_000_000_000_0000000u64; // 1 billion LINGO
        
        // Test initialization
        client.initialize(&admin, &initial_supply);
        
        // Verify token metadata
        assert_eq!(client.name(), "LINGO");
        assert_eq!(client.symbol(), "LINGO");
        assert_eq!(client.decimals(), 7);
        
        // Verify supply and admin balance
        assert_eq!(client.total_supply(), initial_supply);
        assert_eq!(client.balance(&admin), initial_supply);
        assert_eq!(client.get_admin(), Some(admin));
    }
    
    #[test]
    fn test_transfer() {
        let env = Env::default();
        let contract_id = env.register_contract(None, LingoTokenContract);
        let client = LingoTokenContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        let initial_supply = 1000u64;
        
        // Initialize and transfer
        client.initialize(&admin, &initial_supply);
        client.transfer(&admin, &user, &100);
        
        // Verify balances
        assert_eq!(client.balance(&admin), 900);
        assert_eq!(client.balance(&user), 100);
    }
    
    #[test]
    fn test_approve_and_transfer_from() {
        let env = Env::default();
        let contract_id = env.register_contract(None, LingoTokenContract);
        let client = LingoTokenContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let spender = Address::generate(&env);
        let recipient = Address::generate(&env);
        let initial_supply = 1000u64;
        
        // Initialize, approve, and transfer from
        client.initialize(&admin, &initial_supply);
        client.approve(&admin, &spender, &200);
        client.transfer_from(&spender, &admin, &recipient, &100);
        
        // Verify balances and allowance
        assert_eq!(client.balance(&admin), 900);
        assert_eq!(client.balance(&recipient), 100);
        assert_eq!(client.allowance(&admin, &spender), 100);
    }
    
    #[test]
    fn test_mint() {
        let env = Env::default();
        let contract_id = env.register_contract(None, LingoTokenContract);
        let client = LingoTokenContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        let initial_supply = 1000u64;
        
        // Initialize and mint
        client.initialize(&admin, &initial_supply);
        client.mint(&admin, &user, &500);
        
        // Verify supply and balance
        assert_eq!(client.total_supply(), 1500);
        assert_eq!(client.balance(&user), 500);
    }
} 