'use client';
import { useEffect } from 'react';
import ConversationItem from './conversationlist/ConversationItem';
import { useConversationUnseenCount } from '../hooks/useUnseenCounts';
import { useMessageStore } from '../store/useMessageStore';

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
  unseenCount: number; // Initial value from conversation object
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
  unseenCount: initialUnseenCount,
  onClick,
}: ConversationItemWithUnseenProps) {
  const updateConversationUnseenCount = useMessageStore(
    (s) => s.updateConversationUnseenCount
  );
  const unseenCountFromStore = useMessageStore(
    (s) => s.unseenCounts[id] ?? initialUnseenCount
  );

  // Fetch the unseen count from API on mount and when conversation changes
  const { data: unseenCountFromApi } = useConversationUnseenCount(id, true);

  // Update the store when API returns a value
  useEffect(() => {
    if (unseenCountFromApi !== undefined) {
      updateConversationUnseenCount(id, unseenCountFromApi);
    }
  }, [unseenCountFromApi, id, updateConversationUnseenCount]);

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
      unseenCount={unseenCountFromStore}
      onClick={onClick}
    />
  );
}
