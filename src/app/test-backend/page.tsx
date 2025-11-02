'use client';
import { useState } from 'react';
import {
  fetchConversations,
  fetchMessages,
  createMessage,
} from '@/features/messages/api/messages';

export default function BackendTestPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(testName);
    try {
      const result = await testFn();
      setResults((prev: any) => ({
        ...prev,
        [testName]: { status: 'success', data: result },
      }));
    } catch (error: any) {
      setResults((prev: any) => ({
        ...prev,
        [testName]: { status: 'error', error: error.message },
      }));
    } finally {
      setLoading(null);
    }
  };

  const tests = [
    {
      name: 'GET /conversations',
      description: 'Fetch all conversations',
      fn: () => fetchConversations(),
    },
    {
      name: 'GET /conversations/1/messages',
      description: 'Fetch messages for conversation 1',
      fn: () => fetchMessages(1),
    },
    {
      name: 'POST /conversations/1/messages',
      description: 'Send a test message',
      fn: () => createMessage(1, 'Test message from frontend test page'),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Backend API Test Page</h1>
        <p className="text-gray-400 mb-8">
          Test all messaging endpoints to verify backend fixes
        </p>

        <div className="space-y-4">
          {tests.map((test) => (
            <div
              key={test.name}
              className="border border-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{test.name}</h3>
                  <p className="text-sm text-gray-400">{test.description}</p>
                </div>
                <button
                  onClick={() => runTest(test.name, test.fn)}
                  disabled={loading === test.name}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg transition-colors"
                >
                  {loading === test.name ? 'Testing...' : 'Run Test'}
                </button>
              </div>

              {results[test.name] && (
                <div className="mt-3 p-3 rounded bg-gray-900">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        results[test.name].status === 'success'
                          ? 'bg-green-900 text-green-300'
                          : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {results[test.name].status === 'success'
                        ? '✅ SUCCESS'
                        : '❌ FAILED'}
                    </span>
                  </div>
                  <pre className="text-xs overflow-x-auto text-gray-300">
                    {JSON.stringify(
                      results[test.name].status === 'success'
                        ? results[test.name].data
                        : { error: results[test.name].error },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <h3 className="font-semibold mb-2">✅ What Should Work:</h3>
          <ul className="space-y-1 text-sm">
            <li>• GET /conversations → Returns array of conversations</li>
            <li>• GET /conversations/1/messages → Returns array of messages</li>
            <li>
              • POST /conversations/1/messages → Creates and returns new message
            </li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <h3 className="font-semibold mb-2">⚠️ Common Issues:</h3>
          <ul className="space-y-1 text-sm">
            <li>• 404 Error → Endpoint not implemented yet</li>
            <li>• 401 Error → Not authenticated (login first)</li>
            <li>• 500 Error → Backend server error</li>
            <li>• CORS Error → Backend CORS config still has issues</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-gray-900 border border-gray-800 rounded-lg">
          <h3 className="font-semibold mb-2">🧪 How to Use:</h3>
          <ol className="space-y-1 text-sm list-decimal list-inside">
            <li>Make sure you're logged in (user ID 6)</li>
            <li>Click "Run Test" on each endpoint</li>
            <li>Check if status is SUCCESS (green) or FAILED (red)</li>
            <li>Review the response data</li>
            <li>Share results with backend team if any fail</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
