/**
 * Privy Configuration
 * Documentation: https://docs.privy.io/basics/react/setup
 * 
 * User Credentials:
 * - App ID: cmkynk4a000ttjr0ccw9ywbgi
 * - JWKS Endpoint: https://auth.privy.io/api/v1/apps/cmkynk4a000ttjr0ccw9ywbgi/jwks.json
 */

import { PrivyClientConfig } from '@privy-io/react-auth';

export const privyConfig: PrivyClientConfig = {
    // Appearance configuration
    appearance: {
        theme: 'dark',
        accentColor: '#8B5CF6', // Arcium purple
        logo: '/logo.png',
        showWalletLoginFirst: true,
        walletChainType: 'solana-only', // Configure for Solana support
    },

    // Login methods - wallet, email, and Google
    loginMethods: ['wallet', 'email', 'google'],

    // Embedded wallet configuration
    // Automatically creates embedded wallets for users who don't have one
    embeddedWallets: {
        createOnLogin: 'users-without-wallets',
        requireUserPasswordOnCreate: false,
    },
};

/**
 * Privy App ID
 * Required for PrivyProvider initialization
 */
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'cmkynk4a000ttjr0ccw9ywbgi';

/**
 * Privy Client ID  
 * Required for PrivyProvider initialization
 */
export const PRIVY_CLIENT_ID = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || 'client_FNV94Lvfusu8KMbrSBbJb3m631RMDyBakxCNP9CMMjotcQNz13ErBpMbcr2qPjToUsVWNUDLzrhNfd4aVgppQ9b';
