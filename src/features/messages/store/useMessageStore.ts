import { create } from 'zustand';

type Message = {
  id: number;
  senderId: number;
  conversationId: number;
  text: string;
  isSeen: boolean;
  createdAt: string;
  updatedAt?: string;
};

type Conversation = {
  conversationId: number;
  user1Id: number;
  user2Id: number;
  createdAt: string;
  unseenCount?: number;
  isBlocked?: boolean; // True if either user blocked the other
  id?: number;
  user?: {
    id: number;
    username?: string;
    displayName?: string;
    name?: string;
    profile_image_url?: string;
    avatar?: string;
    verified?: boolean;
  };
  participants?: {
    id: number;
    name?: string;
    username?: string;
    avatar?: string;
  }[];
  lastMessage?: Message;
  name?: string;
  username?: string;
  avatar?: string;
  verified?: boolean;
};

type State = {
  conversations: Conversation[];
  messages: Record<number, Message[]>; // key conversation id
  activeConversationId: number | null;
  typingUsers: Record<number, number[]>; // conversationId -> array of userIds typing
  unseenCounts: Record<number, number>; // conversationId -> unseen count from API
  setConversations: (c: Conversation[]) => void;
  addConversation: (c: Conversation) => void;
  addMessage: (m: Message) => void;
  setActiveConversation: (id: number | null) => void;
  setMessagesForConversation: (id: number, msgs: Message[]) => void;
  deleteMessage: (conversationId: number, messageId: number) => void;
  setUserTyping: (conversationId: number, userId: number) => void;
  removeUserTyping: (conversationId: number, userId: number) => void;
  markMessagesAsSeen: (conversationId: number, messageIds: number[]) => void;
  markAllMessagesAsSeen: (conversationId: number) => void;
  setUnseenCount: (conversationId: number, count: number) => void;
  updateConversationUnseenCount: (
    conversationId: number,
    count: number
  ) => void;
};

const sortConversationsByRecent = (
  conversations: Conversation[]
): Conversation[] => {
  return [...conversations].sort((a, b) => {
    const aTime = a.lastMessage?.createdAt
      ? new Date(a.lastMessage.createdAt).getTime()
      : new Date(a.createdAt).getTime();
    const bTime = b.lastMessage?.createdAt
      ? new Date(b.lastMessage.createdAt).getTime()
      : new Date(b.createdAt).getTime();
    return bTime - aTime; // Most recent first
  });
};

export const useMessageStore = create<State>((set) => ({
  conversations: [],
  messages: {},
  activeConversationId: null,
  typingUsers: {},
  unseenCounts: {},
  setConversations: (c) => set({ conversations: sortConversationsByRecent(c) }),
  addConversation: (newConv) =>
    set((s) => {
      // Check if conversation already exists
      const exists = s.conversations.some((conv) => {
        const convId = conv.conversationId || conv.id;
        const newConvId = newConv.conversationId || newConv.id;
        return convId === newConvId;
      });

      if (exists) {
        return s;
      }

      // Add the new conversation and sort
      const updatedConversations = [...s.conversations, newConv];
      const sortedConversations =
        sortConversationsByRecent(updatedConversations);

      return { conversations: sortedConversations };
    }),
  addMessage: (m) =>
    set((s) => {
      const arr = s.messages[m.conversationId] ?? [];

      const existingMessageIndex = arr.findIndex((msg) => msg.id === m.id);

      let updatedMessages: Message[];
      if (existingMessageIndex !== -1) {
        updatedMessages = arr.map((msg, idx) =>
          idx === existingMessageIndex ? { ...msg, ...m } : msg
        );
      } else {
        updatedMessages = [...arr, m];
      }

      const updatedConversations = s.conversations.map((conv) => {
        const convId = conv.conversationId || conv.id;
        if (convId === m.conversationId) {
          return {
            ...conv,
            lastMessage: m,
          };
        }
        return conv;
      });

      const sortedConversations =
        sortConversationsByRecent(updatedConversations);

      return {
        messages: { ...s.messages, [m.conversationId]: updatedMessages },
        conversations: sortedConversations,
      };
    }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setMessagesForConversation: (id, msgs) =>
    set((s) => {
      const lastMessage = msgs.length > 0 ? msgs[msgs.length - 1] : undefined;
      const updatedConversations = s.conversations.map((conv) => {
        const convId = conv.conversationId || conv.id;
        if (convId === id) {
          return {
            ...conv,
            lastMessage,
          };
        }
        return conv;
      });

      return {
        messages: { ...s.messages, [id]: msgs },
        conversations: updatedConversations,
      };
    }),
  deleteMessage: (conversationId, messageId) =>
    set((s) => {
      const arr = s.messages[conversationId] ?? [];
      const updatedMessages = arr.filter((m) => m.id !== messageId);

      // Update the conversation's lastMessage if the deleted message was the last one
      const updatedConversations = s.conversations.map((conv) => {
        const convId = conv.conversationId || conv.id;
        if (convId === conversationId) {
          // If the deleted message was the last message, update to the new last message
          if (conv.lastMessage?.id === messageId) {
            const newLastMessage =
              updatedMessages.length > 0
                ? updatedMessages[updatedMessages.length - 1]
                : undefined;
            return {
              ...conv,
              lastMessage: newLastMessage,
            };
          }
        }
        return conv;
      });

      // Sort conversations by most recent message
      const sortedConversations =
        sortConversationsByRecent(updatedConversations);

      return {
        messages: {
          ...s.messages,
          [conversationId]: updatedMessages,
        },
        conversations: sortedConversations,
      };
    }),
  setUserTyping: (conversationId, userId) =>
    set((s) => {
      const users = s.typingUsers[conversationId] ?? [];
      if (users.includes(userId)) return s;
      return {
        typingUsers: {
          ...s.typingUsers,
          [conversationId]: [...users, userId],
        },
      };
    }),
  removeUserTyping: (conversationId, userId) =>
    set((s) => {
      const users = s.typingUsers[conversationId] ?? [];
      return {
        typingUsers: {
          ...s.typingUsers,
          [conversationId]: users.filter((id) => id !== userId),
        },
      };
    }),
  markMessagesAsSeen: (conversationId, messageIds) =>
    set((s) => {
      const arr = s.messages[conversationId] ?? [];
      return {
        messages: {
          ...s.messages,
          [conversationId]: arr.map((m) =>
            messageIds.includes(m.id) ? { ...m, isSeen: true } : m
          ),
        },
      };
    }),
  markAllMessagesAsSeen: (conversationId) =>
    set((s) => {
      const arr = s.messages[conversationId] ?? [];

      const updatedMessages = arr.map((m) => ({ ...m, isSeen: true }));

      return {
        messages: {
          ...s.messages,
          [conversationId]: updatedMessages,
        },
      };
    }),
  setUnseenCount: (conversationId, count) =>
    set((s) => ({
      unseenCounts: {
        ...s.unseenCounts,
        [conversationId]: count,
      },
    })),
  updateConversationUnseenCount: (conversationId, count) =>
    set((s) => {
      const updatedConversations = s.conversations.map((conv) => {
        const convId = conv.conversationId || conv.id;
        if (convId === conversationId) {
          return {
            ...conv,
            unseenCount: count,
          };
        }
        return conv;
      });

      return {
        conversations: updatedConversations,
        unseenCounts: {
          ...s.unseenCounts,
          [conversationId]: count,
        },
      };
    }),
}));
