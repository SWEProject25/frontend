import { MessageBadge } from '../MessageBadge';

export default function ConversationsHeader() {
  return (
    <div className="sticky top-0 bg-black/80 backdrop-blur-sm z-10">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">Messages</h2>
          {/* Show DM notification badge inline next to text */}
          <MessageBadge variant="inline" />
        </div>
      </div>
    </div>
  );
}
