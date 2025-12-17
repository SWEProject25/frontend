'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { NotificationBadge } from '@/features/notifications/components';
import { MessageBadge } from '@/features/messages/components/MessageBadge';
import {
  HomeIcon,
  ExploreIcon,
  NotificationsIcon,
  MessagesNavIcon,
  ProfileIcon,
  SettingsNavIcon,
} from '@/components/ui/icons';

export default function MenuItems() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const menuItems = [
    {
      icon: HomeIcon,
      label: 'Home',
      href: '/home',
      hideOnShortScreen: false,
    },
    {
      icon: ExploreIcon,
      label: 'Explore',
      href: '/explore',
      hideOnShortScreen: false,
    },
    {
      icon: NotificationsIcon,
      label: 'Notifications',
      href: '/notifications',
      hideOnShortScreen: false,
    },
    {
      icon: MessagesNavIcon,
      label: 'Messages',
      href: '/messages',
      hideOnShortScreen: false,
    },

    {
      icon: ProfileIcon,
      label: 'Profile',
      href: `/${user?.username}`,
      hideOnShortScreen: false,
    },
    {
      icon: SettingsNavIcon,
      label: 'Settings',
      href: '/settings',
      hideOnShortScreen: true,
    },
  ];

  return (
    <nav
      data-testid="sidebar-menu"
      className="flex flex-col mt-1 gap-1 min-[1400px]:gap-4 min-[1400px]:items-start items-center w-full"
    >
      {menuItems.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={index}
            href={item.href}
            aria-label={item.label}
            data-testid={`sidebar-menu-${item.label.toLowerCase()}`}
            className={`flex items-center justify-start gap-5 px-4 py-3 rounded-full hover:bg-gray-900 cursor-pointer transition-colors w-full min-[1400px]:w-auto min-[1400px]:justify-start ${
              item.hideOnShortScreen ? 'max-[699px]:hidden' : ''
            }`}
          >
            <div className="relative">
              <item.icon
                filled={isActive}
                className="w-7 h-7 text-text-active shrink-0"
              />
              {/* Show notification badge on Bell icon */}
              {item.label === 'Notifications' && <NotificationBadge />}
              {/* Show message badge on Mail icon */}
              {item.label === 'Messages' && <MessageBadge />}
            </div>
            <span
              className={`text-[20px] ${isActive ? 'font-bold' : ''} text-text-active/95 xs:hidden min-[1400px]:block`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
