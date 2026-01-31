/**
 * EncryptionBadge - Shows encryption status on private projects
 * Displays on project cards and detail pages for encrypted content
 * 
 * Shows different states:
 * - Locked (no access)
 * - Unlocked (has access, viewing decrypted)
 * - Compact version for inline use
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ArciumIndicator from './ArciumIndicator';

interface EncryptionBadgeProps {
    isEncrypted: boolean;
    hasAccess?: boolean;
    variant?: 'default' | 'compact' | 'inline';
    showTooltip?: boolean;
}

export default function EncryptionBadge({
    isEncrypted,
    hasAccess = false,
    variant = 'default',
    showTooltip = true
}: EncryptionBadgeProps) {
    if (!isEncrypted) return null;

    // Inline variant - just an icon
    if (variant === 'inline') {
        return (
            <span
                className={`inline-flex items-center ${hasAccess ? 'text-green-400' : 'text-purple-400'}`}
                title={hasAccess ? 'Decrypted - You have access' : 'Encrypted with Arcium MXE'}
            >
                {hasAccess ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                )}
            </span>
        );
    }

    // Compact variant
    if (variant === 'compact') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${hasAccess
                        ? 'bg-green-600/20 border-green-500/40'
                        : 'bg-purple-600/20 border-purple-500/40'
                    }`}
                title={showTooltip ? (hasAccess ? 'Decrypted - You have access' : 'End-to-end encrypted with Arcium MXE') : undefined}
            >
                {hasAccess ? (
                    <>
                        <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-medium text-green-300">Unlocked</span>
                    </>
                ) : (
                    <>
                        <ArciumIndicator size="sm" />
                        <span className="text-xs font-medium text-purple-300">Encrypted</span>
                    </>
                )}
            </motion.div>
        );
    }

    // Default variant
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg border backdrop-blur-sm ${hasAccess
                    ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-500/30'
                    : 'bg-gradient-to-r from-purple-900/40 to-violet-900/40 border-purple-500/30'
                }`}
        >
            {/* Indicator */}
            {hasAccess ? (
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            ) : (
                <ArciumIndicator size="md" />
            )}

            {/* Lock/Unlock icon */}
            {hasAccess ? (
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            )}

            {/* Text */}
            <div className="flex flex-col">
                <span className={`text-sm font-semibold ${hasAccess ? 'text-green-200' : 'text-purple-200'}`}>
                    {hasAccess ? 'Access Granted' : 'End-to-End Encrypted'}
                </span>
                <span className={`text-xs ${hasAccess ? 'text-green-400' : 'text-purple-400'}`}>
                    {hasAccess ? 'Viewing decrypted content' : 'Powered by Arcium MXE'}
                </span>
            </div>

            {showTooltip && (
                <div className="hidden group-hover:block absolute top-full mt-2 p-2 bg-gray-900 rounded text-xs text-gray-300 whitespace-nowrap z-10">
                    {hasAccess
                        ? 'You have been granted access to view this content'
                        : 'This content is encrypted using Arcium confidential computing'
                    }
                </div>
            )}
        </motion.div>
    );
}
