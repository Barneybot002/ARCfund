/**
 * Root Layout - Wraps entire app with Privy provider
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ARCfund - Private Fundraising with Confidential Computing',
    description: 'Fundraising platform powered by Arcium MXE. Encrypt your pitch, protect your vision, and raise funds with complete privacy.',
    keywords: ['fundraising', 'privacy', 'Arcium', 'confidential computing', 'MPC', 'Web3', 'crypto'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} min-h-screen flex flex-col bg-gray-950 text-white`}>
                <Providers>
                    <Header />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
