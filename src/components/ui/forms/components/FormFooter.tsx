import React from 'react';
import { FooterLink, FormFooterProps } from '../types';

export function FormFooter({ footerLinks, onSwitchModal }: FormFooterProps) {
  if (footerLinks.length === 0) {
    return null;
  }

  const handleLinkClick = (link: FooterLink, e: React.MouseEvent) => {
    // Check if this is a modal switch action
    if (link.href === 'modal:signup' && onSwitchModal) {
      e.preventDefault();
      onSwitchModal('signup');
    } else if (link.href === 'modal:login' && onSwitchModal) {
      e.preventDefault();
      onSwitchModal('login');
    } else if (link.href === 'modal:createAccount' && onSwitchModal) {
      e.preventDefault();
      onSwitchModal('createAccount');
    }
    // For other links, let them navigate normally
  };

  return (
    <div className="text-center mt-8 space-y-2">
      {footerLinks.map((link, index) => (
        <p key={index} className="text-text-inactive">
          {link.text}{' '}
          <a
            href={link.href}
            className="text-primary hover:underline font-medium transition-colors"
            onClick={(e) => handleLinkClick(link, e)}
          >
            {link.linkText}
          </a>
        </p>
      ))}
    </div>
  );
}
