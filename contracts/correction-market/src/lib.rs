#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Vec, String, Map, BytesN, Symbol, symbol_short};

#[contracttype]
#[derive(Clone)]
pub struct Submission {
    pub id: u64,
    pub learner: Address,
    pub exercise_text: String,
    pub exercise_hash: BytesN<32>,
    pub fee_amount: u64,
    pub status: SubmissionStatus,
    pub created_at: u64,
    pub language: String,
}

#[contracttype]
#[derive(Clone)]
pub struct Correction {
    pub corrector: Address,
    pub correction_text: String,
    pub submitted_at: u64,
    pub rating: Option<u32>, // 1-5 stars, None if not rated yet
}

#[contracttype]
#[derive(Clone)]
pub enum SubmissionStatus {
    Open,
    HasCorrections,
    Completed,
    Expired,
}

#[contracttype]
pub enum CorrectionMarketEvent {
    ExerciseSubmitted { submission_id: u64, learner: Address, language: String },
    CorrectionAdded { submission_id: u64, corrector: Address },
    CorrectionRated { submission_id: u64, corrector: Address, rating: u32 },
}

#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    SubmissionNotFound = 1,
    Unauthorized = 2,
    InvalidInput = 3,
    AlreadyRated = 4,
    InsufficientFunds = 5,
    SubmissionClosed = 6,
    AlreadyCorrected = 7,
}

impl From<Error> for soroban_sdk::Error {
    fn from(e: Error) -> Self {
        match e {
            Error::SubmissionNotFound => soroban_sdk::Error::from_contract_error(1),
            Error::Unauthorized => soroban_sdk::Error::from_contract_error(2),
            Error::InvalidInput => soroban_sdk::Error::from_contract_error(3),
            Error::AlreadyRated => soroban_sdk::Error::from_contract_error(4),
            Error::InsufficientFunds => soroban_sdk::Error::from_contract_error(5),
            Error::SubmissionClosed => soroban_sdk::Error::from_contract_error(6),
            Error::AlreadyCorrected => soroban_sdk::Error::from_contract_error(7),
        }
    }
}

const SUBMISSION_COUNTER: Symbol = symbol_short!("sub_count");
const SUBMISSION_PREFIX: Symbol = symbol_short!("sub");
const CORRECTIONS_PREFIX: Symbol = symbol_short!("corr");

#[contract]
pub struct CorrectionMarketContract;

#[contractimpl]
impl CorrectionMarketContract {
    /// Submit exercise for correction
    pub fn submit_exercise(
        env: Env,
        learner: Address,
        exercise_text: String,
        language: String,
        fee_amount: u64
    ) -> Result<u64, Error> {
        learner.require_auth();
        
        // Validate input - check if strings have content
        let exercise_bytes = exercise_text.bytes();
        let language_bytes = language.bytes();
        if exercise_bytes.len() == 0 || language_bytes.len() == 0 || fee_amount == 0 {
            return Err(Error::InvalidInput);
        }
        
        // Get next submission ID
        let submission_id = env.storage().instance()
            .get::<Symbol, u64>(&SUBMISSION_COUNTER)
            .unwrap_or(0) + 1;
        
        // Create exercise hash for integrity
        let exercise_hash = env.crypto().sha256(&exercise_bytes);
        
        let submission = Submission {
            id: submission_id,
            learner: learner.clone(),
            exercise_text,
            exercise_hash,
            fee_amount,
            status: SubmissionStatus::Open,
            created_at: env.ledger().timestamp(),
            language: language.clone(),
        };
        
        // Store submission
        let submission_key = (SUBMISSION_PREFIX, submission_id);
        env.storage().instance().set(&submission_key, &submission);
        
        // Update counter
        env.storage().instance().set(&SUBMISSION_COUNTER, &submission_id);
        
        // Initialize empty corrections map
        let corrections_key = (CORRECTIONS_PREFIX, submission_id);
        let corrections: Map<Address, Correction> = Map::new(&env);
        env.storage().instance().set(&corrections_key, &corrections);
        
        Ok(submission_id)
    }
    
