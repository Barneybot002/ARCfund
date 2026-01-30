/**
 * Testimonials - Social proof section
 */

'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const testimonials = [
    {
        quote: "ARCfund's privacy-first approach gave me confidence to share my pitch without fear of idea theft. The Arcium encryption is a game-changer.",
        author: 'Sarah K.',
        role: 'Founder @ DeFi Protocol',
        avatar: '👩‍💻',
    },
    {
        quote: "As an investor, I love the transparency combined with privacy. I can see verified project metrics while founders maintain control over sensitive details.",
        author: 'Michael R.',
        role: 'Angel Investor',
        avatar: '👨‍💼',
    },
    {
        quote: "We raised $500K in our seed round using ARCfund. The selective disclosure feature let us control exactly who saw our financials.",
        author: 'Alex T.',
        role: 'CEO @ GameFi Startup',
        avatar: '🧑‍🚀',
    },
];

export default function Testimonials() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section ref={ref} className="py-20 px-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />

            <div className="max-w-4xl mx-auto relative">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Trusted by <span className="bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">Innovators</span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Hear from founders and investors who built with ARCfund
                    </p>
                </motion.div>

                {/* Testimonial Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700/50 p-8 md:p-10"
                        >
                            {/* Quote icon */}
                            <div className="text-5xl text-purple-500/30 mb-4">&ldquo;</div>

                            {/* Quote */}
                            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                                {testimonials[activeIndex].quote}
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-full flex items-center justify-center text-2xl">
                                    {testimonials[activeIndex].avatar}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{testimonials[activeIndex].author}</p>
                                    <p className="text-sm text-gray-400">{testimonials[activeIndex].role}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation dots */}
                    <div className="flex items-center justify-center gap-3 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex
                                        ? 'bg-purple-500 scale-125'
                                        : 'bg-gray-600 hover:bg-gray-500'
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
