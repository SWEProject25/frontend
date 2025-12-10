import { Plus } from 'lucide-react';
import { MessageBadge } from '../MessageBadge';

interface ConversationsHeaderProps {
  onNewMessageClick?: () => void;
}

export default function ConversationsHeader({
  onNewMessageClick,
}: ConversationsHeaderProps) {
  return (
    <div
      id="conversations-header"
      className="sticky top-0 bg-black/80 backdrop-blur-sm z-10"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">Messages</h2>
          {/* Show DM notification badge inline next to text */}
          <MessageBadge variant="inline" />
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
