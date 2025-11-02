'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/authentication/store/authStore';

export default function AuthDebugPage() {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [cookieInfo, setCookieInfo] = useState<string>('');

  useEffect(() => {
    // Check cookies
    const cookies = document.cookie;
    setCookieInfo(cookies || 'No cookies found');
  }, []);

  const testBackend = async () => {
    try {
      const response = await fetch(
        'https://api.hankers.myaddr.tools/api/v1.0/auth/me',
        {
          credentials: 'include',
        }
      );
      const data = await response.json();
      console.log('Backend /me response:', data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error calling /me:', error);
      alert('Error: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Debug Page</h1>

        <div className="space-y-6">
          {/* Frontend Auth State */}
          <div className="border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Frontend Auth State (Zustand)
            </h2>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-gray-400">Is Authenticated:</span>
                <span
                  className={
                    isAuthenticated ? 'text-green-400' : 'text-red-400'
                  }
                >
                  {isAuthenticated ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">User ID:</span>
                <span className="text-white">
                  {(user as any)?.id || 'null'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Username:</span>
                <span className="text-white">
                  {(user as any)?.username || 'null'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white">
                  {(user as any)?.email || 'null'}
                </span>
              </div>
            </div>
            <details className="mt-4">
              <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                Full User Object
              </summary>
              <pre className="mt-2 p-3 bg-gray-900 rounded text-xs overflow-x-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
          </div>

          {/* Browser Cookies */}
          <div className="border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Browser Cookies</h2>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-400">Has access_token:</span>
                <span
                  className={
                    cookieInfo.includes('access_token')
                      ? 'text-green-400 ml-2'
                      : 'text-red-400 ml-2'
                  }
                >
                  {cookieInfo.includes('access_token') ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <details>
                <summary className="cursor-pointer text-blue-400 hover:text-blue-300 text-sm">
                  View All Cookies
                </summary>
                <pre className="mt-2 p-3 bg-gray-900 rounded text-xs overflow-x-auto break-all">
                  {cookieInfo}
                </pre>
              </details>
            </div>
          </div>

          {/* Backend Test */}
          <div className="border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              Backend Authentication Test
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Click the button below to check if the backend recognizes you as
              authenticated.
            </p>
            <button
              onClick={testBackend}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Test Backend /auth/me
            </button>
            <p className="text-xs text-gray-500 mt-2">
              This will call GET /api/v1.0/auth/me and show the response
            </p>
          </div>

          {/* Instructions */}
          <div className="border border-yellow-700 bg-yellow-900/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🔍 Debugging Steps</h2>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Check if "Is Authenticated" shows ✅ Yes</li>
              <li>Check if "User ID" is a number (not null)</li>
              <li>Check if "access_token" cookie exists</li>
              <li>
                Click "Test Backend /auth/me" to verify backend recognizes you
              </li>
              <li>If backend returns 401, you need to login again</li>
            </ol>
          </div>

          {/* Common Issues */}
          <div className="border border-red-700 bg-red-900/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">❌ Common Issues</h2>
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-semibold text-red-400">
                  Issue: User ID is null
                </div>
                <div className="text-gray-300">
                  → Backend is not returning user ID in the response. Check
                  backend /auth/login response.
                </div>
              </div>
              <div>
                <div className="font-semibold text-red-400">
                  Issue: Multiple users logging in
                </div>
                <div className="text-gray-300">
                  → Backend allows only one session per user. Second login kicks
                  out first session.
                  <br />→ Solution: Use different browsers or contact backend
                  team to allow multiple sessions.
                </div>
              </div>
              <div>
                <div className="font-semibold text-red-400">
                  Issue: No access_token cookie
                </div>
                <div className="text-gray-300">
                  → You're not logged in. Go to login page and authenticate.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