    /// Add correction to submission
    pub fn add_correction(
        env: Env,
        corrector: Address,
        submission_id: u64,
        correction_text: String
    ) -> Result<(), Error> {
        corrector.require_auth();
        
        // Validate input
        if correction_text.bytes().len() == 0 {
            return Err(Error::InvalidInput);
        }
        
        // Get submission
        let submission_key = (SUBMISSION_PREFIX, submission_id);
        let mut submission: Submission = env.storage().instance()
            .get(&submission_key)
            .ok_or(Error::SubmissionNotFound)?;
        
        // Check if submission is still open
        match submission.status {
            SubmissionStatus::Open | SubmissionStatus::HasCorrections => {},
            _ => return Err(Error::SubmissionClosed),
        }
        
        // Check if corrector already submitted a correction
        let corrections_key = (CORRECTIONS_PREFIX, submission_id);
        let mut corrections: Map<Address, Correction> = env.storage().instance()
            .get(&corrections_key)
            .unwrap_or(Map::new(&env));
        
        if corrections.contains_key(corrector.clone()) {
            return Err(Error::AlreadyCorrected);
        }
        
        // Create correction
        let correction = Correction {
            corrector: corrector.clone(),
            correction_text,
            submitted_at: env.ledger().timestamp(),
            rating: None,
        };
        
        // Store correction
        corrections.set(corrector.clone(), correction);
        env.storage().instance().set(&corrections_key, &corrections);
        
        // Update submission status
        submission.status = SubmissionStatus::HasCorrections;
        env.storage().instance().set(&submission_key, &submission);
        
        Ok(())
    }
    
    /// Rate a correction (learner only)
    pub fn rate_correction(
        env: Env,
        learner: Address,
        submission_id: u64,
        corrector: Address,
        rating: u32
    ) -> Result<(), Error> {
        learner.require_auth();
        
        // Validate rating (1-5 stars)
        if rating == 0 || rating > 5 {
            return Err(Error::InvalidInput);
        }
        
        // Get submission and verify learner ownership
        let submission_key = (SUBMISSION_PREFIX, submission_id);
        let mut submission: Submission = env.storage().instance()
            .get(&submission_key)
            .ok_or(Error::SubmissionNotFound)?;
        
        if submission.learner != learner {
            return Err(Error::Unauthorized);
        }
        
        // Get corrections
        let corrections_key = (CORRECTIONS_PREFIX, submission_id);
        let mut corrections: Map<Address, Correction> = env.storage().instance()
            .get(&corrections_key)
            .ok_or(Error::SubmissionNotFound)?;
        
        // Get specific correction
        let mut correction = corrections.get(corrector.clone())
            .ok_or(Error::SubmissionNotFound)?;
        
        // Check if already rated
        if correction.rating.is_some() {
            return Err(Error::AlreadyRated);
        }
        
        // Update correction with rating
        correction.rating = Some(rating);
        corrections.set(corrector.clone(), correction);
        env.storage().instance().set(&corrections_key, &corrections);
        
        // Check if this was the last correction to be rated
        let mut all_rated = true;
        for correction in corrections.values() {
            if correction.rating.is_none() {
                all_rated = false;
                break;
            }
        }
        if all_rated {
            submission.status = SubmissionStatus::Completed;
            env.storage().instance().set(&submission_key, &submission);
        }
        
        Ok(())
    }
    
    /// Get open submissions for correction (by language)
    pub fn get_open_submissions(
        env: Env,
        language: String,
        limit: u32
    ) -> Vec<Submission> {
        let mut results = Vec::new(&env);
        let counter = env.storage().instance()
            .get::<Symbol, u64>(&SUBMISSION_COUNTER)
            .unwrap_or(0);
        
        let mut found = 0u32;
        
        // Iterate through submissions (most recent first)
        for i in (1..=counter).rev() {
            if found >= limit {
                break;
            }
            
            let submission_key = (SUBMISSION_PREFIX, i);
            if let Some(submission) = env.storage().instance().get::<(Symbol, u64), Submission>(&submission_key) {
                if submission.language == language {
                    match submission.status {
                        SubmissionStatus::Open | SubmissionStatus::HasCorrections => {
                            results.push_back(submission);
                            found += 1;
                        },
                        _ => {}
                    }
                }
            }
        }
        
        results
    }
    
