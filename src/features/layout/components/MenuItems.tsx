'use client';

import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  Users,
  User,
  MoreHorizontal,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/authentication/store/authStore';
import { NotificationBadge } from '@/features/notifications/components';
import { MessageBadge } from '@/features/messages/components/MessageBadge';

export default function MenuItems() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const menuItems = [
    {
      icon: Home,
      label: 'Home',
      href: '/home',
      hideOnShortScreen: false,
    },
    {
      icon: Search,
      label: 'Explore',
      href: '/explore',
      hideOnShortScreen: false,
    },
    {
      icon: Bell,
      label: 'Notifications',
      href: '/notifications',
      hideOnShortScreen: false,
    },
    {
      icon: Mail,
      label: 'Messages',
      href: '/messages',
      hideOnShortScreen: false,
    },
    {
      icon: Bookmark,
      label: 'Bookmarks',
      href: '/bookmarks',
      hideOnShortScreen: true,
    },
    {
      icon: Users,
      label: 'Communities',
      href: '/communities',
      hideOnShortScreen: true,
    },
    {
      icon: User,
      label: 'Profile',
      href: `/${user?.username}`,
      hideOnShortScreen: false,
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
      hideOnShortScreen: true,
    },
    {
      icon: MoreHorizontal,
      label: 'More',
      href: '/more',
      hideOnShortScreen: false,
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
                strokeWidth={isActive ? 3 : 2}
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
