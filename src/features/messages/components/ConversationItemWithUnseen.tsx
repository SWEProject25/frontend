'use client';
import { useConversationUnseenCount } from '../hooks/useUnseenCounts';
import ConversationItem from './conversationlist/ConversationItem';

interface ConversationItemWithUnseenProps {
  id: number;
  avatar: string;
  name: string;
  username: string;
  isVerified: boolean;
  lastMessageText: string;
  timestamp: string;
  isSelected: boolean;
  isTyping: boolean;
  onClick: () => void;
}

export default function ConversationItemWithUnseen({
  id,
  avatar,
  name,
  username,
  isVerified,
  lastMessageText,
  timestamp,
  isSelected,
  isTyping,
  onClick,
}: ConversationItemWithUnseenProps) {
  // Fetch unseen count from API
  const { data: unseenCount = 0 } = useConversationUnseenCount(id, true);

  return (
    <ConversationItem
      id={id}
      avatar={avatar}
      name={name}
      username={username}
      isVerified={isVerified}
      lastMessageText={lastMessageText}
      timestamp={timestamp}
      isSelected={isSelected}
      isTyping={isTyping}
      unseenCount={unseenCount}
      onClick={onClick}
    />
  );
}
