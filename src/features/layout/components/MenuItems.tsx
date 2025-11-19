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
    <nav className="flex flex-col mt-1 gap-4 min-[1400px]:items-start items-center">
      {menuItems.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={index}
            href={item.href}
            aria-label={item.label}
            className={`flex items-center justify-center xl:justify-start gap-5 px-3 py-3 rounded-full hover:bg-gray-900 cursor-pointer transition-colors ${
              item.hideOnShortScreen ? 'max-[699px]:hidden' : ''
            }`}
          >
            <item.icon
              strokeWidth={isActive ? 3 : 2}
              className="w-7 h-7 text-text-active flex-shrink-0"
            />
            <span
              className={`hidden min-[1400px]:block text-[20px] ${isActive ? 'font-bold' : ''} text-text-active/95`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
