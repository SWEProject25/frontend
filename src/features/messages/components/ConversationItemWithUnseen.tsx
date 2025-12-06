'use client';
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
  unseenCount: number; // Now passed as prop instead of fetched from API
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
  unseenCount,
  onClick,
}: ConversationItemWithUnseenProps) {
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
