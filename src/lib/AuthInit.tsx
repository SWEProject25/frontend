'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authApi } from '@/features/authentication/services/authApi';
import { useAuthStore } from '@/features/authentication/store/authStore';

export default function AuthInit({
  onReady,
}: {
  onReady?: (ready: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const resolvedRef = useRef(false);
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const apiUser = await authApi.getCurrentUser();
        const setUser = useAuthStore.getState().setUser;
        if (apiUser) {
          setUser(apiUser);
        }

        // If user is logged in and on the root path, redirect to /home
        if (mounted && pathname === '/') {
          setTargetPath('/home');
          router.replace('/home');
        } else if (mounted) {
          // No navigation needed; target is current pathname
          setTargetPath(pathname || '/');
        }
      } catch {
        // If not authorized (401/403) or any error, redirect to '/'

        if (!mounted) return;

        if (pathname && pathname.startsWith('/reset-password')) {
          setTargetPath(pathname);
        } else {
          if (pathname !== '/') {
            setTargetPath('/');
            router.replace('/');
          } else {
            setTargetPath('/');
          }
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [pathname, router, onReady]);

  // Wait for the actual pathname to equal the targetPath (or fallback after timeout)
  useEffect(() => {
    if (!targetPath) return;

    // If already at target, resolve immediately
    if (pathname === targetPath) {
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        if (typeof onReady === 'function') onReady(true);
      }
      return;
    }

    // Otherwise wait for pathname to change to targetPath, but also add a safety timeout
    const timeout = setTimeout(() => {
      if (!resolvedRef.current) {
        resolvedRef.current = true;
        if (typeof onReady === 'function') onReady(true);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [targetPath, pathname, onReady]);

  return null;
}