    /// Get submission details with corrections
    pub fn get_submission(
        env: Env,
        submission_id: u64
    ) -> Result<(Submission, Vec<Correction>), Error> {
        let submission_key = (SUBMISSION_PREFIX, submission_id);
        let submission: Submission = env.storage().instance()
            .get(&submission_key)
            .ok_or(Error::SubmissionNotFound)?;
        
        let corrections_key = (CORRECTIONS_PREFIX, submission_id);
        let corrections_map: Map<Address, Correction> = env.storage().instance()
            .get(&corrections_key)
            .unwrap_or(Map::new(&env));
        
        let corrections = corrections_map.values();
        
        Ok((submission, corrections))
    }
    
    /// Get corrections for a specific submission
    pub fn get_corrections(
        env: Env,
        submission_id: u64
    ) -> Result<Vec<Correction>, Error> {
        let corrections_key = (CORRECTIONS_PREFIX, submission_id);
        let corrections_map: Map<Address, Correction> = env.storage().instance()
            .get(&corrections_key)
            .ok_or(Error::SubmissionNotFound)?;
        
        Ok(corrections_map.values())
    }
    
    /// Get total number of submissions
    pub fn get_total_submissions(env: Env) -> u64 {
        env.storage().instance()
            .get::<Symbol, u64>(&SUBMISSION_COUNTER)
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env, String};

    #[test]
    fn test_submit_exercise() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CorrectionMarketContract);
        let client = CorrectionMarketContractClient::new(&env, &contract_id);
        
        let learner = Address::generate(&env);
        let exercise_text = String::from_str(&env, "Hello, how are you?");
        let language = String::from_str(&env, "English");
        
        // Test exercise submission
        let submission_id = client.submit_exercise(&learner, &exercise_text, &language, &100);
        assert_eq!(submission_id, 1);
        
        // Verify submission was stored
        let (submission, corrections) = client.get_submission(&submission_id).unwrap();
        assert_eq!(submission.learner, learner);
        assert_eq!(submission.exercise_text, exercise_text);
        assert_eq!(submission.language, language);
        assert_eq!(submission.fee_amount, 100);
        assert!(corrections.is_empty());
    }
    
    #[test]
    fn test_add_correction() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CorrectionMarketContract);
        let client = CorrectionMarketContractClient::new(&env, &contract_id);
        
        let learner = Address::generate(&env);
        let corrector = Address::generate(&env);
        let exercise_text = String::from_str(&env, "Hello, how are you?");
        let language = String::from_str(&env, "English");
        let correction_text = String::from_str(&env, "Hello, how are you doing?");
        
        // Submit exercise first
        let submission_id = client.submit_exercise(&learner, &exercise_text, &language, &100);
        
        // Add correction
        client.add_correction(&corrector, &submission_id, &correction_text);
        
        // Verify correction was added
        let corrections = client.get_corrections(&submission_id).unwrap();
        assert_eq!(corrections.len(), 1);
        assert_eq!(corrections.get(0).unwrap().corrector, corrector);
        assert_eq!(corrections.get(0).unwrap().correction_text, correction_text);
        assert!(corrections.get(0).unwrap().rating.is_none());
    }
    
    #[test]
    fn test_rate_correction() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CorrectionMarketContract);
        let client = CorrectionMarketContractClient::new(&env, &contract_id);
        
        let learner = Address::generate(&env);
        let corrector = Address::generate(&env);
        let exercise_text = String::from_str(&env, "Hello, how are you?");
        let language = String::from_str(&env, "English");
        let correction_text = String::from_str(&env, "Hello, how are you doing?");
        
        // Submit exercise and add correction
        let submission_id = client.submit_exercise(&learner, &exercise_text, &language, &100);
        client.add_correction(&corrector, &submission_id, &correction_text);
        
        // Rate the correction
        client.rate_correction(&learner, &submission_id, &corrector, &5);
        
        // Verify rating was stored
        let corrections = client.get_corrections(&submission_id).unwrap();
        assert_eq!(corrections.get(0).unwrap().rating, Some(5));
    }
} 