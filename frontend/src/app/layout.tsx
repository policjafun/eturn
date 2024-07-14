import './globals.css';

import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { RequestLog } from '@/types/requestLog';
import { headers } from 'next/headers';

import { SpeedInsights } from '@vercel/speed-insights/next';

const poppins = Poppins({ subsets: ['latin'], weight: '400', style: 'normal' });

export const metadata: Metadata = {
    title: 'eturn — Next generation of Discord bots',
    other: {
        'og:title': 'eturn — Next generation of Discord bots',
        'og:description':
            'eturn is a Discord bot that offers a wide range of features to help you manage your server.',
        'og:image': 'https://eturn.app/images/comets_smaller.png',
        'og:url': 'https://eturn.app',
        'theme-color': '#efca69',
        'twitter:card': 'summary_large_image',
    },
};

// export const runtime = 'edge';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const header = headers();

    fetch('https://api.eturn.app/v1/request.log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            method: 'GET',
            ip: header.get('x-forwarded-for')
                ? header.get('x-forwarded-for')
                : null,
            country: header.get('cf-ipcountry')
                ? header.get('cf-ipcountry')
                : null,
            userAgent: header.get('user-agent')
                ? header.get('user-agent')
                : null,
            referrer: header.get('referer') ? header.get('referer') : null,
            language: header.get('accept-language')
                ? header.get('accept-language')
                : null,
        } as RequestLog),
    }).catch(() => {});

    return (
        <html lang="en">
            <body className={poppins.className}>
                {children}
                <SpeedInsights />
            </body>
        </html>
    );
}
