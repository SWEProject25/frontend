'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/authentication/hooks';
import MessagesLayout from '@/features/messages/components/MessagesLayout';

export default function MessagesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to auth demo page if not logged in
      router.push('/auth-demo');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <MessagesLayout />;
}
