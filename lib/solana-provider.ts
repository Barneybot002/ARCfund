import React, { useEffect, useState, createContext, useContext } from 'react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { AnchorProvider, Wallet } from '@project-serum/anchor';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import * as projectStorage from './project-storage';
import { arciumConfig } from './arcium-config';

type SolanaContextValue = {
    provider: AnchorProvider | null;
    ready: boolean;
    initializing: boolean;
};

const SolanaContext = createContext<SolanaContextValue>({ provider: null, ready: false, initializing: false });

/** Minimal wallet adapter for injected wallets (Phantom/Privy-injected) */
class InjectedWallet {
    public publicKey!: PublicKey;
    private provider: any;

    constructor(provider?: any, pubkey?: string) {
        this.provider = provider;
        if (pubkey) this.publicKey = new PublicKey(pubkey);
    }

    async ensureConnected(): Promise<void> {
        if (!this.provider) return;
        try {
            // If provider already exposes a publicKey, use it
            if (this.provider.publicKey) {
                this.publicKey = new PublicKey(this.provider.publicKey.toString());
                return;
            }

            // Try connecting; some wallets support connect() and some emit events
            if (typeof this.provider.connect === 'function') {
                try {
                    const res = await this.provider.connect();
                    // Phantom returns { publicKey }
                    if (res && res.publicKey) {
                        this.publicKey = new PublicKey(res.publicKey.toString());
                        return;
                    }
                } catch (e) {
                    console.warn('provider.connect() threw:', e);
                }
            }

            // As a fallback, try reading provider.publicKey again (some wallets update it asynchronously)
            if (this.provider.publicKey) {
                this.publicKey = new PublicKey(this.provider.publicKey.toString());
                return;
            }
        } catch (err) {
            console.warn('Injected wallet connect failed:', err);
        }
    }

    signTransaction(tx: any) {
        if (!this.provider || typeof this.provider.signTransaction !== 'function') return Promise.reject(new Error('Wallet signing unsupported'));
        return this.provider.signTransaction(tx);
    }

    signAllTransactions(txs: any[]) {
        if (!this.provider) return Promise.reject(new Error('signAllTransactions not supported'));
        return typeof this.provider.signAllTransactions === 'function'
            ? this.provider.signAllTransactions(txs)
            : Promise.all(txs.map((tx: any) => this.signTransaction(tx)));
    }
}

export function useSolanaProvider() {
    const { ready, authenticated } = usePrivy();
    const { wallets } = useWallets();
    const [provider, setProvider] = useState<AnchorProvider | null>(null);
    const [initializing, setInitializing] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function init() {
            if (!ready || !authenticated) return;
            if (provider) return;

            setInitializing(true);

            try {
                const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
                const connection = new Connection(rpcUrl, 'processed');

                // Prefer injected wallet (Phantom or Privy-injected)
                // If window.solana is present, use it as signer
                // Otherwise leave provider null (on-chain ops will be no-op)
                // Many embedded wallets (including Privy) inject `window.solana` or expose a similar API.
                // This implementation will work with Phantom and most injected wallets.
                // For deep Privy SDK integration, additional adapter code can be added later.

                // @ts-ignore
                const injected = typeof window !== 'undefined' && window?.solana;

                if (injected) {
                    // Use injected wallet (Phantom, etc.) when available
                    // @ts-ignore
                    const providerObj = window.solana;
                    // @ts-ignore
                    const pub = providerObj.publicKey?.toString?.() ?? null;
                    const wallet = new InjectedWallet(providerObj, pub ?? undefined);

                    console.debug('[solana-provider] detected injected wallet:', {
                        isPhantom: providerObj.isPhantom ?? false,
                        hasPublicKey: !!providerObj.publicKey,
                    });


                    // Attempt to actively connect so Phantom will prompt if needed
                    try {
                        console.debug('[solana-provider] calling ensureConnected on injected wallet');
                        await wallet.ensureConnected();
                        console.debug('[solana-provider] ensureConnected returned, wallet.publicKey:', wallet.publicKey?.toString?.());
                    } catch (err) {
                        console.warn('[solana-provider] ensureConnected for injected wallet failed:', err);
                    }

                    if (!wallet.publicKey) {
                        console.error('[solana-provider] injected wallet did not expose publicKey after connect; aborting AnchorProvider creation');
                    } else {
                        const anchorProvider = new AnchorProvider(connection, wallet as any, {
                            preflightCommitment: 'processed',
                            commitment: 'processed',
                        });

                        if (!mounted) return;
                        setProvider(anchorProvider);

                        console.info('[solana-provider] AnchorProvider created with injected wallet');
                    }

                    // project-storage initialization is not required here
                } else {
                    // Try to use Privy's embedded Solana wallet
                    const embeddedWallet = wallets?.find(
                        (w: any) => w.walletClientType === 'privy' && w.chainType === 'solana'
                    );

                    if (embeddedWallet && embeddedWallet.address) {
                        try {
                            // Create an adapter that uses the embedded wallet's signTransaction method
                            class PrivyEmbeddedWallet {
                                publicKey: PublicKey;
                                private embeddedWallet: any;

                                constructor(embeddedWallet: any) {
                                    this.publicKey = new PublicKey(embeddedWallet.address);
                                    this.embeddedWallet = embeddedWallet;
                                }

                                signTransaction(tx: Transaction): Promise<Transaction> {
                                    // Use the embedded wallet's signTransaction method
                                    return this.embeddedWallet.signTransaction(tx);
                                }

                                signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
                                    // Use the embedded wallet's signAllTransactions if available
                                    return this.embeddedWallet.signAllTransactions
                                        ? this.embeddedWallet.signAllTransactions(txs)
                                        : Promise.all(txs.map((tx) => this.signTransaction(tx)));
                                }
                            }

                            const wallet = new PrivyEmbeddedWallet(embeddedWallet);
                            const anchorProvider = new AnchorProvider(connection, wallet as any, {
                                preflightCommitment: 'processed',
                                commitment: 'processed',
                            });

                            if (!mounted) return;
                            setProvider(anchorProvider);

                            // project-storage initialization is not required here
                        } catch (err) {
                            console.error('Failed to initialize Privy embedded wallet provider:', err);
                        }
                    } else {
                        console.warn(
                            'No injected Solana wallet found (window.solana) and no Privy embedded Solana wallet available. On-chain actions will be disabled.'
                        );
                    }
                }
            } catch (err) {
                console.error('Failed to initialize Solana provider:', err);
            } finally {
                if (mounted) setInitializing(false);
            }
        }

        init();
        return () => { mounted = false; };
    }, [ready, authenticated, wallets]);

    return { provider, ready: !!provider, initializing };
}

export function SolanaProvider({ children }: { children: React.ReactNode }) {
    const value = useSolanaProvider();
    return React.createElement(SolanaContext.Provider, { value }, children);
}

export function useSolanaContext() {
    return useContext(SolanaContext);
}
