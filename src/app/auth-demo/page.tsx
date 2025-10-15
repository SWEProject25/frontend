'use client';

import { useAuth } from '@/features/authentication/hooks';
import { useAuthHandlers } from '@/features/authentication/hooks';
import { useAuthModals } from '@/features/authentication/hooks';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function AuthDemoContent() {
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const auth = useAuth();
  const { formState, clearFormState } = useAuthHandlers();
  const { openModal } = useAuthModals();

  useEffect(() => {
    const loginSuccess = searchParams.get('login');
    const registerSuccess = searchParams.get('register');

    if (loginSuccess === 'success') {
      setShowSuccessMessage(true);
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } else if (registerSuccess === 'success') {
      setShowSuccessMessage(true);
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Demo</h1>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 relative">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {searchParams.get('login') === 'success'
                    ? `🎉 Login successful! Welcome back, ${auth.user?.name || auth.user?.email}!`
                    : searchParams.get('register') === 'success'
                      ? `🎉 Registration successful! Welcome, ${auth.user?.name || auth.user?.email}!`
                      : '🎉 Success!'}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="text-green-400 hover:text-green-600"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Authentication Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          {auth.isAuthenticated ? (
            <div>
              <p className="text-green-600 mb-2">✅ Authenticated</p>
              <div className="bg-gray-50 p-4 rounded">
                <p>
                  <strong>Name:</strong> {auth.user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {auth.user?.email}
                </p>
                <p>
                  <strong>Role:</strong> {auth.user?.role}
                </p>
                <p>
                  <strong>ID:</strong> {auth.user?.id}
                </p>
              </div>
              <button
                onClick={() => auth.logout()}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <p className="text-red-600 mb-4">❌ Not authenticated</p>
              <div className="flex gap-4">
                <button
                  onClick={() => openModal('login')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Open Login Modal
                </button>
                <button
                  onClick={() => openModal('signup')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Open Signup Modal
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Form State */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Form State</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p>
              <strong>Loading:</strong> {formState.isLoading ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Error:</strong> {formState.error || 'None'}
            </p>
            <p>
              <strong>Success:</strong> {formState.success ? 'Yes' : 'No'}
            </p>
          </div>
          {formState.error && (
            <button
              onClick={clearFormState}
              className="mt-2 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
            >
              Clear Error
            </button>
          )}
        </div>

        {/* API Test */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">API Integration</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Backend Endpoints:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>POST /api/v1.0/auth/register - Register new user</li>
                <li>POST /api/v1.0/auth/login - Login with email/password</li>
                <li>GET /api/v1.0/auth/test - Test authentication</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Features:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>✅ React Query for API state management</li>
                <li>✅ Zustand for client state management</li>
                <li>✅ HTTPOnly cookie authentication</li>
                <li>✅ TypeScript types from OpenAPI spec</li>
                <li>✅ Error handling and loading states</li>
                <li>✅ Persistent authentication state</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthDemoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthDemoContent />
    </Suspense>
  );
}
