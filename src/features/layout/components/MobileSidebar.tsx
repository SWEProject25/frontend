'use client';

import React from 'react';
import { X, User, Settings } from 'lucide-react';
import Link from 'next/link';
import Avatar from '@/components/generic/Avatar';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { useMyProfile } from '@/features/profile/hooks';
import { useRouter } from 'next/navigation';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { user, logout } = useAuth();
  const { data: profileData } = useMyProfile();
  const router = useRouter();

  const profile = profileData?.data;

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          data-testid="mobile-sidebar-overlay"
          className="fixed inset-0 bg-modal-overlay z-40 xs:hidden"
          onClick={onClose}
        />
      )}

      <div
        data-testid="mobile-sidebar"
        className={`fixed top-0 left-0 h-full w-[280px] bg-black z-50 transform transition-transform duration-300 ease-in-out xs:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="p-4">
            <Avatar
              data-testid="mobile-sidebar-avatar"
              avatarImage={profile?.profile_image_url ?? null}
              name={profile?.name ?? user?.username ?? 'User'}
              size="sm"
              position="relative"
              className="border-0 mb-3"
            />
            <div className="mb-3">
              <p
                className="text-white font-bold text-base"
                data-testid="mobile-sidebar-name"
              >
                {profile?.name ?? user?.username ?? 'User'}
              </p>
              <p
                className="text-gray-400 text-sm"
                data-testid="mobile-sidebar-username"
              >
                @{user?.username ?? 'username'}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link
                href={`/${user?.username}/following`}
                className="flex items-center gap-1 hover:underline"
                data-testid="mobile-sidebar-following"
                onClick={onClose}
              >
                <span className="font-bold text-white">
                  {profile?.following_count ?? 0}
                </span>
                <span className="text-gray-400">Following</span>
              </Link>
              <Link
                href={`/${user?.username}/followers`}
                className="flex items-center gap-1 hover:underline"
                data-testid="mobile-sidebar-followers"
                onClick={onClose}
              >
                <span className="font-bold text-white">
                  {profile?.followers_count ?? 0}
                </span>
                <span className="text-gray-400">Followers</span>
              </Link>
            </div>
          </div>

          <div className="flex-1 py-2 px-2">
            <nav className="flex flex-col gap-1" onClick={onClose}>
              <Link
                href={`/${user?.username}`}
                className="flex items-center justify-start gap-5 px-4 py-3 rounded-full hover:bg-gray-900 cursor-pointer transition-colors w-full"
                data-testid="mobile-sidebar-profile"
              >
                <User className="w-7 h-7 text-text-active shrink-0" />
                <span className="text-[20px] text-text-active/95">Profile</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center justify-start gap-5 px-4 py-3 rounded-full hover:bg-gray-900 cursor-pointer transition-colors w-full"
                data-testid="mobile-sidebar-settings"
              >
                <Settings className="w-7 h-7 text-text-active shrink-0" />
                <span className="text-[20px] text-text-active/95">
                  Settings
                </span>
              </Link>
            </nav>
          </div>

          {/* Logout Button */}
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-white hover:bg-gray-900 rounded-full transition-colors font-semibold"
              data-testid="mobile-sidebar-logout"
            >
              Log out @{user?.username ?? 'user'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
