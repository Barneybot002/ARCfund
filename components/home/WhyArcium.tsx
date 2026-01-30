/**
 * Why Arcium - Privacy features section
 */

'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const features = [
    {
        icon: '🔐',
        title: 'Protect Your IP',
        description: 'Keep your innovative ideas encrypted until you\'re ready to share with verified investors. Your pitch deck stays private.',
        gradient: 'from-purple-500 to-violet-500',
    },
    {
        icon: '🎯',
        title: 'Selective Disclosure',
        description: 'Choose exactly who can see your full pitch. Grant access to verified investors only when you\'re ready.',
        gradient: 'from-violet-500 to-indigo-500',
    },
    {
        icon: '⚡',
        title: 'Confidential Computing',
        description: 'Powered by Arcium MXE - military-grade encryption with zero knowledge architecture. Your data never leaves secure enclaves.',
        gradient: 'from-indigo-500 to-purple-500',
    },
    {
        icon: '🛡️',
        title: 'Verifiable Security',
        description: 'Every transaction and access grant is recorded on-chain. Full audit trail with cryptographic guarantees.',
        gradient: 'from-purple-500 to-pink-500',
    },
];

export default function WhyArcium() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
        <section ref={ref} className="py-20 px-4 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-purple-900/10 to-gray-900/50" />

            <div className="max-w-6xl mx-auto relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
                        <span className="text-purple-400 text-sm font-medium">Powered by Arcium MXE</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Why Privacy Matters in <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Fundraising</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Your innovative ideas deserve protection. ARCfund uses cutting-edge confidential computing to keep your pitch secure.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                            className="group relative"
                        >
                            <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-8 hover:border-purple-500/40 transition-all duration-300 h-full overflow-hidden">
                                {/* Hover glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                <div className="relative flex items-start gap-5">
                                    {/* Icon */}
                                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                        <span className="text-2xl">{feature.icon}</span>
                                    </div>

                                    {/* Content */}
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Arcium CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-12 text-center"
                >
                    <a
                        href="https://arcium.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group"
                    >
                        <span>Learn more about Arcium</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
