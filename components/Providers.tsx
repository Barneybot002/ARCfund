/**
 * Providers Component - Client-side wrapper for context providers
 * This allows the root layout to remain a Server Component
 */

'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { PRIVY_APP_ID, PRIVY_CLIENT_ID, privyConfig } from '@/lib/privy-config';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={PRIVY_APP_ID}
            clientId={PRIVY_CLIENT_ID}
            config={privyConfig}
        >
            {children}
        </PrivyProvider>
    );
}
