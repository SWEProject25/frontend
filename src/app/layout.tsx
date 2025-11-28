import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import './globals.css';
import { Providers } from '@/lib/providers';
import { MSWProvider } from '@/mocks/MSWProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    template: '%s / X',
    default: 'X',
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
  gifModal,
  scheduleModal,
}: {
  children: React.ReactNode;
  gifModal: React.ReactNode;
  scheduleModal: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={` bg-black text-white overflow-x-hidden`}>
        <div className="flex justify-center min-h-screen w-full">
          {/* <MSWProvider> */}
          <Providers>
            <>
              {children}
              {gifModal}
              {scheduleModal}
            </>
          </Providers>
          {/* <Providers>{modal}</Providers> */}
          {/* </MSWProvider> */}
        </div>
      </body>
    </html>
  );
}
