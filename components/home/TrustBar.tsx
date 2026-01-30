/**
 * Trust Bar - Horizontal trust indicators
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

const trustItems = [
    { icon: '🔐', text: 'End-to-End Encrypted' },
    { icon: '⚡', text: 'Built on Solana' },
    { icon: '🛡️', text: 'Powered by Arcium MXE' },
    { icon: '✨', text: 'Privacy First' },
];

export default function TrustBar() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full py-3 bg-gradient-to-r from-purple-900/20 via-gray-900/50 to-purple-900/20 border-b border-purple-500/10"
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-center gap-4 md:gap-8 overflow-x-auto scrollbar-hide">
                    {trustItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex items-center gap-2 px-4 py-1.5 bg-gray-800/40 rounded-full border border-gray-700/30 whitespace-nowrap"
                        >
                            <span className="text-sm">{item.icon}</span>
                            <span className="text-xs font-medium text-gray-300">{item.text}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
