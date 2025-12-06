import { X, Plus, Search, Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAuth } from '@/features/authentication/hooks';
import { useGetFollowing } from '@/hooks/interactions/useFollow';
import Avatar from '@/components/generic/Avatar';

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
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch following users
  const { data: followingData, isLoading: isLoadingFollowing } =
    useGetFollowing(user?.id || 0, { limit: 100, page: 1 }, show && !!user?.id);

  // Filter following users based on search
  const filteredFollowing = useMemo(() => {
    if (!followingData?.data) return [];
    if (!searchQuery.trim()) return followingData.data;

    const query = searchQuery.toLowerCase();
    return followingData.data.filter(
      (user) =>
        user.displayName.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
    );
  }, [followingData, searchQuery]);

  if (!show) return null;

  const handleUserSelect = (selectedUserId: number) => {
    onUserIdChange(String(selectedUserId));
    // Auto-create conversation when user is selected
    onCreate();
  };

  return (
    <div
      id="new-conversation-modal"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-950 rounded-2xl w-full max-w-md mx-4 border border-gray-800 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">New Message</h3>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              id="search-following-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people you follow..."
              className="w-full pl-10 pr-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>
        </div>

        {/* Following Users List */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingFollowing ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : filteredFollowing.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              {searchQuery ? (
                <>
                  <Search className="w-12 h-12 text-gray-600 mb-3" />
                  <p className="text-gray-400">
                    No users found matching &quot;{searchQuery}&quot;
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                    <Plus className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-400 mb-1">
                    You&apos;re not following anyone yet
                  </p>
                  <p className="text-sm text-gray-600">
                    Follow users to start conversations with them
                  </p>
                </>
              )}
            </div>
          ) : (
            <div id="following-list">
              {filteredFollowing.map((followedUser) => (
                <button
                  key={followedUser.id}
                  id={`following-user-${followedUser.id}`}
                  onClick={() => handleUserSelect(followedUser.id)}
                  disabled={loading}
                  className="w-full rounded-2xl p-4 hover:bg-gray-800 transition-colors flex items-center gap-3 border-b border-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Avatar
                    avatarImage={followedUser.profileImageUrl ?? null}
                    name={followedUser.displayName}
                    size="sm"
                    position="relative"
                    className="shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-white truncate">
                        {followedUser.displayName}
                      </span>
                      {followedUser.verified && (
                        <svg
                          className="w-4 h-4 text-blue-500 shrink-0"
                          viewBox="0 0 22 22"
                          fill="currentColor"
                        >
                          <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      @{followedUser.username}
                    </p>
                    {followedUser.bio && (
                      <p className="text-sm text-gray-400 truncate mt-1">
                        {followedUser.bio}
                      </p>
                    )}
                  </div>
                  {loading && userId === String(followedUser.id) && (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
