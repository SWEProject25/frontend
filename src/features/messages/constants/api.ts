export const MESSAGES_API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000',
  VERSION: process.env.NEXT_PUBLIC_API_VERSION || 'v1.0',
} as const;

export const MESSAGES_ENDPOINTS = {
  // Conversations
  GET_CONVERSATIONS: (page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    const queryString = params.toString();
    return `${MESSAGES_API_CONFIG.BASE_URL}/api/${MESSAGES_API_CONFIG.VERSION}/conversations${queryString ? `?${queryString}` : ''}`;
  },
  GET_CONVERSATION_BY_ID: (conversationId: number) =>
    `${MESSAGES_API_CONFIG.BASE_URL}/api/${MESSAGES_API_CONFIG.VERSION}/conversations/${conversationId}`,
  CREATE_CONVERSATION: (userId: number) =>
    `${MESSAGES_API_CONFIG.BASE_URL}/api/${MESSAGES_API_CONFIG.VERSION}/conversations/${userId}`,
  DELETE_CONVERSATION: (conversationId: number) =>
    `${MESSAGES_API_CONFIG.BASE_URL}/api/${MESSAGES_API_CONFIG.VERSION}/conversations/${conversationId}`,
  GET_UNSEEN_COUNT: `${MESSAGES_API_CONFIG.BASE_URL}/api/${MESSAGES_API_CONFIG.VERSION}/conversations/unseen`,

  // Messages
  GET_MESSAGES: (
    conversationId: number,
    lastMessageId?: number,
    limit?: number
  ) => {
    const params = new URLSearchParams();
    if (lastMessageId !== undefined)
      params.append('lastMessageId', lastMessageId.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    const queryString = params.toString();
    return `${MESSAGES_API_CONFIG.BASE_URL}/api/${MESSAGES_API_CONFIG.VERSION}/messages/${conversationId}${queryString ? `?${queryString}` : ''}`;
  },
  CREATE_MESSAGE: (conversationId: number) =>
    `${MESSAGES_API_CONFIG.BASE_URL}/api/${MESSAGES_API_CONFIG.VERSION}/conversations/${conversationId}/messages`,
  DELETE_MESSAGE: (conversationId: number, messageId: number) =>
    `${MESSAGES_API_CONFIG.BASE_URL}/api/${MESSAGES_API_CONFIG.VERSION}/messages/${conversationId}/${messageId}`,
  MARK_SEEN: (conversationId: number) =>
    `${MESSAGES_API_CONFIG.BASE_URL}/api/${MESSAGES_API_CONFIG.VERSION}/conversations/${conversationId}/seen`,
  GET_CONVERSATION_UNSEEN_COUNT: (conversationId: number) =>
    `${MESSAGES_API_CONFIG.BASE_URL}/api/${MESSAGES_API_CONFIG.VERSION}/messages/${conversationId}/unseen-count`,
} as const;

export const MESSAGES_SOCKET_EVENTS = {
  // Client → Server (Emit)
  JOIN_CONVERSATION: 'joinConversation',
  LEAVE_CONVERSATION: 'leaveConversation',
  CREATE_MESSAGE: 'createMessage',
  DELETE_MESSAGE: 'deleteMessage',
  TYPING: 'typing',
  STOP_TYPING: 'stopTyping',
  MARK_SEEN: 'markSeen',

  // Server → Client (Listen)
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONVERSATION_CREATED: 'conversationCreated',
  MESSAGE_CREATED: 'messageCreated',
  MESSAGE_DELETED: 'messageDeleted',
  NEW_MESSAGE_NOTIFICATION: 'newMessageNotification',
  MESSAGES_SEEN: 'messagesSeen',
  USER_TYPING: 'userTyping',
  USER_STOPPED_TYPING: 'userStoppedTyping',
  CONNECT_ERROR: 'connect_error',
  ERROR: 'error',
} as const;

export const MESSAGES_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  TYPING_TIMEOUT: 700, // 0.7 seconds
  MAX_MESSAGE_LENGTH: 1000,
  RECONNECTION_DELAY: 1000,
} as const;
