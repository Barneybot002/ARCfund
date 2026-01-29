/**
 * ArciumBadge - Full Arcium badge with flashing indicator
 * Displays "Powered by Arcium MXE" with red indicator and confidential computing text
 */

'use client';

import React from 'react';
import ArciumIndicator from './ArciumIndicator';

interface ArciumBadgeProps {
    showSubtext?: boolean;
    className?: string;
}

export default function ArciumBadge({ showSubtext = true, className = '' }: ArciumBadgeProps) {
    return (
        <div className={`flex items-center gap-3 px-4 py-2 bg-purple-900/30 rounded-full border border-purple-500/30 backdrop-blur-sm hover:bg-purple-900/40 transition-colors duration-300 ${className}`}>
            {/* Flashing red light indicator */}
            <ArciumIndicator size="md" />

            {/* Badge text */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-sm font-medium text-purple-200 whitespace-nowrap">
                    Powered by Arcium MXE
                </span>

                {showSubtext && (
                    <span className="text-xs text-purple-400 whitespace-nowrap">
                        🔐 Confidential Computing
                    </span>
                )}
            </div>
        </div>
    );
}
