/**
 * Encrypted Instruction: verify_access
 * =====================================
 * 
 * This Arcis circuit verifies if a wallet has access to decrypt a project.
 * 
 * The access list is stored encrypted in the MXE, and this instruction
 * checks if the requester's wallet is in the approved list.
 * 
 * Input:
 * - requester: The wallet address requesting access
 * - allowed_list: MXE-encrypted list of approved wallets
 * 
 * Output:
 * - bool: Whether access is granted
 */

use arcis::prelude::*;

/// Maximum number of investors that can have access to a single project
pub const MAX_ALLOWED_WALLETS: usize = 16;

/// Access verification instruction
/// 
/// Checks if a wallet address is in the approved access list.
/// The access list is stored encrypted with Enc<Mxe, ...> meaning
/// only the MXE can decrypt it - protecting the investor list.
/// 
/// # Arguments
/// * `requester` - The wallet pubkey of the user requesting access (shared encryption)
/// * `allowed_list` - The list of approved wallets (MXE-only encryption)
/// 
/// # Returns
/// * Boolean indicating whether access is granted (shared encryption)
#[encrypted]
pub fn verify_access(
    requester: Enc<Shared, [u8; 32]>,
    allowed_list: Enc<Mxe, [[u8; 32]; MAX_ALLOWED_WALLETS]>,
) -> Enc<Shared, bool> {
    let req_pubkey = requester.to_arcis();
    let allowed = allowed_list.to_arcis();
    
    // Check if requester is in the allowed list
    let mut has_access = false;
    
    for i in 0..MAX_ALLOWED_WALLETS {
        // Compare each byte of the wallet address
        let mut matches = true;
        for j in 0..32 {
            if allowed[i][j] != req_pubkey[j] {
                matches = false;
                // Can't break in MPC circuits, so we just set the flag
            }
        }
        if matches {
            has_access = true;
        }
    }
    
    // Return result encrypted for the requester
    requester.owner.from_arcis(has_access)
}

/// Helper to create an empty access list
pub fn empty_access_list() -> [[u8; 32]; MAX_ALLOWED_WALLETS] {
    [[0u8; 32]; MAX_ALLOWED_WALLETS]
}
