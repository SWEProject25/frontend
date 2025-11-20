'use client';

import { usePathname } from 'next/navigation';
import { SETTINGS_ITEMS } from '@/features/settings/constants/SETTINGs_ITEMS';
import SettingsList from './SettingsList';
import SettingsDetail from './SettingsDetail';

interface SettingsLayoutProps {
  children?: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  const selectedOption = SETTINGS_ITEMS.find(
    (option) => pathname && pathname.startsWith(`/settings/${option.id}`)
  );

  const isMainCategoryPage =
    selectedOption && pathname === `/settings/${selectedOption.id}`;

  const isMainPage = pathname === '/settings';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full">
      <div
        className={`${!isMainPage && selectedOption ? 'hidden lg:block' : 'block'} lg:w-4/9`}
      >
        <SettingsList options={SETTINGS_ITEMS} />
      </div>

      <div className={`${isMainPage ? 'hidden lg:block' : 'block'} lg:w-5/9`}>
        {isMainCategoryPage ? (
          <SettingsDetail selectedOption={selectedOption} />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
