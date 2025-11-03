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
    const user = conversation?.user;
    const participant = conversation?.participants?.[0];

    // Handle both user and participant types
    let displayName = 'Unknown';
    if (conversation?.name) {
      displayName = conversation.name;
    } else if (user?.displayName) {
      displayName = user.displayName;
    } else if (user?.name) {
      displayName = user.name;
    } else if (participant?.name) {
      displayName = participant.name;
    }

    let profileImageUrl = DEFAULT_AVATAR;
    if (conversation?.avatar) {
      profileImageUrl = conversation.avatar;
    } else if (user?.profile_image_url) {
      profileImageUrl = user.profile_image_url;
    } else if (user?.avatar) {
      profileImageUrl = user.avatar;
    } else if (participant?.avatar) {
      profileImageUrl = participant.avatar;
    }

    const isVerified = !!(conversation?.verified || user?.verified);

    const username =
      conversation?.username ||
      user?.username ||
      participant?.username ||
      'unknown';

    return {
      name: displayName,
      username,
      avatar: profileImageUrl,
      isVerified,
    };
  }, [conversation]);
};
