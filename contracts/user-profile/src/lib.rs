#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec, String};

#[contracttype]
pub struct UserProfile {
    pub reputation_score: u64,
    pub total_corrections: u32,
    pub total_submissions: u32,
    pub last_activity: u64,
    pub languages: Vec<String>,
    pub is_verified: bool,
}

#[contracttype]
pub enum UserProfileEvent {
    ProfileCreated { user: Address },
    ReputationUpdated { user: Address, new_score: u64, change: i64 },
}

#[contracttype]
pub enum Error {
    ProfileAlreadyExists = 1,
    ProfileNotFound = 2,
    Unauthorized = 3,
    InvalidInput = 4,
}

#[contract]
pub struct UserProfileContract;

#[contractimpl]
impl UserProfileContract {
    /// Create a new user profile
    pub fn create_profile(
        env: Env,
        user: Address,
        languages: Vec<String>
    ) -> Result<(), Error> {
        user.require_auth();
        
        // Check if profile already exists
        if env.storage().instance().has(&user) {
            return Err(Error::ProfileAlreadyExists);
        }
        
        // Validate input
        if languages.is_empty() {
            return Err(Error::InvalidInput);
        }
        
        let profile = UserProfile {
            reputation_score: 100, // Starting reputation
            total_corrections: 0,
            total_submissions: 0,
            last_activity: env.ledger().timestamp(),
            languages,
            is_verified: false,
        };
        
        env.storage().instance().set(&user, &profile);
        
        // Emit event
        env.events().publish(
            ("profile_created",),
            UserProfileEvent::ProfileCreated { user: user.clone() }
        );
        
        Ok(())
    }
    
    /// Get user profile
    pub fn get_profile(env: Env, user: Address) -> Result<UserProfile, Error> {
        env.storage().instance()
            .get(&user)
            .ok_or(Error::ProfileNotFound)
    }
    
    /// Update reputation score (auth-protected, only called by other contracts)
    pub fn update_reputation(
        env: Env,
        user: Address,
        score_change: i64,
        caller: Address
    ) -> Result<(), Error> {
        caller.require_auth();
        
        // In a real implementation, we'd check if caller is authorized contract
        // For now, we'll allow any authenticated caller
        
        let mut profile: UserProfile = env.storage().instance()
            .get(&user)
            .ok_or(Error::ProfileNotFound)?;
            
        // Calculate new reputation (prevent negative values)
        let new_score = if score_change < 0 {
            profile.reputation_score.saturating_sub((-score_change) as u64)
        } else {
            profile.reputation_score.saturating_add(score_change as u64)
        };
        
        profile.reputation_score = new_score;
        profile.last_activity = env.ledger().timestamp();
        
        env.storage().instance().set(&user, &profile);
        
        // Emit event
        env.events().publish(
            ("reputation_updated",),
            UserProfileEvent::ReputationUpdated { 
                user: user.clone(), 
                new_score, 
                change: score_change 
            }
        );
        
        Ok(())
    }
    
    /// Get user reputation score
    pub fn get_reputation(env: Env, user: Address) -> u64 {
        match env.storage().instance().get::<Address, UserProfile>(&user) {
            Some(profile) => profile.reputation_score,
            None => 0
        }
    }
    
    /// Update user activity timestamp
    pub fn update_activity(env: Env, user: Address) -> Result<(), Error> {
        user.require_auth();
        
        let mut profile: UserProfile = env.storage().instance()
            .get(&user)
            .ok_or(Error::ProfileNotFound)?;
            
        profile.last_activity = env.ledger().timestamp();
        env.storage().instance().set(&user, &profile);
        
        Ok(())
    }
    
    /// Increment correction count
    pub fn increment_corrections(env: Env, user: Address, caller: Address) -> Result<(), Error> {
        caller.require_auth();
        
        let mut profile: UserProfile = env.storage().instance()
            .get(&user)
            .ok_or(Error::ProfileNotFound)?;
            
        profile.total_corrections = profile.total_corrections.saturating_add(1);
        profile.last_activity = env.ledger().timestamp();
        
        env.storage().instance().set(&user, &profile);
        
        Ok(())
    }
    
    /// Increment submission count
    pub fn increment_submissions(env: Env, user: Address, caller: Address) -> Result<(), Error> {
        caller.require_auth();
        
        let mut profile: UserProfile = env.storage().instance()
            .get(&user)
            .ok_or(Error::ProfileNotFound)?;
            
        profile.total_submissions = profile.total_submissions.saturating_add(1);
        profile.last_activity = env.ledger().timestamp();
        
        env.storage().instance().set(&user, &profile);
        
        Ok(())
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_create_profile() {
        let env = Env::default();
        let contract_id = env.register_contract(None, UserProfileContract);
        let client = UserProfileContractClient::new(&env, &contract_id);
        
        let user = Address::generate(&env);
        let languages = vec![&env, String::from_str(&env, "English"), String::from_str(&env, "Spanish")];
        
        // Test profile creation
        client.create_profile(&user, &languages);
        
        // Verify profile was created
        let profile = client.get_profile(&user).unwrap();
        assert_eq!(profile.reputation_score, 100);
        assert_eq!(profile.total_corrections, 0);
        assert_eq!(profile.total_submissions, 0);
        assert_eq!(profile.languages.len(), 2);
        assert!(!profile.is_verified);
    }
    
    #[test]
    fn test_update_reputation() {
        let env = Env::default();
        let contract_id = env.register_contract(None, UserProfileContract);
        let client = UserProfileContractClient::new(&env, &contract_id);
        
        let user = Address::generate(&env);
        let caller = Address::generate(&env);
        let languages = vec![&env, String::from_str(&env, "English")];
        
        // Create profile first
        client.create_profile(&user, &languages);
        
        // Test reputation increase
        client.update_reputation(&user, &50, &caller);
        assert_eq!(client.get_reputation(&user), 150);
        
        // Test reputation decrease
        client.update_reputation(&user, &-25, &caller);
        assert_eq!(client.get_reputation(&user), 125);
    }
} 