// Root layout — mounts the universal nav, nothing else. Character pages own their own aesthetic.
import type { Metadata } from 'next';
import { Barlow_Condensed, IBM_Plex_Mono } from 'next/font/google';
import { Nav } from '@/components/nav/Nav';
import './globals.css';

const headline = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['300', '500', '700', '900'],
  variable: '--font-headline',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Artisty // Signal & Smoke',
  description: 'Signal & Smoke — the smokedope2016 archive.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${headline.variable} ${mono.variable}`}>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
