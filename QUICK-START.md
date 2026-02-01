# ARCfund - Quick Start Guide: Arcium Integration

This guide will get you up and running with ARCfund's Arcium encrypted fundraising platform in minutes.

## What You'll Have

- ✅ Next.js frontend with Privy authentication
- ✅ Solana program deployed to devnet
- ✅ Arcium SDK integrated for encryption/decryption
- ✅ Simulation mode working (Web Crypto API)
- ✅ Ready to deploy to mainnet

## 5-Minute Setup

### 1. Clone and Install

```bash
cd /workspaces/ARCfund
npm install
```

### 2. Auto-Deploy (Recommended)

```bash
# Make the script executable (if not already)
chmod +x scripts/deploy-arcium.sh

# Run the deployment script
bash scripts/deploy-arcium.sh
```

This single command:
- ✅ Installs Rust (if needed)
- ✅ Installs Solana CLI (if needed)
- ✅ Builds the Anchor program
- ✅ Deploys to Solana devnet
- ✅ Updates `.env.local` with program ID
- ✅ Runs integration tests

### 3. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Manual Setup (If You Prefer)

### Step 1: Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Verify installations
rustc --version
cargo --version
solana --version
```

### Step 2: Build the Program

```bash
cd /workspaces/ARCfund
cargo build --release -p arcfund-mxe
```

### Step 3: Deploy to Devnet

```bash
# Configure Solana
solana config set --url https://api.devnet.solana.com

# Create keypair if needed
solana-keygen new --outfile ~/.config/solana/id.json

# Get some devnet SOL
solana airdrop 2

# Deploy
solana program deploy programs/arcfund-mxe/target/release/arcfund_mxe.so
```

### Step 4: Update Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local and add:
# - Your Privy app ID and client ID
# - The program ID from deployment output
# - NEXT_PUBLIC_ARCIUM_PROGRAM_ID=<your_deployed_id>
```

### Step 5: Start Development

```bash
npm install
npm run dev
```

---

## Testing the Integration

### Simulation Mode (No Deployment Needed)

```bash
# Test encryption/decryption with Web Crypto API
npx ts-node lib/integration.test.ts
```

This runs without needing a deployed program ID and tests:
- ✅ Project data encryption
- ✅ Encrypted storage
- ✅ Access requests
- ✅ Data decryption
- ✅ Performance metrics

### With Real Arcium (After Deployment)

Once deployed, the client automatically switches to production mode and uses real Arcium services.

---

## Project Structure

```
ARCfund/
├── app/                    # Next.js pages
│   ├── page.tsx           # Homepage
│   ├── create/            # Create project
│   ├── project/[id]/      # View project
│   └── dashboard/         # Founder/investor dashboards
├── components/            # React components
├── lib/                   # Core logic
│   ├── arcium-client.ts   # Encryption/decryption (NEW)
│   ├── arcium-config.ts   # Configuration (UPDATED)
│   ├── solana-client.ts   # Program interaction (NEW)
│   └── integration.test.ts # Tests (NEW)
├── programs/              # Solana programs
│   └── arcfund-mxe/      # Anchor program (NEW)
│       ├── Cargo.toml
│       └── src/lib.rs
├── scripts/               # Utility scripts
│   └── deploy-arcium.sh   # One-click deployment (NEW)
├── Anchor.toml            # Anchor config (NEW)
├── README-ARCIUM.md       # Detailed guide (NEW)
└── .env.example           # Environment variables
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `programs/arcfund-mxe/src/lib.rs` | Anchor program for on-chain state management |
| `lib/arcium-client.ts` | Encryption/decryption with Arcium SDK |
| `lib/solana-client.ts` | Program interaction (create projects, access requests) |
| `lib/arcium-config.ts` | Configuration, types, and placeholders |
| `lib/integration.test.ts` | Full end-to-end tests |
| `scripts/deploy-arcium.sh` | One-click deployment |
| `Anchor.toml` | Anchor framework configuration |
| `README-ARCIUM.md` | Complete technical documentation |

---

## Encryption Flow Overview

```
1. FOUNDER CREATES PROJECT
   ├─ Submits project data in UI
   ├─ Frontend calls arciumClient.encryptProjectData()
   ├─ Data encrypted with Arcium MPC
   └─ Encrypted data sent to Solana program

