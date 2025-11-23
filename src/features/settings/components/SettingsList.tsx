'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ListItem from '@/components/ui/ListItem';
import OptionItem from '@/components/ui/OptionItem';
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
    <div
      className="border-r border-border min-h-screen"
      data-testid="settings-list"
    >
      <div className="">
        <Breadcrumb
          title="Settings"
          subtitle="@ahmedfathy0-0"
          onBack={handleBack}
          showSubtitleOnMobile={false}
          data-testid="settings-breadcrumb"
        />

        {/* Search Input */}
        <div className="px-2 mb-2" data-testid="settings-search-container">
          <SearchInput
            placeholder="Search Settings"
            value={searchQuery}
            onChange={setSearchQuery}
            data-testid="settings-search-input"
          />
        </div>

        {/* Settings List */}
        <nav className="flex flex-col" data-testid="settings-nav">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isActive = pathname
                ? pathname.startsWith(`/settings/${option.id}`)
                : false;

              return (
                <ListItem
                  key={option.id}
                  href={option.path || '#'}
                  isActive={isActive}
                  data-testid={`settings-list-item-${option.id}`}
                >
                  <OptionItem
                    label={option.label}
                    showArrow={true}
                    data-testid={`settings-option-${option.id}`}
                  />
                </ListItem>
              );
            })
          ) : (
            <div
              className="px-4 py-8 text-center text-text-inactive"
              data-testid="settings-no-results"
            >
              No settings found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </nav>
      </div>
    </div>
  );
}
