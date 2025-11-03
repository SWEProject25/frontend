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
  // Optional frontend-enriched fields
  id?: number; // Alias for conversationId
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
  setConversations: (c: Conversation[]) => void;
  addMessage: (m: Message) => void;
  setActiveConversation: (id: number | null) => void;
  setMessagesForConversation: (id: number, msgs: Message[]) => void;
  updateMessage: (m: Message) => void;
  deleteMessage: (conversationId: number, messageId: number) => void;
  setUserTyping: (conversationId: number, userId: number) => void;
  removeUserTyping: (conversationId: number, userId: number) => void;
  markMessagesAsSeen: (conversationId: number, messageIds: number[]) => void;
  markAllMessagesAsSeen: (conversationId: number) => void;
};

export const useMessageStore = create<State>((set) => ({
  conversations: [],
  messages: {},
  activeConversationId: null,
  typingUsers: {},
  setConversations: (c) => set({ conversations: c }),
  addMessage: (m) =>
    set((s) => {
      const arr = s.messages[m.conversationId] ?? [];
      return { messages: { ...s.messages, [m.conversationId]: [...arr, m] } };
    }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setMessagesForConversation: (id, msgs) =>
    set((s) => ({ messages: { ...s.messages, [id]: msgs } })),
  updateMessage: (m) =>
    set((s) => {
      const arr = s.messages[m.conversationId] ?? [];
      return {
        messages: {
          ...s.messages,
          [m.conversationId]: arr.map((i) =>
            i.id === m.id ? { ...i, ...m } : i
          ),
        },
      };
    }),
  deleteMessage: (conversationId, messageId) =>
    set((s) => {
      const arr = s.messages[conversationId] ?? [];
      return {
        messages: {
          ...s.messages,
          [conversationId]: arr.filter((m) => m.id !== messageId),
        },
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
      console.log(
        '📦 STORE: markAllMessagesAsSeen called for conversation:',
        conversationId
      );
      console.log('📦 STORE: Current messages:', arr);

      const updatedMessages = arr.map((m) => ({ ...m, isSeen: true }));
      console.log(
        '📦 STORE: Updated messages (all isSeen=true):',
        updatedMessages
      );

      return {
        messages: {
          ...s.messages,
          [conversationId]: updatedMessages,
        },
      };
    }),
}));