2. INVESTOR REQUESTS ACCESS
   ├─ Clicks "Request Access" in app
   ├─ Solana program creates AccessRequest account
   └─ Founder notified

3. FOUNDER APPROVES
   ├─ Views request in dashboard
   ├─ Clicks "Approve"
   └─ Program updates status

4. INVESTOR VIEWS PROJECT
   ├─ Frontend verifies access
   ├─ Calls arciumClient.decryptProjectData()
   ├─ Arcium MXE decrypts securely
   └─ Investor sees plaintext data
```

---

## Environment Variables

### Privy (Authentication)
```env
NEXT_PUBLIC_PRIVY_APP_ID=your_app_id
NEXT_PUBLIC_PRIVY_CLIENT_ID=your_client_id
```

Get these from: https://dashboard.privy.io/

### Arcium (Encryption)
```env
NEXT_PUBLIC_ARCIUM_NETWORK=devnet
NEXT_PUBLIC_ARCIUM_PROGRAM_ID=<deployed_program_id>
NEXT_PUBLIC_ARCIUM_MXE_ENDPOINT=https://mxe.devnet.arcium.com
```

### Solana (Blockchain)
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

---

## Deployment to Mainnet

When ready for production:

### 1. Switch Network
```bash
solana config set --url https://api.mainnet-beta.solana.com
solana airdrop 10  # Mainnet SOL
```

### 2. Build & Deploy
```bash
cargo build --release -p arcfund-mxe
solana program deploy programs/arcfund-mxe/target/release/arcfund_mxe.so
```

### 3. Update Configuration
```bash
# Update .env.local or .env.production.local
NEXT_PUBLIC_ARCIUM_NETWORK=mainnet
NEXT_PUBLIC_ARCIUM_PROGRAM_ID=<mainnet_program_id>
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### 4. Deploy Next.js
```bash
npm run build
npm start
# Or deploy to Vercel: vercel deploy
```

---

## Troubleshooting

### "Program not found" Error
- Check that the program ID in `.env.local` matches the deployed program
- Verify deployment with: `solana program show <program_id>`

### Encryption/Decryption Fails
- Make sure you're in the `programs/arcfund-mxe` directory for Rust builds
- Check that all dependencies are installed: `npm install`
- Verify simulation mode works: `npx ts-node lib/integration.test.ts`

### Solana Connection Issues
- Verify Solana CLI is configured: `solana config get`
- Check balance: `solana balance`
- Request airdrop if needed: `solana airdrop 2`

### Build Errors
- Clear cache: `rm -rf target/`
- Update dependencies: `cargo update` (Rust) and `npm update` (Node)
- Check Rust version: `rustc --version` (should be 1.70+)

---

## Next Steps

1. **Test the UI**: http://localhost:3000
2. **Sign in with Privy**: Use your wallet or social login
3. **Create a project**: Go to `/create` and submit project details
4. **Request access**: Browse projects and request private ones
5. **Approve/deny**: Use the dashboard to manage access
6. **View encrypted project**: See the decrypted data after approval

---

## Support & Resources

- **Arcium Documentation**: https://docs.arcium.com/
- **Solana Documentation**: https://docs.solana.com/
- **Anchor Framework**: https://docs.anchor-lang.com/
- **Privy Authentication**: https://docs.privy.io/
- **Next.js Documentation**: https://nextjs.org/docs/

---

## More Information

For detailed technical documentation, see [README-ARCIUM.md](README-ARCIUM.md).
