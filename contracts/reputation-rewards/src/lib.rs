#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, symbol_short};

#[contracttype]
#[derive(Clone)]
pub struct RewardConfig {
    pub base_reward: u64,
    pub reputation_multiplier: u64, // Per 100 reputation points
    pub min_rating_for_reward: u32,
    pub reputation_bonus_per_star: u64,
}

#[contracttype]
pub enum ReputationRewardsEvent {
    RewardProcessed { corrector: Address, amount: u64, rating: u32 },
    ConfigUpdated { admin: Address },
}

#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    Unauthorized = 1,
    InvalidRating = 2,
    InvalidConfig = 3,
    ContractNotFound = 4,
}

impl From<Error> for soroban_sdk::Error {
    fn from(e: Error) -> Self {
        match e {
            Error::Unauthorized => soroban_sdk::Error::from_contract_error(1),
            Error::InvalidRating => soroban_sdk::Error::from_contract_error(2),
            Error::InvalidConfig => soroban_sdk::Error::from_contract_error(3),
            Error::ContractNotFound => soroban_sdk::Error::from_contract_error(4),
        }
    }
}

const CONFIG_KEY: Symbol = symbol_short!("config");
const ADMIN_KEY: Symbol = symbol_short!("admin");

#[contract]
pub struct ReputationRewardsContract;

#[contractimpl]
impl ReputationRewardsContract {
    /// Initialize the contract with default configuration
    pub fn initialize(env: Env, admin: Address) -> Result<(), Error> {
        admin.require_auth();
        
        // Set admin
        env.storage().instance().set(&ADMIN_KEY, &admin);
        
        // Set default configuration
        let default_config = RewardConfig {
            base_reward: 10,        // 10 LINGO base reward
            reputation_multiplier: 10, // 10% bonus per 100 reputation points
            min_rating_for_reward: 2,  // Minimum 2 stars to get reward
            reputation_bonus_per_star: 5, // 5 reputation points per star
        };
        
        env.storage().instance().set(&CONFIG_KEY, &default_config);
        
        Ok(())
    }
    
    /// Process reward after rating (auth-protected, called by CorrectionMarket)
    pub fn process_reward(
        env: Env,
        corrector: Address,
        learner: Address,
        rating: u32,
        fee_amount: u64,
        caller: Address
    ) -> Result<(), Error> {
        caller.require_auth();
        
        // Validate rating
        if rating == 0 || rating > 5 {
            return Err(Error::InvalidRating);
        }
        
        let config: RewardConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .ok_or(Error::InvalidConfig)?;
        
        // Only process reward if rating meets minimum threshold
        if rating >= config.min_rating_for_reward {
            // Calculate reward amount
            let reward_amount = Self::calculate_reward_internal(
                env.clone(),
                corrector.clone(),
                rating,
                fee_amount,
                &config
            );
            
            // TODO: Transfer LINGO tokens to corrector
            // This would require integration with the LINGO token contract
            
            // Update corrector's reputation
            let reputation_change = (rating as u64) * config.reputation_bonus_per_star;
            
            // TODO: Call UserProfile contract to update reputation
            // This would require cross-contract calls
        }
        
        Ok(())
    }
    
    /// Calculate reward amount (public view function)
    pub fn calculate_reward(
        env: Env,
        corrector: Address,
        rating: u32,
        base_fee: u64
    ) -> u64 {
        let config: RewardConfig = env.storage().instance()
            .get(&CONFIG_KEY)
            .unwrap_or(RewardConfig {
                base_reward: 10,
                reputation_multiplier: 10,
                min_rating_for_reward: 2,
                reputation_bonus_per_star: 5,
            });
        
        Self::calculate_reward_internal(env, corrector, rating, base_fee, &config)
    }
    
