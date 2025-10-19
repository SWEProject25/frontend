import React from 'react';
import { FormFooterProps } from '../types';
import { handleFooterLinkClick } from '../utils';

export function FormFooter({ footerLinks, onSwitchModal }: FormFooterProps) {
  if (footerLinks.length === 0) {
    return null;
  }

  return (
    <div className="text-center mt-8 space-y-2">
      {footerLinks.map((link, index) => (
        <p key={index} className="text-text-inactive">
          {link.text}{' '}
          <a
            href={link.href}
            className="text-primary hover:underline font-medium transition-colors"
            onClick={(e) => handleFooterLinkClick(link, e, onSwitchModal)}
          >
            {link.linkText}
          </a>
        </p>
      ))}
    </div>
  );
}
