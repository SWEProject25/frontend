'use client';

import { usePathname, useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ListItem from '@/components/ui/ListItem';
import {
  UserIcon,
  KeyIcon,
  ChatIcon,
  InstallIcon,
} from '@/components/ui/icons';
import type { SettingsOption } from '@/features/settings/constants/SETTINGs_ITEMS';

interface SettingsDetailProps {
  selectedOption: SettingsOption | null;
}

// Map suboption IDs to icons
const getIconForSubOption = (subOptionId: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'account-info': <UserIcon className="w-4 h-4" />,
    'change-password': <KeyIcon className="w-4 h-4" />,
    'download-archive': <InstallIcon className="w-4 h-4" />,
    'security-overview': <KeyIcon className="w-4 h-4" />,
    'two-factor': <KeyIcon className="w-4 h-4" />,
    'connected-apps': <UserIcon className="w-4 h-4" />,
    audience: <UserIcon className="w-4 h-4" />,
    'content-preferences': <UserIcon className="w-4 h-4" />,
    'mute-block': <UserIcon className="w-4 h-4" />,
    'direct-messages': <ChatIcon className="w-4 h-4" />,
    filters: <UserIcon className="w-4 h-4" />,
    preferences: <UserIcon className="w-4 h-4" />,
    'push-notifications': <UserIcon className="w-4 h-4" />,
  };
  return iconMap[subOptionId] || <UserIcon className="w-4 h-4" />;
};

export default function SettingsDetail({
  selectedOption,
}: SettingsDetailProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    router.push('/settings');
  };

  if (!selectedOption) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-text-inactive">Select a setting to view options</p>
      </div>
    );
  }

  return (
    <div className="border-r border-border min-h-screen">
      <div className="">
        <Breadcrumb
          title={selectedOption.label}
          subtitle="@ahmedfathy0-0"
          description={selectedOption.description}
          onBack={handleBack}
        />
        <nav className="flex flex-col">
          {selectedOption.subOptions.map((subOption) => {
            const isActive = pathname === subOption.path;

            return (
              <ListItem
                key={subOption.id}
                label={subOption.label}
                description={subOption.description}
                href={subOption.path}
                isActive={isActive}
                icon={getIconForSubOption(subOption.id)}
              />
            );
          })}
        </nav>
      </div>
    </div>
  );
}
