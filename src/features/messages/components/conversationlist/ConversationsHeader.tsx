interface ConversationsHeaderProps {
  unseenConversationsCount: number;
}

export default function ConversationsHeader({
  unseenConversationsCount,
}: ConversationsHeaderProps) {
  return (
    <div className="sticky top-0 bg-black/80 backdrop-blur-sm z-10">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Messages</h2>
          {unseenConversationsCount > 0 && (
            <span className="flex items-center justify-center min-w-6 h-6 px-2 bg-blue-500 text-white text-sm font-semibold rounded-full">
              {unseenConversationsCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
