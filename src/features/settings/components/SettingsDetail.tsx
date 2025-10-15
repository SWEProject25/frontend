'use client';

import { usePathname, useRouter } from 'next/navigation';
import Breadcrumb from '@/components/ui/Breadcrumb';
import SubOptionItem from '@/components/ui/SubOptionItem';
import { UserIcon, KeyIcon, ChatIcon } from '@/components/ui/icons';
import type { SettingsOption } from '@/constants/SETTINGs_ITEMS';

interface SettingsDetailProps {
  selectedOption: SettingsOption | null;
}

// Map suboption IDs to icons
const getIconForSubOption = (subOptionId: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    'account-info': <UserIcon className="w-5 h-5" />,
    'change-password': <KeyIcon className="w-5 h-5" />,
    'download-archive': <UserIcon className="w-5 h-5" />,
    'security-overview': <KeyIcon className="w-5 h-5" />,
    'two-factor': <KeyIcon className="w-5 h-5" />,
    'connected-apps': <UserIcon className="w-5 h-5" />,
    audience: <UserIcon className="w-5 h-5" />,
    'content-preferences': <UserIcon className="w-5 h-5" />,
    'mute-block': <UserIcon className="w-5 h-5" />,
    'direct-messages': <ChatIcon className="w-5 h-5" />,
    filters: <UserIcon className="w-5 h-5" />,
    preferences: <UserIcon className="w-5 h-5" />,
    'push-notifications': <UserIcon className="w-5 h-5" />,
  };
  return iconMap[subOptionId] || <UserIcon className="w-5 h-5" />;
};

export default function SettingsDetail({
  selectedOption,
}: SettingsDetailProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleBack = () => {
    router.back();
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
          description={selectedOption.description}
          onBack={handleBack}
        />
        <nav className="flex flex-col">
          {selectedOption.subOptions.map((subOption) => {
            const isActive = pathname === subOption.path;

            return (
              <SubOptionItem
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
