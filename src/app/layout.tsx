import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import '@/app/globals.css';
import './globals.css';
import { Providers } from '@/lib/providers';

export const metadata: Metadata = {
  title: {
    template: '%s / X',
    default: 'X',
  },
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
