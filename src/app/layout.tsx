import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import '@/app/globals.css';

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
          {children}
        </div>
      </body>
    </html>
  );
}
