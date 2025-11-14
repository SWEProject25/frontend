'use client';

import { useAuth } from '@/features/authentication/hooks';
import { useAuthHandlers } from '@/features/authentication/hooks';
import { useAuthModals } from '@/features/authentication/hooks';
import { CheckIcon, CloseXIcon } from '@/components/ui/icons';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import XLoader from '@/components/ui/XLoader';

function AuthDemoContent() {
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const auth = useAuth();
  const { formState, clearFormState } = useAuthHandlers();
  const { openModal } = useAuthModals();

  // Safe getters to avoid TS errors when auth.user can be a loose Record
  const getField = (key: string) => {
    const u = auth.user as Record<string, unknown> | null;
    if (!u) return 'N/A';
    const v = u[key];
    return typeof v === 'string' && v.length > 0 ? v : 'N/A';
  };

  const getDateField = (key: string) => {
    const u = auth.user as Record<string, unknown> | null;
    if (!u) return 'N/A';
    const v = u[key];
    if (typeof v === 'string' || typeof v === 'number') {
      const d = new Date(v as string | number);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleDateString();
    }
    return 'N/A';
  };

  const userDisplay = (() => {
    const name = getField('name');
    if (name !== 'N/A') return name;
    const email = getField('email');
    if (email !== 'N/A') return email;
    const username = getField('username');
    if (username !== 'N/A') return username;
    return '';
  })();

  useEffect(() => {
    if (!searchParams) return;

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
                <CheckIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {searchParams?.get('login') === 'success'
                    ? `🎉 Login successful! Welcome back, ${auth.user?.name || auth.user?.email}!`
                    : searchParams?.get('register') === 'success'
                      ? `🎉 Registration successful! Welcome, ${auth.user?.name || auth.user?.email}!`
                      : '🎉 Success!'}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="text-green-400 hover:text-green-600"
                  aria-label="Close success message"
                >
                  <CloseXIcon className="h-5 w-5" />
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
                  <strong>Name:</strong> {userDisplay || 'N/A'}
                </p>
                <p>
                  <strong>Username:</strong> {getField('username')}
                </p>
                <p>
                  <strong>Email:</strong> {getField('email')}
                </p>
                <p>
                  <strong>Role:</strong> {getField('role')}
                </p>
                <p>
                  <strong>Birth Date:</strong> {getDateField('birthDate')}
                </p>
                <p>
                  <strong>Location:</strong> {getField('location')}
                </p>
                <p>
                  <strong>Created At:</strong> {getDateField('createdAt')}
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
              <strong>Errors:</strong>{' '}
              {Object.keys(formState.errors).length > 0
                ? JSON.stringify(formState.errors)
                : 'None'}
            </p>
            <p>
              <strong>Success:</strong> {formState.success ? 'Yes' : 'No'}
            </p>
          </div>
          {Object.keys(formState.errors).length > 0 && (
            <button
              onClick={() => clearFormState()}
              className="mt-2 bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
            >
              Clear Errors
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
    <Suspense fallback={<XLoader />}>
      <AuthDemoContent />
    </Suspense>
  );
}
