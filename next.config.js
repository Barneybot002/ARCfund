/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Configure Solana dependencies as externals (required for Privy Solana support)
    config.externals = config.externals || {};
    config.externals['@solana/kit'] = 'commonjs @solana/kit';
    config.externals['@solana-program/memo'] = 'commonjs @solana-program/memo';
    config.externals['@solana-program/system'] = 'commonjs @solana-program/system';
    config.externals['@solana-program/token'] = 'commonjs @solana-program/token';

    return config;
  },
  // Add turbopack configuration to silence Next.js 16.1.6 warning
  turbopack: {},
};

module.exports = nextConfig;
