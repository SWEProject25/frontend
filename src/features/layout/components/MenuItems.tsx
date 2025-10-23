import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  Users,
  User,
  MoreHorizontal,
} from 'lucide-react';

export default function MenuItems() {
  const menuItems = [
    { icon: Home, label: 'Home', active: true, hideOnShortScreen: false },
    { icon: Search, label: 'Explore', active: false, hideOnShortScreen: false },
    {
      icon: Bell,
      label: 'Notifications',
      active: false,
      hideOnShortScreen: false,
    },
    { icon: Mail, label: 'Messages', active: false, hideOnShortScreen: false },
    {
      icon: Bookmark,
      label: 'Bookmarks',
      active: false,
      hideOnShortScreen: true,
    },
    {
      icon: Users,
      label: 'Communities',
      active: false,
      hideOnShortScreen: true,
    },
    { icon: User, label: 'Profile', active: false, hideOnShortScreen: false },
    {
      icon: MoreHorizontal,
      label: 'More',
      active: false,
      hideOnShortScreen: false,
    },
  ];

  return (
    <nav className="flex flex-col mt-1 w-full">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`flex items-center justify-center xl:justify-start gap-5 px-3 py-3 rounded-full hover:bg-gray-900 cursor-pointer transition-colors w-full ${
            item.hideOnShortScreen ? 'hidden xl:flex' : ''
          }`}
        >
          <item.icon
            strokeWidth={item.active ? 2.5 : 2}
            className="w-7 h-7 text-white flex-shrink-0"
          />
          <span
            className={`hidden xl:block text-xl ${item.active ? 'font-bold' : 'font-normal'} text-white`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </nav>
  );
}
