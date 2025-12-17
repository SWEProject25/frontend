import Link from 'next/link';
import React from 'react';
import { FOOTER_LINKS } from '../constants';
import { APP_CONFIG } from '@/lib/constants';

export function AuthFooter() {
  return (
    <footer className="w-full py-4 px-4 sm:px-6">
      <div className="w-full">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-text-inactive">
          {FOOTER_LINKS.map((link) => (
            <React.Fragment key={link}>
              <Link
                href="#"
                className="hover:underline hover:underline-offset-2 transition-colors"
              >
                {link}
              </Link>
              <span className="text-text-inactive">|</span>
            </React.Fragment>
          ))}
          <span className="text-text-inactive">
            © {APP_CONFIG.YEAR} {APP_CONFIG.COMPANY}
          </span>
        </div>
      </div>
    </footer>
  );
}
