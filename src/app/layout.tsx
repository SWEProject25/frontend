import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    template: '%s / X',
    default: 'X',
  },
  description: 'X clone',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={` bg-black text-white overflow-x-hidden`}>
        <div className="flex justify-center min-h-screen w-full">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
