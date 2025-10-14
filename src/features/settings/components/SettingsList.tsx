'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SettingsOption } from '@/constants/SETTINGs_ITEMS';

interface SettingsListProps {
  options: SettingsOption[];
}

export default function SettingsList({ options }: SettingsListProps) {
  const pathname = usePathname();

  return (
    <div className="border-r border-border min-h-screen w-full">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6 text-text-active">Settings</h1>
        <nav className="space-y-1">
          {options.map((option) => {
            const isActive = pathname.startsWith(`/settings/${option.id}`);

            return (
              <Link
                key={option.id}
                href={option.subOptions[0]?.path || '#'}
                className={`
                  block px-4 py-3 rounded-lg transition-colors
                  hover:bg-muted
                  ${isActive ? 'bg-muted' : ''}
                `}
              >
                <div className="font-semibold text-text-active">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-sm text-text-inactive mt-1">
                    {option.description}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