    /// Internal reward calculation logic
    fn calculate_reward_internal(
        env: Env,
        corrector: Address,
        rating: u32,
        base_fee: u64,
        config: &RewardConfig
    ) -> u64 {
        // Base reward calculation based on rating
        let base_reward = match rating {
            1 => 0,
            2 => config.base_reward / 2,
            3 => config.base_reward,
            4 => config.base_reward * 3 / 2,
            5 => config.base_reward * 2,
            _ => 0,
        };
        
        // TODO: Get corrector's reputation from UserProfile contract
        // For now, we'll use a placeholder
        let corrector_reputation = 100u64; // Placeholder
        
        // Apply reputation multiplier (10% per 100 reputation points)
        let reputation_bonus = (corrector_reputation / 100) * config.reputation_multiplier;
        let multiplier = 100 + reputation_bonus;
        
        let final_reward = (base_reward * multiplier) / 100;
        
        // Ensure reward doesn't exceed the fee amount
        final_reward.min(base_fee)
    }
    
    /// Update reward configuration (admin only)
    pub fn update_config(
        env: Env,
        admin: Address,
        config: RewardConfig
    ) -> Result<(), Error> {
        admin.require_auth();
        
        // Verify admin
        let stored_admin: Address = env.storage().instance()
            .get(&ADMIN_KEY)
            .ok_or(Error::Unauthorized)?;
        
        if admin != stored_admin {
            return Err(Error::Unauthorized);
        }
        
        // Validate config
        if config.base_reward == 0 || config.min_rating_for_reward == 0 || config.min_rating_for_reward > 5 {
            return Err(Error::InvalidConfig);
        }
        
        // Update configuration
        env.storage().instance().set(&CONFIG_KEY, &config);
        
        Ok(())
    }
    
    /// Get current configuration
    pub fn get_config(env: Env) -> RewardConfig {
        env.storage().instance()
            .get(&CONFIG_KEY)
            .unwrap_or(RewardConfig {
                base_reward: 10,
                reputation_multiplier: 10,
                min_rating_for_reward: 2,
                reputation_bonus_per_star: 5,
            })
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
        let contract_id = env.register_contract(None, ReputationRewardsContract);
        let client = ReputationRewardsContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        
        // Test initialization
        client.initialize(&admin);
        
        // Verify admin was set
        assert_eq!(client.get_admin(), Some(admin));
        
        // Verify default config was set
        let config = client.get_config();
        assert_eq!(config.base_reward, 10);
        assert_eq!(config.reputation_multiplier, 10);
        assert_eq!(config.min_rating_for_reward, 2);
        assert_eq!(config.reputation_bonus_per_star, 5);
    }
    
    #[test]
    fn test_calculate_reward() {
        let env = Env::default();
        let contract_id = env.register_contract(None, ReputationRewardsContract);
        let client = ReputationRewardsContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        let corrector = Address::generate(&env);
        
        // Initialize contract
        client.initialize(&admin);
        
        // Test reward calculation for different ratings
        assert_eq!(client.calculate_reward(&corrector, &1, &100), 0);  // 1 star = no reward
        assert_eq!(client.calculate_reward(&corrector, &2, &100), 5);  // 2 stars = half base reward
        assert_eq!(client.calculate_reward(&corrector, &3, &100), 10); // 3 stars = base reward
        assert_eq!(client.calculate_reward(&corrector, &4, &100), 15); // 4 stars = 1.5x base reward
        assert_eq!(client.calculate_reward(&corrector, &5, &100), 20); // 5 stars = 2x base reward
    }
    
    #[test]
    fn test_update_config() {
        let env = Env::default();
        let contract_id = env.register_contract(None, ReputationRewardsContract);
        let client = ReputationRewardsContractClient::new(&env, &contract_id);
        
        let admin = Address::generate(&env);
        
        // Initialize contract
        client.initialize(&admin);
        
        // Update configuration
        let new_config = RewardConfig {
            base_reward: 20,
            reputation_multiplier: 15,
            min_rating_for_reward: 3,
            reputation_bonus_per_star: 10,
        };
        
        client.update_config(&admin, &new_config);
        
        // Verify configuration was updated
        let stored_config = client.get_config();
        assert_eq!(stored_config.base_reward, 20);
        assert_eq!(stored_config.reputation_multiplier, 15);
        assert_eq!(stored_config.min_rating_for_reward, 3);
        assert_eq!(stored_config.reputation_bonus_per_star, 10);
    }
} 