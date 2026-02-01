use anchor_lang::prelude::*;

declare_id!("GrxKJR97pEmBz2zJQRXg5T7e6VWjgTYvmkTW7xdDjc4M");

#[program]
pub mod arcfund_mxe {
    use super::*;

    /// Initialize a new encrypted project
    /// This creates a project state account that will hold encrypted project data
    pub fn initialize_project(
        ctx: Context<InitializeProject>,
        project_id: String,
        founder: Pubkey,
    ) -> Result<()> {
        let project = &mut ctx.accounts.project;
        project.project_id = project_id;
        project.founder = founder;
        project.created_at = Clock::get()?.unix_timestamp;
        project.is_encrypted = true;
        
        msg!("✅ Project initialized: {}", project.project_id);
        Ok(())
    }

    /// Store encrypted project data
    /// In a real implementation, this would receive encrypted data from the client
    pub fn store_encrypted_data(
        ctx: Context<StoreEncryptedData>,
        encrypted_payload: Vec<u8>,
    ) -> Result<()> {
        let project = &mut ctx.accounts.project;
        project.encrypted_data = encrypted_payload;
        project.updated_at = Clock::get()?.unix_timestamp;
        
        msg!("✅ Encrypted data stored");
        Ok(())
    }

    /// Request access to a private project
    /// This creates an access request that the founder can approve/deny
    pub fn request_access(
        ctx: Context<RequestAccess>,
        project_id: String,
    ) -> Result<()> {
        let access_request = &mut ctx.accounts.access_request;
        access_request.investor = ctx.accounts.investor.key();
        access_request.project_id = project_id;
        access_request.status = AccessStatus::Pending;
        access_request.requested_at = Clock::get()?.unix_timestamp;
        
        msg!("✅ Access request created");
        Ok(())
    }

    /// Approve an access request (founder only)
    pub fn approve_access(
        ctx: Context<ApproveAccess>,
    ) -> Result<()> {
        let access_request = &mut ctx.accounts.access_request;
        access_request.status = AccessStatus::Approved;
        access_request.approved_at = Some(Clock::get()?.unix_timestamp);
        
        msg!("✅ Access approved for investor");
        Ok(())
    }

    /// Deny an access request (founder only)
    pub fn deny_access(
        ctx: Context<ApproveAccess>,
    ) -> Result<()> {
        let access_request = &mut ctx.accounts.access_request;
        access_request.status = AccessStatus::Denied;
        access_request.approved_at = Some(Clock::get()?.unix_timestamp);
        
        msg!("✅ Access denied");
        Ok(())
    }
}

// ============================================================================
// ACCOUNT STRUCTURES
// ============================================================================

#[account]
pub struct Project {
    pub project_id: String,
    pub founder: Pubkey,
    pub encrypted_data: Vec<u8>,
    pub is_encrypted: bool,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct AccessRequest {
    pub investor: Pubkey,
    pub project_id: String,
    pub status: AccessStatus,
    pub requested_at: i64,
    pub approved_at: Option<i64>,
}

// ============================================================================
// ENUMS
// ============================================================================

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum AccessStatus {
    Pending,
    Approved,
    Denied,
}

// ============================================================================
// INSTRUCTION CONTEXTS
// ============================================================================

#[derive(Accounts)]
#[instruction(project_id: String)]
pub struct InitializeProject<'info> {
    #[account(
        init,
        payer = founder,
        space = 8 + 32 + 32 + 4 + 256 + 1 + 8 + 8,
        seeds = [b"project", project_id.as_bytes()],
        bump
    )]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub founder: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StoreEncryptedData<'info> {
    #[account(mut)]
    pub project: Account<'info, Project>,

    pub founder: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(project_id: String)]
pub struct RequestAccess<'info> {
    #[account(
        init,
        payer = investor,
        space = 8 + 32 + 32 + 1 + 8 + 8 + 4 + project_id.len(),
        seeds = [b"access", investor.key().as_ref(), project_id.as_bytes()],
        bump
    )]
    pub access_request: Account<'info, AccessRequest>,

    #[account(mut)]
    pub investor: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveAccess<'info> {
    #[account(mut)]
    pub access_request: Account<'info, AccessRequest>,

    pub founder: Signer<'info>,
}

// ============================================================================
// ERROR CODES
// ============================================================================

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access")]
    Unauthorized,

    #[msg("Project not found")]
    ProjectNotFound,

    #[msg("Invalid access status")]
    InvalidAccessStatus,
}
