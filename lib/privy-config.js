/**
 * Privy Configuration
 * Standard dark theme with purple accent
 */
/**
 * Privy App ID - Required for PrivyProvider initialization
 */
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
/**
 * Privy configuration options
 */
export const privyConfig = {
    // Appearance configuration
    appearance: {
        theme: 'dark',
        accentColor: '#8B5CF6',
        logo: '/logo.png',
    },
    // Login methods - wallet and email
    loginMethods: ['wallet', 'email'],
    // Embedded wallet configuration
    embeddedWallets: {
        createOnLogin: 'users-without-wallets',
    },
};
