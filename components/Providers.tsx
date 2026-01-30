/**
 * Providers Component - Client-side wrapper for context providers
 */

'use client';

import React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { PRIVY_APP_ID, privyConfig } from '@/lib/privy-config';

interface ProvidersProps {
    children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
    return (
        <PrivyProvider
            appId={PRIVY_APP_ID}
            config={privyConfig}
        >
            {children}
        </PrivyProvider>
    );
}
