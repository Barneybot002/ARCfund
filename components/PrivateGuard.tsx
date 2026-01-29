/**
 * PrivateGuard Component - Guards private project content
 * Shows access request UI for encrypted projects
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import EncryptionBadge from './EncryptionBadge';
import ArciumIndicator from './ArciumIndicator';
import { scaleUp } from '@/lib/animations';

interface PrivateGuardProps {
    projectId: string;
    projectTitle: string;
    hasAccess: boolean;
    onRequestAccess?: () => void;
    children: React.ReactNode;
}

export default function PrivateGuard({
    projectId,
    projectTitle,
    hasAccess,
    onRequestAccess,
    children,
}: PrivateGuardProps) {
    const [requestSent, setRequestSent] = useState(false);
    const { authenticated, login } = usePrivy();

    const handleRequestAccess = () => {
        if (!authenticated) {
            login();
            return;
        }

        setRequestSent(true);
        onRequestAccess?.();
    };

    if (hasAccess) {
        return <>{children}</>;
    }

    return (
        <motion.div
            variants={scaleUp}
            initial="hidden"
            animate="visible"
            className="min-h-[500px] flex items-center justify-center p-8"
        >
            <div className="max-w-2xl w-full bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-purple-500/30 backdrop-blur-sm p-8 sm:p-12 text-center">
                {/* Lock Icon with Animation */}
                <motion.div
                    animate={{
                        rotate: [0, -5, 5, -5, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                    }}
                    className="inline-flex items-center justify-center w-24 h-24 bg-purple-600/20 rounded-full mb-6"
                >
                    <svg
                        className="w-12 h-12 text-purple-400"
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
                </motion.div>

                {/* Encryption Badge */}
                <div className="flex justify-center mb-6">
                    <EncryptionBadge isEncrypted={true} showTooltip={false} />
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold mb-4 text-white">
                    Private Project
                </h2>

                {/* Description */}
                <p className="text-gray-300 mb-2">
                    <strong>{projectTitle}</strong> is encrypted with Arcium MXE.
                </p>
                <p className="text-gray-400 mb-8">
                    This project&aposs details are confidential. Request access from the founder to view the full pitch,
                    team information, and funding details.
                </p>

                {/* Arcium Info Box */}
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-8">
                    <div className="flex items-start gap-3">
                        <ArciumIndicator size="md" className="mt-1" />
                        <div className="text-left flex-1">
                            <h4 className="font-semibold text-purple-300 mb-1">
                                Protected by Arcium Confidential Computing
                            </h4>
                            <p className="text-sm text-gray-400">
                                All sensitive data is encrypted through Multi-Party Computation (MPC).
                                Only approved investors can decrypt and view the content.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                {requestSent ? (
                    <div className="space-y-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-green-600/20 rounded-full mb-2"
                        >
                            <svg
                                className="w-8 h-8 text-green-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </motion.div>
                        <p className="text-green-400 font-semibold">Access Request Sent!</p>
                        <p className="text-gray-400 text-sm">
                            The founder will review your request. You&aposll be notified once access is granted.
                        </p>
                    </div>
                ) : (
                    <button
                        onClick={handleRequestAccess}
                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 rounded-lg font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                        </svg>
                        {authenticated ? 'Request Access' : 'Connect Wallet to Request Access'}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
