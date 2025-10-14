'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SettingsOption } from '@/constants/SETTINGs_ITEMS';

interface SettingsDetailProps {
  selectedOption: SettingsOption | null;
}

export default function SettingsDetail({
  selectedOption,
}: SettingsDetailProps) {
  const pathname = usePathname();

  if (!selectedOption) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-text-inactive">Select a setting to view options</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-6 text-text-active">
        {selectedOption.label}
      </h2>
      <div className="space-y-4">
        {selectedOption.subOptions.map((subOption) => {
          const isActive = pathname === subOption.path;

          return (
            <Link
              key={subOption.id}
              href={subOption.path}
              className={`
                block p-4 rounded-lg border transition-colors
                hover:bg-muted
                ${isActive ? 'border-primary bg-muted' : 'border-border'}
              `}
            >
              <div className="font-semibold text-text-active">
                {subOption.label}
              </div>
              {subOption.description && (
                <div className="text-sm text-text-inactive mt-1">
                  {subOption.description}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
