# ARCfund Arcium MXE Integration

This guide explains how to deploy and use the Arcium MXE integration for encrypted project pitches.

## Overview

ARCfund uses [Arcium](https://arcium.com) for end-to-end encryption of private project pitches. This ensures that only approved investors can view the confidential details of a fundraising project.

### Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  Solana Devnet  │────▶│  Arcium MPC     │
│   (Frontend)    │     │  (On-chain)     │     │  (Encryption)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │  Encrypt pitch        │  Queue computation    │  Process in
        │  with SDK             │  via program          │  MPC cluster
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  @arcium-hq/    │     │  arcfund-mxe    │     │  RescueCipher   │
│  client SDK     │     │  Anchor program │     │  + x25519       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Simulation Mode (Demo)

For hackathon demo purposes, the app includes a **simulation mode** that uses local encryption (AES-256-GCM) instead of real Arcium MPC. This provides the same UX while avoiding deployment complexity.

### Enable Simulation Mode

Set in `.env.local`:
```bash
NEXT_PUBLIC_ARCIUM_SIMULATION_MODE=true
```

### How Simulation Works

1. **Encryption**: Uses Web Crypto API (AES-256-GCM)
2. **Storage**: Encrypted data stored in localStorage
3. **Access Control**: Permission management in localStorage
4. **UI/UX**: Identical to real Arcium integration

## Production Deployment (Arcium MXE)

### Prerequisites

- **Linux/WSL2** (Arcium CLI doesn't support Windows natively)
- **Docker & Docker Compose**
- **Rust** (latest stable)
- **Solana CLI 2.3.0**
- **Anchor 0.32.1**
- **2-5 SOL on devnet**

### Step 1: Install Arcium CLI

```bash
# In WSL2 or Linux terminal
curl --proto '=https' --tlsv1.2 -sSfL https://install.arcium.com/ | bash
arcup
```

Verify installation:
```bash
arcium --version
```

### Step 2: Configure Solana

```bash
# Set to devnet
solana config set --url devnet

# Check balance (need 2-5 SOL)
solana balance

# Airdrop if needed (may be rate limited)
solana airdrop 2
```

### Step 3: Build the Program

Navigate to the program directory:
```bash
cd /mnt/c/Users/USER/Desktop/Arcfund/programs/arcfund-mxe
```

Build:
```bash
arcium build
```

This generates:
- `target/deploy/arcfund_mxe.so` - The compiled program
- `target/types/arcfund_mxe.ts` - TypeScript IDL

### Step 4: Deploy to Devnet

```bash
arcium deploy \
  --cluster-offset 0 \
  --recovery-set-size 3 \
  --keypair-path ~/.config/solana/id.json \
  --rpc-url https://api.devnet.solana.com
```

Note the output:
- **Program ID**: `ARCfund...` (save this!)
- **MXE Account**: Used for computations
- **Cluster ID**: Your MPC cluster

### Step 5: Initialize Computation Definitions

After deployment, run the initialization script:

```bash
npx ts-node scripts/init-comp-defs.ts
```

Or manually via CLI:
```bash
arcium init-comp-def encrypt_project
arcium init-comp-def verify_access
```

### Step 6: Update Environment

Add to `.env.local`:
```bash
NEXT_PUBLIC_ARCIUM_SIMULATION_MODE=false
NEXT_PUBLIC_ARCFUND_PROGRAM_ID=<your-program-id>
NEXT_PUBLIC_ARCIUM_CLUSTER_OFFSET=0
```

## Testing

### Local Testing

```bash
# Run tests
arcium test

# With logs
arcium test -- --features debug
```

### Devnet Testing

```bash
# Test on devnet
arcium test --cluster devnet
```

### Frontend Testing

1. Create a private project
2. Check browser devtools for encryption logs
3. Request access as different user
4. Approve access
5. Verify decryption works

## Troubleshooting

### "Cluster not set"
Run the deployment script or manually initialize the cluster.

### "Computation aborted"
Check that:
- MPC nodes are responsive
- Cluster is properly configured
- Recovery set size matches cluster

### "Insufficient funds"
Ensure your wallet has enough SOL for rent-exempt accounts.

### Build Errors
Make sure you're using:
- Anchor 0.32.1 (not newer)
- Solana CLI 2.3.0
- Rust stable

## Resources

- [Arcium Documentation](https://docs.arcium.com/)
- [Arcium Discord](https://discord.gg/arcium)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Cookbook](https://solanacookbook.com/)

## Cost Estimates

| Action | Cost |
|--------|------|
| Deploy program | ~2-3 SOL (one-time) |
| Create project | ~0.003 SOL |
| Grant access | ~0.001 SOL |
| MXE computations | FREE (testnet) |

## Security Notes

1. **Key Management**: Ephemeral keys are used for each encryption
2. **Access Control**: On-chain PDAs verify permissions
3. **MPC Security**: Threshold encryption protects data
4. **No Single Point of Failure**: Requires multiple MPC nodes
