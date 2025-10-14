'use client';

import { usePathname } from 'next/navigation';
import { SETTINGS_ITEMS } from '@/constants/SETTINGs_ITEMS';
import SettingsList from './SettingsList';
import SettingsDetail from './SettingsDetail';

interface SettingsLayoutProps {
  children?: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  // Find the currently selected option based on the pathname
  const selectedOption = SETTINGS_ITEMS.find((option) =>
    pathname.startsWith(`/settings/${option.id}`)
  );

  // Check if current path is a main category path (first suboption of a category)
  const isShowingSuboptions =
    selectedOption &&
    selectedOption.subOptions.length > 0 &&
    pathname === selectedOption.subOptions[0].path;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] min-h-screen">
      {/* First Column - Main Options */}
      <SettingsList options={SETTINGS_ITEMS} />

      {/* Second Column - Show suboptions list or page content */}
      <div>
        {isShowingSuboptions ? (
          <SettingsDetail selectedOption={selectedOption} />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
