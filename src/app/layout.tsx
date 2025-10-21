import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'Home / X',
  description: 'X clone',
};

const lexend = Lexend({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${lexend.className} bg-black text-white overflow-x-hidden`}
      >
        <div className="flex justify-center min-h-screen w-full">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
