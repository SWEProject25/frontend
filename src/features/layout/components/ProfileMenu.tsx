'use client';
import XMenu from '@/components/ui/home/XMenu';
import { MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Avatar from '@/components/generic/Avatar';

const PANEL_HEIGHT = 44; // Single item height

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <XMenu>
      <XMenu.Button name="ProfileMenu" panelHeight={PANEL_HEIGHT}>
        <div
          data-testid="sidebar-profile-menu-button"
          className="flex items-center justify-between hover:bg-gray-900 rounded-full p-3 mb-3 cursor-pointer transition-colors w-full"
        >
          <div className="flex items-center gap-3">
            <Avatar
              data-testid="sidebar-profile-avatar"
              avatarImage={user.profile?.profileImageUrl ?? null}
              name={user.profile?.name ?? user.username}
              size="sm"
              position="relative"
              className="border-0"
            />
            <div className="hidden xl:block" data-testid="sidebar-profile-info">
              <p className="text-white font-semibold text-sm leading-tight">
                {user.profile?.name ?? user.username}
              </p>
              <p className="text-gray-400 text-sm">@{user.username}</p>
            </div>
          </div>
          <MoreHorizontal className="text-white hidden xl:block" />
        </div>
      </XMenu.Button>
      <XMenu.List
        height="h-[44px]"
        width="w-[200px]"
        name="ProfileMenu"
        preventScroll={false}
      >
        <ul
          data-testid="sidebar-profile-menu-list"
          className="flex flex-col align-center justify-center h-full"
        >
          <li className="flex-1">
            <button
              data-testid="sidebar-logout-button"
              type="button"
              onClick={handleLogout}
              className="align-center justify-start px-2 h-full cursor-pointer w-full flex items-center gap-3 outline-none rounded-2xl hover:bg-white/10 focus:bg-white/10 transition-colors"
            >
              <span className="text-left text-sm text-white whitespace-nowrap">
                Log out @{user.username}
              </span>
            </button>
          </li>
        </ul>
      </XMenu.List>
    </XMenu>
  );
}
