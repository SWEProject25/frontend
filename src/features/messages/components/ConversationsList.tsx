'use client';
import { Settings, Mail } from 'lucide-react';
import { SearchInput } from '@/components/ui/input';
import NextImage from 'next/image';

interface Conversation {
  id: string;
  name: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  verified?: boolean;
  unread?: boolean;
}

interface ConversationsListProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
}

export default function ConversationsList({
  selectedConversation,
  onSelectConversation,
}: ConversationsListProps) {
  // Mock data - replace with real data later
  const conversations: Conversation[] = [
    {
      id: '1',
      name: 'Every Movie Plug',
      username: 'everymovieplug',
      avatar: 'https://avatar.iran.liara.run/public/8',
      lastMessage: 'Thanks for the follow!',
      timestamp: '2h',
      verified: true,
      unread: true,
    },
    {
      id: '2',
      name: 'Tech News',
      username: 'technews',
      avatar: 'https://avatar.iran.liara.run/public/24',
      lastMessage: 'Breaking: New AI announcement',
      timestamp: '5h',
      verified: false,
      unread: false,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-black">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Messages</h2>
          <div className="flex gap-4">
            <Settings className="w-5 h-5 text-white cursor-pointer hover:text-gray-300" />
            <Mail className="w-5 h-5 text-white cursor-pointer hover:text-gray-300" />
          </div>
        </div>

        {/* Search */}
        <div className="p-3">
          <SearchInput placeholder="Search Direct Messages" />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center">
            <Mail className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-bold mb-2">Welcome to your inbox!</h3>
            <p className="text-sm">
              Drop a line, share posts and more with private conversations
              between you and others on X.
            </p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`p-4 cursor-pointer hover:bg-gray-900 transition-colors border-b border-gray-800 ${
                selectedConversation === conversation.id ? 'bg-gray-900' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <NextImage
                  src={conversation.avatar}
                  alt={conversation.name}
                  width={48}
                  height={48}
                  className="rounded-full flex-shrink-0"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-1">
                      <span
                        className={`font-semibold text-white truncate ${conversation.unread ? 'font-bold' : ''}`}
                      >
                        {conversation.name}
                      </span>
                      {conversation.verified && (
                        <svg
                          className="w-4 h-4 text-blue-500 flex-shrink-0"
                          viewBox="0 0 22 22"
                          fill="currentColor"
                        >
                          <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {conversation.timestamp}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm truncate mb-1">
                    @{conversation.username}
                  </p>

                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm text-gray-400 truncate flex-1 ${conversation.unread ? 'text-white font-medium' : ''}`}
                    >
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
