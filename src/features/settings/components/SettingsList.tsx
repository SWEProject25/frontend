'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ListItem from '@/components/ui/ListItem';
import OptionItem from '@/components/ui/OptionItem';
import { SearchInput } from '@/components/ui/input';
import type {
  SettingsOption,
  SettingsSubOption,
} from '@/features/settings/constants/SETTINGs_ITEMS';

interface SettingsListProps {
  options: SettingsOption[];
}

interface FlattenedSettingItem {
  id: string;
  label: string;
  description?: string;
  path: string;
  breadcrumb: string[];
}

export default function SettingsList({ options }: SettingsListProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    window.history.back();
  };

  // Flatten all settings including nested items
  const flattenedSettings = useMemo(() => {
    const flattened: FlattenedSettingItem[] = [];

    const flatten = (
      items: (SettingsOption | SettingsSubOption)[],
      breadcrumb: string[] = []
    ) => {
      items.forEach((item) => {
        // Add the current item if it has a path
        if ('path' in item && item.path) {
          flattened.push({
            id: item.id,
            label: item.label,
            description: item.description,
            path: item.path,
            breadcrumb,
          });
        }

        // Recursively flatten subOptions
        if (
          'subOptions' in item &&
          item.subOptions &&
          item.subOptions.length > 0
        ) {
          flatten(item.subOptions, [...breadcrumb, item.label]);
        }
      });
    };

    flatten(options);
    return flattened;
  }, [options]);

  // Filter options based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      // Return top-level options when no search
      return options.map((option) => ({
        id: option.id,
        label: option.label,
        description: option.description,
        path: option.path || '#',
        breadcrumb: [] as string[],
      }));
    }

    const query = searchQuery.toLowerCase();
    return flattenedSettings.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.breadcrumb.some((crumb) => crumb.toLowerCase().includes(query))
    );
  }, [options, flattenedSettings, searchQuery]);

  return (
    <div
      className="border-r border-border min-h-screen"
      data-testid="settings-list"
    >
      <div className="">
        <Breadcrumb
          title="Settings"
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
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isActive = pathname ? pathname === item.path : false;

              return (
                <ListItem
                  key={item.id}
                  href={item.path}
                  isActive={isActive}
                  data-testid={`settings-list-item-${item.id}`}
                >
                  <OptionItem
                    label={item.label}
                    description={
                      searchQuery && item.breadcrumb.length > 0
                        ? item.breadcrumb.join(' > ')
                        : item.description
                    }
                    showArrow={true}
                    data-testid={`settings-option-${item.id}`}
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
