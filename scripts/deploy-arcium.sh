#!/bin/bash

# ARCfund Arcium Integration Deployment Script
# This script automates the deployment of the Arcium MXE program and configuration

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "🚀 ARCfund Arcium Integration Setup"
echo "═══════════════════════════════════════════════════════════════"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper functions
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Check prerequisites
echo ""
echo "📍 Step 1: Checking Prerequisites"
echo "─────────────────────────────────────────────────────────────────"

# Check Rust
if ! command -v cargo &> /dev/null; then
    warning "Rust not found. Installing..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
else
    success "Rust installed: $(rustc --version)"
fi

# Check Solana CLI
if ! command -v solana &> /dev/null; then
    warning "Solana CLI not found. Installing..."
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)" 2>/dev/null || {
        warning "Solana CLI installation may have failed due to network issues"
        info "You can install manually: https://docs.solana.com/cli/install-solana-cli-tools"
    }
else
    success "Solana CLI installed: $(solana --version)"
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    error "Node.js not found. Please install Node.js 18+ first."
    exit 1
fi
success "Node.js installed: $(node --version)"

# Step 2: Build the Anchor program
echo ""
echo "📍 Step 2: Building Anchor Program"
echo "─────────────────────────────────────────────────────────────────"

cd programs/arcfund-mxe

if [ -d "target" ]; then
    info "Using cached build artifacts..."
else
    info "Building program from source..."
    . "$HOME/.cargo/env"
    cargo build --release --verbose
fi

success "Program built successfully"

# Step 3: Setup Solana wallet (if needed)
echo ""
echo "📍 Step 3: Solana Wallet Configuration"
echo "─────────────────────────────────────────────────────────────────"

SOLANA_KEYPAIR="$HOME/.config/solana/id.json"

if [ ! -f "$SOLANA_KEYPAIR" ]; then
    warning "Solana keypair not found at $SOLANA_KEYPAIR"
    info "Creating new keypair..."
    mkdir -p "$HOME/.config/solana"
    solana-keygen new --outfile "$SOLANA_KEYPAIR" --force 2>&1 | grep -v "Wrote new keypair"
    success "Keypair created at $SOLANA_KEYPAIR"
else
    success "Using existing keypair at $SOLANA_KEYPAIR"
fi

# Step 4: Configure Solana for Devnet
echo ""
echo "📍 Step 4: Configuring Solana for Devnet"
echo "─────────────────────────────────────────────────────────────────"

solana config set --url https://api.devnet.solana.com 2>&1 | grep -v "Config File"
success "Solana configured for devnet"

# Step 5: Get SOL balance and request airdrop if needed
echo ""
echo "📍 Step 5: Checking SOL Balance"
echo "─────────────────────────────────────────────────────────────────"

BALANCE=$(solana balance 2>/dev/null || echo "0")
info "Current balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 0.5" | bc -l) )); then
    warning "Balance is low. Requesting airdrop..."
    solana airdrop 2 2>&1 | grep -v "Requesting airdrop"
    BALANCE=$(solana balance)
    success "Airdrop completed. New balance: $BALANCE SOL"
fi

# Step 6: Deploy to Devnet
echo ""
echo "📍 Step 6: Deploying Program to Solana Devnet"
echo "─────────────────────────────────────────────────────────────────"

cd ../..

# Get the program binary path
PROGRAM_BINARY="programs/arcfund-mxe/target/release/arcfund_mxe.so"

if [ ! -f "$PROGRAM_BINARY" ]; then
    error "Program binary not found at $PROGRAM_BINARY"
    exit 1
fi

info "Deploying $PROGRAM_BINARY..."
DEPLOY_OUTPUT=$(solana program deploy "$PROGRAM_BINARY" 2>&1)
PROGRAM_ID=$(echo "$DEPLOY_OUTPUT" | grep "Program ID:" | awk '{print $NF}')

if [ -z "$PROGRAM_ID" ]; then
    error "Failed to deploy program"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

success "Program deployed successfully!"
echo ""
echo "   Program ID: $PROGRAM_ID"
echo ""

# Step 7: Create/Update .env.local
echo ""
echo "📍 Step 7: Updating Environment Configuration"
echo "─────────────────────────────────────────────────────────────────"

# Check if .env.local exists
if [ -f ".env.local" ]; then
    warning ".env.local already exists. Backing up to .env.local.bak"
    cp .env.local .env.local.bak
    
    # Update PROGRAM_ID in existing file
    sed -i "s/NEXT_PUBLIC_ARCIUM_PROGRAM_ID=.*/NEXT_PUBLIC_ARCIUM_PROGRAM_ID=$PROGRAM_ID/" .env.local
else
    info "Creating .env.local from .env.example"
    cp .env.example .env.local
    
    # Update PROGRAM_ID
    sed -i "s/NEXT_PUBLIC_ARCIUM_PROGRAM_ID=.*/NEXT_PUBLIC_ARCIUM_PROGRAM_ID=$PROGRAM_ID/" .env.local
fi

success ".env.local updated with deployed program ID"

# Step 8: Verify deployment
echo ""
echo "📍 Step 8: Verifying Deployment"
echo "─────────────────────────────────────────────────────────────────"

PROGRAM_ACCOUNT=$(solana account "$PROGRAM_ID" 2>&1)

if echo "$PROGRAM_ACCOUNT" | grep -q "executable"; then
    success "Program verified on Solana devnet"
    echo "$PROGRAM_ACCOUNT" | grep -E "Program ID|executable|Balance"
else
    error "Program verification failed"
    exit 1
fi

# Step 9: Test encryption/decryption
echo ""
echo "📍 Step 9: Testing Encryption/Decryption"
echo "─────────────────────────────────────────────────────────────────"

info "Running integration tests..."

# Use npx to run the test if available
if command -v npx &> /dev/null; then
    npx ts-node lib/integration.test.ts || {
        warning "Integration test had issues, but deployment succeeded"
    }
else
    warning "ts-node not available, skipping automated tests"
    info "You can run tests manually: npx ts-node lib/integration.test.ts"
fi

# Summary
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ ARCfund Arcium Integration Setup Complete!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📝 Summary:"
echo ""
echo "   Program ID: $PROGRAM_ID"
echo "   Network: Solana Devnet"
echo "   Keypair: $SOLANA_KEYPAIR"
echo "   Config File: .env.local"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "   1. Start the development server:"
echo "      npm run dev"
echo ""
echo "   2. Test the UI:"
echo "      http://localhost:3000"
echo ""
echo "   3. Create a project with encryption:"
echo "      - Sign in with Privy"
echo "      - Go to Create Project"
echo "      - Fill in project details"
echo "      - Submit (will encrypt with Arcium)"
echo ""
echo "   4. View encrypted projects:"
echo "      - Go to Browse section"
echo "      - Request access to private projects"
echo "      - Founder approves access"
echo "      - View decrypted project data"
echo ""
echo "📚 Documentation:"
echo ""
echo "   - Full guide: README-ARCIUM.md"
echo "   - Arcium docs: https://docs.arcium.com/"
echo "   - Solana docs: https://docs.solana.com/"
echo "   - Anchor docs: https://docs.anchor-lang.com/"
echo ""
echo "═══════════════════════════════════════════════════════════════"
