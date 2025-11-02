import { useMemo } from 'react';

type Conversation = {
  id?: number;
  conversationId?: number;
  name?: string;
  username?: string;
  avatar?: string;
  verified?: boolean;
  user?: {
    id: number;
    username?: string;
    displayName?: string;
    name?: string;
    profile_image_url?: string;
    avatar?: string;
    verified?: boolean;
  };
  participants?: Array<{
    id: number;
    name?: string;
    username?: string;
    avatar?: string;
  }>;
};

interface ConversationDetails {
  name: string;
  username: string;
  avatar: string;
  isVerified: boolean;
}

const DEFAULT_AVATAR = 'https://avatar.iran.liara.run/public/1';

export const useConversationDetails = (
  conversation?: Conversation
): ConversationDetails => {
  return useMemo(() => {
    // Backend returns 'user' object with displayName and profile_image_url
    const otherUser = conversation?.user || conversation?.participants?.[0];

    return {
      name:
        conversation?.name ||
        otherUser?.displayName ||
        otherUser?.name ||
        'Unknown',
      username: conversation?.username || otherUser?.username || 'unknown',
      avatar:
        conversation?.avatar ||
        otherUser?.profile_image_url ||
        otherUser?.avatar ||
        DEFAULT_AVATAR,
      isVerified: conversation?.verified || otherUser?.verified || false,
    };
  }, [conversation]);
};
