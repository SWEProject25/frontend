import { Settings, Mail } from 'lucide-react';

interface ConversationsHeaderProps {
  onNewMessage: () => void;
}

export default function ConversationsHeader({
  onNewMessage,
}: ConversationsHeaderProps) {
  return (
    <div className="sticky top-0 bg-black/80 backdrop-blur-sm z-10">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">Messages</h2>
        <div className="flex gap-4">
          <button
            onClick={onNewMessage}
            className="p-1 rounded-full hover:bg-gray-800 transition-colors"
            aria-label="New message"
          >
            <Mail className="w-5 h-5 text-white cursor-pointer hover:text-gray-300" />
          </button>
          <Settings className="w-5 h-5 text-white cursor-pointer hover:text-gray-300" />
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Search Direct Messages"
          className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>
    </div>
  );
}
