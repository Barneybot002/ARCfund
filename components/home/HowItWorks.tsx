/**
 * How It Works - 3-step process section
 */

'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getUserProfile } from '@/lib/user-storage';
import { usePrivy } from '@privy-io/react-auth';

const steps = [
    {
        number: '01',
        icon: '🔗',
        title: 'Connect Wallet',
        description: 'Link your Solana wallet securely with Privy',
        founderText: 'Connect your wallet to start creating projects',
        investorText: 'Connect your wallet to browse opportunities',
    },
    {
        number: '02',
        icon: '🚀',
        title: 'Create or Browse',
        description: 'Create encrypted pitches or discover projects',
        founderText: 'Upload your pitch with military-grade encryption',
        investorText: 'Explore verified projects seeking funding',
    },
    {
        number: '03',
        icon: '💎',
        title: 'Secure Funding',
        description: 'Raise funds or invest with complete privacy',
        founderText: 'Receive investments while protecting your IP',
        investorText: 'Invest confidently with transparent terms',
    },
];

export default function HowItWorks() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const { authenticated } = usePrivy();
    const userProfile = authenticated ? getUserProfile() : null;

    return (
        <section ref={ref} className="py-20 px-4 relative">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        How <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">ARCfund</span> Works
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {userProfile?.role === 'founder'
                            ? 'Encrypt your pitch, protect your vision, and raise funds securely'
                            : userProfile?.role === 'investor'
                                ? 'Discover and invest in innovative projects with confidence'
                                : 'Simple, secure, and private fundraising for the Web3 era'}
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
                            className="relative group"
                        >
                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent z-0" />
                            )}

                            <div className="relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-8 hover:border-purple-500/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/10 h-full">
                                {/* Step number */}
                                <div className="absolute -top-4 -left-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-3xl">{step.icon}</span>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {userProfile?.role === 'founder'
                                        ? step.founderText
                                        : userProfile?.role === 'investor'
                                            ? step.investorText
                                            : step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
