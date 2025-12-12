import { Home, Search, Bell, Mail, Settings } from 'lucide-react';
import Link from 'next/link';
import { NotificationBadge } from '@/features/notifications/components/NotificationBadge';
import { MessageBadge } from '@/features/messages/components/MessageBadge';

export default function MobileBottomBar() {
  const mobileMenuItems = [
    { icon: Home, label: 'Home', href: '/home', active: true },
    { icon: Search, label: 'Explore', href: '/explore', active: false },
    {
      icon: Bell,
      label: 'Notifications',
      href: '/notifications',
      active: false,
    },
    { icon: Mail, label: 'Messages', href: '/messages', active: false },
    { icon: Settings, label: 'Settings', href: '/settings', active: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-[53px]">
        {mobileMenuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            aria-label={item.label}
            className="flex flex-col items-center justify-center flex-1 h-full hover:bg-gray-900 transition-colors"
          >
            <div className="relative">
              <item.icon
                strokeWidth={item.active ? 2.5 : 2}
                className={`w-6 h-6 ${item.active ? 'text-white' : 'text-gray-400'}`}
              />
              {/* Show notification badge on Bell icon */}
              {item.label === 'Notifications' && <NotificationBadge />}
              {/* Show message badge on Mail icon */}
              {item.label === 'Messages' && <MessageBadge />}
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
