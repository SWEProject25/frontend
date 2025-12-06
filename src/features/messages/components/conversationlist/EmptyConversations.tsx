import { Mail } from 'lucide-react';

export default function EmptyConversations() {
  return (
    <div
      id="empty-conversations"
      className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center"
    >
      <Mail className="w-12 h-12 mb-4" />
      <h3 className="text-xl font-bold mb-2">Welcome to your inbox!</h3>
      <p className="text-sm">
        Drop a line, share posts and more with private conversations between you
        and others on X.
      </p>
    </div>
  );
}
