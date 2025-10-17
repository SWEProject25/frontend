import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  Users,
  User,
  MoreHorizontal,
  Zap,
} from 'lucide-react';

export default function MenuItems() {
  const menuItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: Search, label: 'Explore', active: false },
    { icon: Bell, label: 'Notifications', active: false },
    { icon: Mail, label: 'Messages', active: false },
    { icon: Zap, label: 'Grok', active: false },
    { icon: Bookmark, label: 'Bookmarks', active: false },
    { icon: Users, label: 'Communities', active: false },
    { icon: User, label: 'Profile', active: false },
    { icon: MoreHorizontal, label: 'More', active: false },
  ];
  return (
    <nav className="flex flex-col mt-1">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-5 px-3 py-3 rounded-full hover:bg-gray-900 cursor-pointer transition-colors w-fit"
        >
          <item.icon
            strokeWidth={item.active ? 3 : 1}
            className="w-6 h-6 text-white"
          />
          <span
            className={`text-white text-xl hidden xl:inline ${item.active ? 'font-semibold' : ''}`}
          >
            {item.label}
          </span>
        </div>
      ))}
    </nav>
  );
}
