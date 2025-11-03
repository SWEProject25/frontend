import { MESSAGES_ENDPOINTS } from '../constants/api';

export const fetchConversations = async (page?: number, limit?: number) => {
  const url = MESSAGES_ENDPOINTS.GET_CONVERSATIONS(page, limit);

  const res = await fetch(url, {
    credentials: 'include',
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Authentication token is missing or invalid');
    }
    throw new Error('Failed to fetch conversations');
  }

  const response = await res.json();

  // Backend might return: { status: 'success', data: [...], metadata: {...} }
  // Or just an array directly: [{ id, user1Id, user2Id, createdAt }]
  if (response.status === 'success' && response.data) {
    return response.data;
  }

  return response;
};

export const fetchMessages = async (
  conversationId: number,
  lastMessageId?: number,
  limit?: number
) => {
  const url = MESSAGES_ENDPOINTS.GET_MESSAGES(
    conversationId,
    lastMessageId,
    limit
  );
  const res = await fetch(url, { credentials: 'include' });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Authentication token is missing or invalid');
    }
    if (res.status === 404) {
      throw new Error('Conversation not found');
    }
    throw new Error(
      `Failed to fetch messages: ${res.status} ${res.statusText}`
    );
  }

  const response = await res.json();

  // Backend returns: { status: "success", data: [...], metadata: {...} }
  if (response.status === 'success') {
    return {
      messages: response.data,
      metadata: response.metadata,
    };
  }

  throw new Error(response.message || 'Failed to fetch messages');
};

export const deleteMessage = async (
  conversationId: number,
  messageId: number
) => {
  const res = await fetch(
    MESSAGES_ENDPOINTS.DELETE_MESSAGE(conversationId, messageId),
    {
      method: 'DELETE',
      credentials: 'include',
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Authentication token is missing or invalid');
    }
    if (res.status === 404) {
      throw new Error('Message not found');
    }
    throw new Error('Failed to delete message');
  }

  return res.json();
};

export const markMessagesSeen = async (conversationId: number) => {
  const res = await fetch(MESSAGES_ENDPOINTS.MARK_SEEN(conversationId), {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to mark messages as seen');
  return res.json();
};

export const getUnseenCount = async () => {
  const res = await fetch(MESSAGES_ENDPOINTS.GET_UNSEEN_COUNT, {
    credentials: 'include',
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Authentication token is missing or invalid');
    }
    throw new Error('Failed to get unseen count');
  }

  const response = await res.json();

  // Backend returns: { status: "success", unseenCount: 5 }
  if (response.status === 'success') {
    return response.unseenCount;
  }

  throw new Error(response.message || 'Failed to get unseen count');
};

export const createConversation = async (userId: number) => {
  const url = MESSAGES_ENDPOINTS.CREATE_CONVERSATION(userId);

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));

    if (res.status === 400) {
      throw new Error(errorData.message || 'Invalid user ID provided');
    }
    if (res.status === 401) {
      throw new Error('Authentication token is missing or invalid');
    }
    if (res.status === 404) {
      throw new Error('User not found');
    }
    if (res.status === 409) {
      throw new Error('A conversation between these users already exists');
    }
    throw new Error('Failed to create conversation');
  }

  const data = await res.json();
  return data;
};

export const createMessage = async (conversationId: number, text: string) => {
  const res = await fetch(MESSAGES_ENDPOINTS.CREATE_MESSAGE(conversationId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('Failed to create message');
  return res.json();
};

export const getConversationUnseenCount = async (conversationId: number) => {
  const res = await fetch(
    MESSAGES_ENDPOINTS.GET_CONVERSATION_UNSEEN_COUNT(conversationId),
    {
      credentials: 'include',
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Authentication token is missing or invalid');
    }
    throw new Error('Failed to get unseen count');
  }

  return res.json();
};
