# Arcium Integration Guide for ARCfund

## Overview

ARCfund uses Arcium's Multi-Party Computation (MPC) for secure, encrypted fundraising. This guide covers the complete integration, from development to production deployment.

## Architecture

### Components

1. **Frontend (Next.js)**: User interface for creating/viewing projects
2. **Solana Program (Anchor)**: On-chain state management for projects and access control
3. **Arcium MXE**: Encrypted computation environment for data processing
4. **TypeScript Client**: Bridge between frontend and Arcium services

### Encryption Flow

```
┌─────────────────────────────────────────────────────────────┐
│ FOUNDER CREATE PROJECT                                      │
├─────────────────────────────────────────────────────────────┤
│ 1. Founder submits project data in app                      │
│ 2. Frontend calls arciumClient.encryptProjectData()         │
│ 3. Data encrypted with Arcium MPC (Enc<Shared, Data>)     │
│ 4. Encrypted data sent to Solana program                   │
│ 5. Program stores encrypted data on-chain                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ INVESTOR REQUEST ACCESS                                     │
├─────────────────────────────────────────────────────────────┤
│ 1. Investor clicks "Request Access" in app                 │
│ 2. Solana program creates AccessRequest account           │
│ 3. Founder receives notification                           │
│ 4. Founder approves/denies in app                         │
│ 5. Program updates AccessRequest.status                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ INVESTOR VIEW PROJECT                                       │
├─────────────────────────────────────────────────────────────┤
│ 1. Investor opens approved project                        │
│ 2. Frontend verifies access via Solana program            │
│ 3. Arcium generates decryption key (Enc<Investor, Key>)  │
│ 4. Frontend calls arciumClient.decryptProjectData()      │
│ 5. MPC nodes securely decrypt and return plaintext       │
│ 6. Investor sees unencrypted project data                │
└─────────────────────────────────────────────────────────────┘
```

## Installation Steps

### 1. Prerequisites

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Install Anchor (Solana program framework)
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest
```

### 2. Build the Solana Program

```bash
cd /workspaces/ARCfund

# Build the program
cargo build --release -p arcfund-mxe

# Or using Anchor (recommended)
anchor build --provider.cluster devnet
```

### 3. Deploy to Solana Devnet

```bash
# Configure Solana CLI for devnet
solana config set --url https://api.devnet.solana.com

# Create a keypair if you don't have one
solana-keygen new --outfile ~/.config/solana/id.json

# Get devnet SOL
solana airdrop 2

# Deploy the program
anchor deploy --provider.cluster devnet

# Note the program ID from deployment output
# Update .env.local with this ID
```

### 4. Environment Configuration

Create `.env.local` in the project root:

```env
# Privy (Authentication)
NEXT_PUBLIC_PRIVY_APP_ID=your_app_id_here
NEXT_PUBLIC_PRIVY_CLIENT_ID=your_client_id_here

# Arcium Configuration
NEXT_PUBLIC_ARCIUM_NETWORK=devnet
NEXT_PUBLIC_ARCIUM_PROGRAM_ID=YOUR_DEPLOYED_PROGRAM_ID
NEXT_PUBLIC_ARCIUM_MXE_ENDPOINT=https://mxe.devnet.arcium.com

# Solana
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

## Current Implementation Status

### ✅ Completed

- [x] Anchor program scaffold (`programs/arcfund-mxe/`)
- [x] TypeScript Arcium client (`lib/arcium-client.ts`)
- [x] Simulation mode with Web Crypto API (for testing)
- [x] Configuration files (`lib/arcium-config.ts`)
- [x] Environment variables template

### 🔧 To Complete

- [ ] Deploy program to Solana devnet
- [ ] Integrate real @arcium-hq/client SDK
- [ ] Add program interaction code (web3.js/anchor.js)
- [ ] Connect Privy authentication to program
- [ ] Test full encryption/decryption flow

## Key Files

| File | Purpose |
|------|---------|
| `programs/arcfund-mxe/src/lib.rs` | Anchor program for on-chain state |
| `lib/arcium-client.ts` | TypeScript client for encryption |
| `lib/arcium-config.ts` | Configuration and type definitions |
| `Anchor.toml` | Anchor framework configuration |
| `.env.example` | Environment variable template |

## Testing

### 1. Simulation Mode (Testing)

The client automatically uses simulation mode (Web Crypto API) when the Arcium program ID is not configured. This is useful for testing without deploying.

```typescript
import { arciumClient, initializeArcium } from './lib/arcium-client';

// Initialize
await initializeArcium();

// Check status
const status = arciumClient.getStatus();
console.log(status);
// Output: { mode: 'SIMULATION', programId: 'Not configured', ... }

// Test encryption
const projectData = {
    title: "My Startup",
    description: "An amazing product",
    pitch: "We're building the future",
    fundingGoal: 1000000,
    timeline: "24 months",
    team: ["Alice", "Bob"],
    roadmap: "Phase 1: MVP, Phase 2: Scale"
};

const encrypted = await arciumClient.encryptProjectData(projectData);
const decrypted = await arciumClient.decryptProjectData(encrypted);
```

### 2. Integration Testing

Once deployed, test with real Arcium services:

```typescript
const status = arciumClient.getStatus();
console.log(status);
// Output: { mode: 'PRODUCTION', programId: 'YOUR_ID', ... }
```

## Useful Links

- [Arcium Documentation](https://docs.arcium.com/)
- [Arcium Developer Guide](https://docs.arcium.com/developers)
- [Arcium TypeScript SDK](https://ts.arcium.com/api)
- [Anchor Documentation](https://docs.anchor-lang.com/)
- [Solana Documentation](https://docs.solana.com/)
- [Privy Documentation](https://docs.privy.io/)

## Troubleshooting

### Program Won't Build

```bash
# Make sure you're in the program directory
cd programs/arcfund-mxe

# Try with verbose output
cargo build --release --verbose

# Check for Rust toolchain issues
rustc --version
cargo --version
```

### Deployment Fails

```bash
# Check Solana connection
solana config get

# Verify you have devnet SOL
solana balance

# Request airdrop if needed
solana airdrop 2

# Check program size
cargo build --release
ls -lh target/release/arcfund_mxe.so
```

### Encryption/Decryption Issues

1. Check that `.env.local` has the correct program ID
2. Verify simulation mode is working: `arciumClient.getStatus()`
3. Check browser console for error messages
4. Ensure crypto globals are available

## Next Steps

1. ✅ Create and deploy the Anchor program
2. ✅ Build the TypeScript client
3. ⏳ Integrate with Privy authentication
4. ⏳ Add project creation flow with encryption
5. ⏳ Add access request system
6. ⏳ Implement investor view with decryption

## Support

For issues or questions:

- **Arcium**: https://discord.com/invite/arcium
- **Anchor/Solana**: https://discord.gg/solana
- **This Project**: Check README.md
