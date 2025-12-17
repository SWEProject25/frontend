import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    template: '%s / H',
    default: 'H',
  },
  description: 'X clone',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        sizes: '32x32',
      },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={` bg-black text-white overflow-x-hidden`}>
        <div className="flex justify-center min-h-screen w-full">
          {/* <MSWProvider> */}
          <Providers>
            <>{children}</>
            <ReactQueryDevtools initialIsOpen={false} />
          </Providers>
          {/* <Providers>{modal}</Providers> */}
          {/* </MSWProvider> */}
        </div>
      </body>
    </html>
  );
}
