import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import '@/app/globals.css';
import LayoutWrapper from '@/features/layout/components/LayoutWrapper';

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
        {/* Keep layout wrapper fixed and centered */}
        <div className="flex justify-center min-h-screen w-full">
          <LayoutWrapper>{children}</LayoutWrapper>
        </div>
      </body>
    </html>
  );
}
