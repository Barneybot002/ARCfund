/**
 * ArciumIndicator - Flashing red light indicator
 * Shows Arcium MXE status with animated red light
 */

'use client';

import React from 'react';

export type IndicatorSize = 'sm' | 'md' | 'lg';

interface ArciumIndicatorProps {
    size?: IndicatorSize;
    className?: string;
}

export default function ArciumIndicator({ size = 'sm', className = '' }: ArciumIndicatorProps) {
    const sizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
    };

    return (
        <div className={`relative inline-flex ${className}`}>
            {/* Pulsing red light */}
            <div className={`${sizes[size]} bg-red-500 rounded-full animate-pulse`}></div>
            {/* Ping effect for extra attention */}
            <div className={`absolute inset-0 ${sizes[size]} bg-red-500 rounded-full animate-ping opacity-75`}></div>
        </div>
    );
}
