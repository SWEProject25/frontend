'use client';
import { useRouter, usePathname } from 'next/navigation';
import ConversationsList from './ConversationsList';
import WelcomeScreen from './WelcomeScreen';
import { useMessages } from '../hooks/useMessages';

export default function MessagesLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const isMainMessagesPage = pathname === '/messages';

  useMessages((err) => {
    console.error('Socket connection error:', err);
  });

  const handleSelectConversation = (id: string) => {
    router.push(`/messages/${id}`);
  };

  return (
    <div className="flex h-screen bg-black">
      <div
        className={`${isMainMessagesPage ? 'w-full md:w-[400px]' : 'hidden lg:block lg:w-[400px]'} border-r border-gray-800 shrink-0`}
      >
        <ConversationsList
          selectedConversation={null}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {isMainMessagesPage && (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <WelcomeScreen />
        </div>
      )}
    </div>
  );
}
