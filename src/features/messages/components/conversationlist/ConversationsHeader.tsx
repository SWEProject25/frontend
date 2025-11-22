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
        <button
          onClick={onNewMessage}
          className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          aria-label="New message"
        >
          <Mail className="w-5 h-5 text-white cursor-pointer hover:text-gray-300" />
        </button>
      </div>
    </div>
  );
}
