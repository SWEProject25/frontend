'use client';

import { usePathname, useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import ListItem from '@/components/ui/ListItem';
import OptionItem from '@/components/ui/OptionItem';
import {
  UserIcon,
  KeyIcon,
  ChatIcon,
  InstallIcon,
  MuteIcon,
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
    'mute-block': <MuteIcon className="w-4 h-4" />,
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
      <div
        className="flex items-center justify-center h-screen"
        data-testid="settings-detail-empty"
      >
        <p className="text-text-inactive">Select a setting to view options</p>
      </div>
    );
  }

  return (
    <div
      className="border-r border-border min-h-screen"
      data-testid="settings-detail"
    >
      <div className="">
        <Breadcrumb
          title={selectedOption.label}
          subtitle="@ahmedfathy0-0"
          description={selectedOption.description}
          onBack={handleBack}
          data-testid="settings-detail-breadcrumb"
        />
        <nav className="flex flex-col" data-testid="settings-detail-nav">
          {selectedOption.subOptions.map((subOption) => {
            const isActive = pathname === subOption.path;

            return (
              <ListItem
                key={subOption.id}
                href={subOption.path}
                isActive={isActive}
                data-testid={`settings-detail-item-${subOption.id}`}
              >
                <OptionItem
                  label={subOption.label}
                  description={subOption.description}
                  icon={getIconForSubOption(subOption.id)}
                  showArrow={true}
                  data-testid={`settings-detail-option-${subOption.id}`}
                />
              </ListItem>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
