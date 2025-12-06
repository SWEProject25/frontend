import { Plus } from 'lucide-react';

interface ConversationsHeaderProps {
  unseenConversationsCount: number;
  onNewMessageClick: () => void;
}

export default function ConversationsHeader({
  unseenConversationsCount,
  onNewMessageClick,
}: ConversationsHeaderProps) {
  return (
    <div
      id="conversations-header"
      className="sticky top-0 bg-black/80 backdrop-blur-sm z-10"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <h2 id="messages-title" className="text-xl font-bold text-white">
            Messages
          </h2>
          {unseenConversationsCount > 0 && (
            <span
              id="unseen-count"
              className="flex items-center justify-center min-w-6 h-6 px-2 bg-blue-500 text-white text-sm font-semibold rounded-full"
            >
              {unseenConversationsCount}
            </span>
          )}
        </div>
        <button
          id="new-message-btn"
          onClick={onNewMessageClick}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors group"
          aria-label="New message"
        >
          <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </button>
      </div>
    </div>
  );
}
