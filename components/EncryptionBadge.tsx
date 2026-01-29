/**
 * EncryptionBadge - Shows encryption status on private projects
 * Displays on project cards and detail pages for encrypted content
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ArciumIndicator from './ArciumIndicator';

interface EncryptionBadgeProps {
    isEncrypted: boolean;
    variant?: 'default' | 'compact';
    showTooltip?: boolean;
}

export default function EncryptionBadge({
    isEncrypted,
    variant = 'default',
    showTooltip = true
}: EncryptionBadgeProps) {
    if (!isEncrypted) return null;

    if (variant === 'compact') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600/20 rounded-full border border-purple-500/40"
                title={showTooltip ? 'End-to-end encrypted with Arcium MXE' : undefined}
            >
                <ArciumIndicator size="sm" />
                <span className="text-xs font-medium text-purple-300">Encrypted</span>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900/40 to-violet-900/40 rounded-lg border border-purple-500/30 backdrop-blur-sm"
        >
            {/* Flashing indicator */}
            <ArciumIndicator size="md" />

            {/* Lock icon */}
            <svg
                className="w-5 h-5 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
            </svg>

            {/* Text */}
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-purple-200">
                    End-to-End Encrypted
                </span>
                <span className="text-xs text-purple-400">
                    Powered by Arcium MXE
                </span>
            </div>

            {showTooltip && (
                <div className="hidden group-hover:block absolute top-full mt-2 p-2 bg-gray-900 rounded text-xs text-gray-300 whitespace-nowrap z-10">
                    This content is encrypted using Arcium&aposconfidential computing
                </div>
            )}
        </motion.div>
    );
}
