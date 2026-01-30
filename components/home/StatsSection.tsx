/**
 * Stats Section - Animated counter stats
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatItemProps {
    value: number;
    suffix: string;
    label: string;
    delay: number;
}

function StatItem({ value, suffix, label, delay }: StatItemProps) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    useEffect(() => {
        if (!isInView) return;

        const duration = 2000;
        const steps = 60;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isInView, value]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay, duration: 0.6 }}
            className="text-center px-8 py-6"
        >
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {isInView ? (
                    <>
                        {suffix === '$' && '$'}
                        {count.toLocaleString()}
                        {suffix !== '$' && suffix}
                    </>
                ) : (
                    '0'
                )}
            </div>
            <p className="text-gray-400 text-sm font-medium">{label}</p>
        </motion.div>
    );
}

const stats = [
    { value: 5, suffix: 'M+', prefix: '$', label: 'Total Raised' },
    { value: 150, suffix: '+', label: 'Projects Funded' },
    { value: 10, suffix: 'K+', label: 'Active Users' },
    { value: 98, suffix: '%', label: 'Success Rate' },
];

export default function StatsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <section ref={ref} className="py-16 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent" />

            <div className="max-w-6xl mx-auto px-4 relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl border border-purple-500/20 backdrop-blur-sm overflow-hidden"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-700/30">
                        {stats.map((stat, index) => (
                            <StatItem
                                key={index}
                                value={stat.value}
                                suffix={stat.suffix || ''}
                                label={stat.label}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
