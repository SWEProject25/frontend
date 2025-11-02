'use client';

import { useEffect, useState } from 'react';

export default function CookieCheckPage() {
  const [cookies, setCookies] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Get all cookies
    const allCookies = document.cookie;
    setCookies(allCookies || 'No cookies found');

    // Get access_token specifically
    const getCookie = (name: string): string | undefined => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const token = getCookie('access_token');
    setAccessToken(token || null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🍪 Cookie Check</h1>

        <div className="bg-gray-800 p-6 rounded-lg space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Access Token</h2>
            {accessToken ? (
              <div className="space-y-2">
                <p className="text-green-400">✅ Found!</p>
                <div className="bg-gray-900 p-3 rounded font-mono text-sm break-all">
                  {accessToken}
                </div>
              </div>
            ) : (
              <p className="text-red-400">❌ Not found - You need to login!</p>
            )}
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h2 className="text-xl font-semibold mb-2">All Cookies</h2>
            <div className="bg-gray-900 p-3 rounded font-mono text-sm break-all">
              {cookies}
            </div>
          </div>
        </div>

        <div className="bg-blue-900 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">💡 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open this page in BOTH browsers you want to test</li>
            <li>
              If access_token is missing, go to{' '}
              <a href="/" className="text-blue-400 underline">
                Login Page
              </a>
            </li>
            <li>After login, refresh this page to see the token</li>
            <li>Once BOTH browsers show the token, you can test messaging</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
