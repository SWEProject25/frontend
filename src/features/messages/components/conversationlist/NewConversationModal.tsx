import { X, Plus } from 'lucide-react';

interface NewConversationModalProps {
  show: boolean;
  userId: string;
  loading: boolean;
  onClose: () => void;
  onUserIdChange: (value: string) => void;
  onCreate: () => void;
}

export default function NewConversationModal({
  show,
  userId,
  loading,
  onClose,
  onUserIdChange,
  onCreate,
}: NewConversationModalProps) {
  if (!show) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && userId) {
      onCreate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">New Message</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Enter User ID to start chatting
            </label>
            <input
              type="number"
              value={userId}
              onChange={(e) => onUserIdChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. 123"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-400">
              💡 <strong>Tip:</strong> You need to know the user&apos;s ID to
              start a start a conversation. You can find user IDs in profiles or
              user lists.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={onCreate}
              disabled={loading || !userId}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Start Chat
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
