'use client';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import ChatWindow from '@/features/messages/components/ChatWindow';
import ConversationsList from '@/features/messages/components/ConversationsList';
import '@/features/messages/utils/mockMessages';

export default function MessagePage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params?.id as string;

  if (!conversationId) {
    router.push('/messages');
    return null;
  }

  const handleSelectConversation = (id: string) => {
    router.push(`/messages/${id}`);
  };

  return (
    <div className="flex h-screen bg-black w-full">
      <div className="hidden lg:flex lg:w-[400px] border-r border-gray-800 shrink-0 flex-col overflow-y-auto">
        <ConversationsList
          selectedConversation={conversationId}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 bg-black overflow-hidden">
        <div className="lg:hidden bg-black/95 backdrop-blur-sm border-b border-gray-800 shrink-0">
          <div className="p-4">
            <button
              onClick={() => router.push('/messages')}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
              aria-label="Back to messages"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Messages</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatWindow conversationId={conversationId} />
        </div>
      </div>
    </div>
  );
}
