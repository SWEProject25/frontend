'use client';
import { useRouter, usePathname } from 'next/navigation';
import ConversationsList from './ConversationsList';
import WelcomeScreen from './WelcomeScreen';

export default function MessagesLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const isMainMessagesPage = pathname === '/messages';

  const handleSelectConversation = (id: string) => {
    router.push(`/messages/${id}`);
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Conversations List */}
      {/* On main page: always visible */}
      {/* On chat page: visible only on lg+ screens */}
      <div
        className={`${isMainMessagesPage ? 'w-full md:w-[400px]' : 'hidden lg:block lg:w-[400px]'} border-r border-gray-800 flex-shrink-0`}
      >
        <ConversationsList
          selectedConversation={null}
          onSelectConversation={handleSelectConversation}
        />
      </div>

      {/* Welcome Screen - Only visible on main page when space allows (md+) */}
      {isMainMessagesPage && (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <WelcomeScreen />
        </div>
      )}
    </div>
  );
}
