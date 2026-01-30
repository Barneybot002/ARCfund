/**
 * Trust Bar - Horizontal trust indicators with infinite scroll animation
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

// Duplicate items for seamless loop
const scrollItems = [...trustItems, ...trustItems, ...trustItems];

export default function TrustBar() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full py-3 bg-gradient-to-r from-purple-900/20 via-gray-900/50 to-purple-900/20 border-b border-purple-500/10 overflow-hidden"
        >
            <div className="relative">
                {/* Scrolling container */}
                <motion.div
                    className="flex items-center gap-8"
                    animate={{
                        x: ['0%', '-33.333%'],
                    }}
                    transition={{
                        duration: 25,
                        ease: 'linear',
                        repeat: Infinity,
                    }}
                >
                    {scrollItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 px-4 py-1.5 bg-gray-800/40 rounded-full border border-gray-700/30 whitespace-nowrap flex-shrink-0"
                        >
                            <span className="text-sm">{item.icon}</span>
                            <span className="text-xs font-medium text-gray-300">{item.text}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
}
