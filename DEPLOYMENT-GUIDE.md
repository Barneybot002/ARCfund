# ARCfund Solana Program Deployment Guide

## Current Status

✅ **What's Complete:**
- Rust smart contract implemented and compiles locally
- Binary built: `programs/arcfund-mxe/target/release/libarcfund_mxe.so` (514KB)
- Solana CLI installed and configured
- Devnet wallet created with 3.5 SOL
- TypeScript clients ready (encryption & Solana interaction)
- Integration tests passing

⚠️ **Current Blocker:**
The Rust 1.93.0 toolchain generates ELF sections with names > 16 bytes, which Solana's program loader rejects. This is a known issue in the Solana/Rust ecosystem.

## Solutions

### Option 1: Use Anchor Framework (Recommended)
Anchor automatically handles ELF compatibility issues.

```bash
cd /workspaces/ARCfund

# Install Anchor
cargo install anchor-cli --locked

# Build with Anchor
anchor build

# Deploy to devnet
anchor deploy
```

### Option 2: Use Solana Verified Build Container
Use Solana Foundation's Docker image that has pre-configured compatible toolchain:

```bash
docker run -v /workspaces/ARCfund:/workspaces/ARCfund \
  -w /workspaces/ARCfund/programs/arcfund-mxe \
  solanalabs/rust:1.75.0 \
  cargo build --release
```

### Option 3: Downgrade Rust Toolchain
```bash
rustup install 1.75.0
rustup override set 1.75.0
cargo build --release
solana program deploy target/release/libarcfund_mxe.so
```

### Option 4: Direct Deployment (If Anchor Deploy Works)
```bash
solana program deploy programs/arcfund-mxe/target/release/arcfund_mxe.so \
  --keypair ~/.config/solana/id.json \
  --url https://api.devnet.solana.com
```

## After Successful Deployment

Once the program deploys successfully:

1. **Capture Program ID:**
   ```bash
   # The deploy command will output the Program ID
   # Example: Program Id: GrAkKfEqTKZE4eggPGZ2CHoMTTUu4MqWQbnabB42pumT
   ```

2. **Update Configuration:**
   ```bash
   # Edit .env.local with the deployed Program ID
   NEXT_PUBLIC_ARCIUM_PROGRAM_ID=<deployed-program-id>
   ```

3. **Verify Deployment:**
   ```bash
   solana program show <program-id> --url devnet
   ```

4. **Update Application:**
   - Restart Next.js dev server
   - Run integration tests against devnet
   - Test full encryption/access flow

## Wallet Info

**Address:** `8Yk6aHoQ7sJq4ZLnGfxgvQBtgYMTMxVGHTjxzuf8AwsF`  
**Balance:** 3.5 SOL (on devnet)  
**Keypair Location:** `~/.config/solana/id.json`

## Environment Setup Verified

```bash
✅ Solana CLI: 1.18.0
✅ Rust: 1.93.0  
✅ Cargo: 1.82.0
✅ Node.js: 24.11.1
✅ TypeScript: 5.6.2
```

## Next Steps

1. Choose a solution from above and execute
2. Capture the Program ID from deployment output
3. Update `.env.local` with Program ID
4. Run integration tests: `npm test`
5. Application will connect to live devnet program

## Support

For ELF section name issues:
- See: https://github.com/solana-labs/solana/issues/29793
- Solution: Use Anchor framework which handles this transparently

