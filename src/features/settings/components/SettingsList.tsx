'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ListItem from '@/components/ui/ListItem';
import { SearchInput } from '@/components/ui/input';
import type { SettingsOption } from '@/features/settings/constants/SETTINGs_ITEMS';

interface SettingsListProps {
  options: SettingsOption[];
}

export default function SettingsList({ options }: SettingsListProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    window.history.back();
  };

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return options;
    }

    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  return (
    <div className="border-r border-border min-h-screen">
      <div className="">
        <Breadcrumb
          title="Settings"
          subtitle="@ahmedfathy0-0"
          onBack={handleBack}
          showSubtitleOnMobile={false}
        />

        {/* Search Input */}
        <div className="px-2 mb-2">
          <SearchInput
            placeholder="Search Settings"
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {/* Settings List */}
        <nav className="flex flex-col">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isActive = pathname
                ? pathname.startsWith(`/settings/${option.id}`)
                : false;

              return (
                <ListItem
                  key={option.id}
                  label={option.label}
                  href={option.path || '#'}
                  isActive={isActive}
                  showArrow={true}
                />
              );
            })
          ) : (
            <div className="px-4 py-8 text-center text-text-inactive">
              No settings found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
