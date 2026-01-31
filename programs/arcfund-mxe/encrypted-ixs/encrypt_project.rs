/**
 * Encrypted Instruction: encrypt_project
 * =======================================
 * 
 * This Arcis circuit encrypts project pitch data using Arcium's MPC.
 * 
 * Input:  Enc<Shared, ProjectPitch> - Client-encrypted pitch data
 * Output: Enc<Shared, ProjectPitch> - MXE-processed encrypted data
 * 
 * The encryption uses x25519 key exchange between client and MXE,
 * with RescueCipher for the actual encryption.
 * 
 * Note: This file is compiled with the Arcium toolchain.
 */

use arcis::prelude::*;

/// Project pitch data structure
/// 
/// Maximum size is constrained by Solana callback limits (~1KB).
/// For larger data, use the callback server pattern instead.
/// 
/// Structure: 8 chunks of 32 bytes = 256 bytes of pitch content
#[derive(Clone, Copy)]
pub struct ProjectPitch {
    /// Chunk 0: bytes 0-31
    pub chunk_0: [u8; 32],
    /// Chunk 1: bytes 32-63
    pub chunk_1: [u8; 32],
    /// Chunk 2: bytes 64-95
    pub chunk_2: [u8; 32],
    /// Chunk 3: bytes 96-127
    pub chunk_3: [u8; 32],
    /// Chunk 4: bytes 128-159
    pub chunk_4: [u8; 32],
    /// Chunk 5: bytes 160-191
    pub chunk_5: [u8; 32],
    /// Chunk 6: bytes 192-223
    pub chunk_6: [u8; 32],
    /// Chunk 7: bytes 224-255
    pub chunk_7: [u8; 32],
}

impl Default for ProjectPitch {
    fn default() -> Self {
        Self {
            chunk_0: [0u8; 32],
            chunk_1: [0u8; 32],
            chunk_2: [0u8; 32],
            chunk_3: [0u8; 32],
            chunk_4: [0u8; 32],
            chunk_5: [0u8; 32],
            chunk_6: [0u8; 32],
            chunk_7: [0u8; 32],
        }
    }
}

/// Encrypt Project Instruction
/// 
/// This is the main encrypted instruction for storing project pitches.
/// 
/// The client sends pre-encrypted data using a shared secret derived from
/// x25519 key exchange. The MXE processes this data within its secure
/// enclave and returns the result for on-chain storage.
/// 
/// Flow:
/// 1. Client generates ephemeral x25519 keypair
/// 2. Client derives shared secret with MXE public key
/// 3. Client encrypts pitch with RescueCipher using shared secret
/// 4. This instruction receives the encrypted data
/// 5. MXE processes (can apply transformations if needed)
/// 6. Result is returned via callback to Solana program
/// 
/// # Arguments
/// * `pitch_data` - The encrypted project pitch
/// 
/// # Returns
/// * The processed encrypted pitch (ready for on-chain storage reference)
#[encrypted]
pub fn encrypt_project(
    pitch_data: Enc<Shared, ProjectPitch>
) -> Enc<Shared, ProjectPitch> {
    // The data is already encrypted with a shared secret between
    // the client and MXE. We simply pass it through here.
    // 
    // In production, you could add:
    // - Data validation
    // - Transformation/processing
    // - Access control checks
    // - Watermarking
    
    let data = pitch_data.to_arcis();
    
    // Return the data encrypted for the same owner
    pitch_data.owner.from_arcis(data)
}

/// Get the total size of a ProjectPitch in bytes
pub const fn pitch_size() -> usize {
    32 * 8 // 256 bytes
}
