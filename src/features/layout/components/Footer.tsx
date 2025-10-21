import React from 'react';

export default function Footer() {
  return (
    <footer className="text-gray-500 text-xs space-y-2 px-2 pb-4">
      <div className="flex flex-wrap gap-3">
        {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((link) => (
          <a key={link} href="#" className="hover:underline">
            {link}
          </a>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {['Accessibility', 'Ads info', 'More'].map((link) => (
          <a key={link} href="#" className="hover:underline">
            {link}
          </a>
        ))}
      </div>
      <div>© 2025 X Corp.</div>
    </footer>
  );
}
