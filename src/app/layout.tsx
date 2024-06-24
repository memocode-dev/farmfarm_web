import type {Metadata} from 'next';
import {Inter as FontSans} from 'next/font/google';
import {cn} from '@/lib/utils';
import '../css/globals.css';
import TopBar from '@/components/common/TopBar';
import ClientProviders from '@/provider/ClientProviders';
import Script from 'next/script';

const fontSans = FontSans({
    subsets: ['latin'],
    variable: '--font-sans',
});

export const metadata: Metadata = {
    title: 'FARM FARM',
    description: 'Greenhouse Management System',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <Script
                    id="theme-color"
                    strategy="beforeInteractive"
                    src="/theme.js"
                />
            </head>
            <body
                className={cn(
                    'flex flex-col min-h-screen bg-background font-sans antialiased',
                    fontSans.variable
                )}
            >
            <ClientProviders>
                <TopBar />
                <div className="flex-1 flex mt-[50px]">
                    {children}
                </div>
            </ClientProviders>
            </body>
        </html>
    );
}
