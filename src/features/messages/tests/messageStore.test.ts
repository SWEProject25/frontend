import { describe, it, expect, beforeEach } from 'vitest';
import { useMessageStore } from '../store/useMessageStore';

describe('Message Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useMessageStore.setState({
      conversations: [],
      messages: {},
      activeConversationId: null,
      typingUsers: {},
      unseenCounts: {},
    });
  });

  describe('setConversations', () => {
    it('should set conversations and sort by most recent', () => {
      const conversations = [
        {
          id: 1,
          conversationId: 1,
          user1Id: 1,
          user2Id: 2,
          createdAt: '2025-12-15T10:00:00Z',
          lastMessage: { createdAt: '2025-12-15T10:00:00Z' } as any,
        },
        {
          id: 2,
          conversationId: 2,
          user1Id: 1,
          user2Id: 3,
          createdAt: '2025-12-15T11:00:00Z',
          lastMessage: { createdAt: '2025-12-15T11:00:00Z' } as any,
        },
      ];

      useMessageStore.getState().setConversations(conversations);

      const state = useMessageStore.getState();
      expect(state.conversations).toHaveLength(2);
      // Most recent should be first
      expect(state.conversations[0].id).toBe(2);
    });
  });

  describe('addConversation', () => {
    it('should add new conversation', () => {
      const conversation = {
        id: 1,
        conversationId: 1,
        user1Id: 1,
        user2Id: 2,
        createdAt: '2025-12-15T10:00:00Z',
      };

      useMessageStore.getState().addConversation(conversation);

      const state = useMessageStore.getState();
      expect(state.conversations).toHaveLength(1);
      expect(state.conversations[0].id).toBe(1);
    });

    it('should not add duplicate conversation', () => {
      const conversation = {
        id: 1,
        conversationId: 1,
        user1Id: 1,
        user2Id: 2,
        createdAt: '2025-12-15T10:00:00Z',
      };

      useMessageStore.getState().addConversation(conversation);
      useMessageStore.getState().addConversation(conversation);

      const state = useMessageStore.getState();
      expect(state.conversations).toHaveLength(1);
    });
  });

  describe('addMessage', () => {
    it('should add new message to conversation', () => {
      const message = {
        id: 1,
        senderId: 1,
        conversationId: 5,
        text: 'Hello',
        isSeen: false,
        createdAt: '2025-12-15T10:00:00Z',
      };

      useMessageStore.getState().addMessage(message);

      const state = useMessageStore.getState();
      expect(state.messages[5]).toHaveLength(1);
      expect(state.messages[5][0].text).toBe('Hello');
    });

    it('should update existing message', () => {
      const message = {
        id: 1,
        senderId: 1,
        conversationId: 5,
        text: 'Hello',
        isSeen: false,
        createdAt: '2025-12-15T10:00:00Z',
      };

      useMessageStore.getState().addMessage(message);

      const updatedMessage = { ...message, isSeen: true };
      useMessageStore.getState().addMessage(updatedMessage);

      const state = useMessageStore.getState();
      expect(state.messages[5]).toHaveLength(1);
      expect(state.messages[5][0].isSeen).toBe(true);
    });

    it('should update conversation lastMessage', () => {
      const conversation = {
        id: 1,
        conversationId: 1,
        user1Id: 1,
        user2Id: 2,
        createdAt: '2025-12-15T10:00:00Z',
      };

      useMessageStore.getState().addConversation(conversation);

      const message = {
        id: 1,
        senderId: 1,
        conversationId: 1,
        text: 'Hello',
        isSeen: false,
        createdAt: '2025-12-15T10:00:00Z',
      };

      useMessageStore.getState().addMessage(message);

      const state = useMessageStore.getState();
      expect(state.conversations[0].lastMessage).toEqual(message);
    });
  });

  describe('setActiveConversation', () => {
    it('should set active conversation id', () => {
      useMessageStore.getState().setActiveConversation(10);
      expect(useMessageStore.getState().activeConversationId).toBe(10);
    });

    it('should clear active conversation', () => {
      useMessageStore.getState().setActiveConversation(10);
      useMessageStore.getState().setActiveConversation(null);
      expect(useMessageStore.getState().activeConversationId).toBeNull();
    });
  });

  describe('setMessagesForConversation', () => {
    it('should set messages for conversation', () => {
      const messages = [
        {
          id: 1,
          senderId: 1,
          conversationId: 5,
          text: 'Message 1',
          isSeen: false,
          createdAt: '2025-12-15T10:00:00Z',
        },
        {
          id: 2,
          senderId: 2,
          conversationId: 5,
          text: 'Message 2',
          isSeen: true,
          createdAt: '2025-12-15T10:01:00Z',
        },
      ];

      useMessageStore.getState().setMessagesForConversation(5, messages);

      const state = useMessageStore.getState();
      expect(state.messages[5]).toHaveLength(2);
      expect(state.messages[5][1].text).toBe('Message 2');
    });
  });

  describe('deleteMessage', () => {
    it('should delete message from conversation', () => {
      const messages = [
        {
          id: 1,
          senderId: 1,
          conversationId: 5,
          text: 'Message 1',
          isSeen: false,
          createdAt: '2025-12-15T10:00:00Z',
        },
        {
          id: 2,
          senderId: 2,
          conversationId: 5,
          text: 'Message 2',
          isSeen: true,
          createdAt: '2025-12-15T10:01:00Z',
        },
      ];

      useMessageStore.getState().setMessagesForConversation(5, messages);
      useMessageStore.getState().deleteMessage(5, 1);

      const state = useMessageStore.getState();
      expect(state.messages[5]).toHaveLength(1);
      expect(state.messages[5][0].id).toBe(2);
    });

    it('should update lastMessage when deleted message was last', () => {
      const conversation = {
        id: 1,
        conversationId: 1,
        user1Id: 1,
        user2Id: 2,
        createdAt: '2025-12-15T10:00:00Z',
      };

      useMessageStore.getState().addConversation(conversation);

      const messages = [
        {
          id: 1,
          senderId: 1,
          conversationId: 1,
          text: 'Message 1',
          isSeen: false,
          createdAt: '2025-12-15T10:00:00Z',
        },
        {
          id: 2,
          senderId: 2,
          conversationId: 1,
          text: 'Message 2',
          isSeen: true,
          createdAt: '2025-12-15T10:01:00Z',
        },
      ];

      useMessageStore.getState().setMessagesForConversation(1, messages);
      useMessageStore.getState().deleteMessage(1, 2);

      const state = useMessageStore.getState();
      expect(state.conversations[0].lastMessage?.id).toBe(1);
    });
  });

  describe('typing users', () => {
    it('should add typing user', () => {
      useMessageStore.getState().setUserTyping(5, 123);

      const state = useMessageStore.getState();
      expect(state.typingUsers[5]).toContain(123);
    });

    it('should not add duplicate typing user', () => {
      useMessageStore.getState().setUserTyping(5, 123);
      useMessageStore.getState().setUserTyping(5, 123);

      const state = useMessageStore.getState();
      expect(state.typingUsers[5]).toHaveLength(1);
    });

    it('should remove typing user', () => {
      useMessageStore.getState().setUserTyping(5, 123);
      useMessageStore.getState().removeUserTyping(5, 123);

      const state = useMessageStore.getState();
      expect(state.typingUsers[5]).toHaveLength(0);
    });
  });

  describe('markMessagesAsSeen', () => {
    it('should mark specific messages as seen', () => {
      const messages = [
        {
          id: 1,
          senderId: 1,
          conversationId: 5,
          text: 'Message 1',
          isSeen: false,
          createdAt: '2025-12-15T10:00:00Z',
        },
        {
          id: 2,
          senderId: 2,
          conversationId: 5,
          text: 'Message 2',
          isSeen: false,
          createdAt: '2025-12-15T10:01:00Z',
        },
      ];

      useMessageStore.getState().setMessagesForConversation(5, messages);
      useMessageStore.getState().markMessagesAsSeen(5, [1]);

      const state = useMessageStore.getState();
      expect(state.messages[5][0].isSeen).toBe(true);
      expect(state.messages[5][1].isSeen).toBe(false);
    });
  });

  describe('markAllMessagesAsSeen', () => {
    it('should mark all messages in conversation as seen', () => {
      const messages = [
        {
          id: 1,
          senderId: 1,
          conversationId: 5,
          text: 'Message 1',
          isSeen: false,
          createdAt: '2025-12-15T10:00:00Z',
        },
        {
          id: 2,
          senderId: 2,
          conversationId: 5,
          text: 'Message 2',
          isSeen: false,
          createdAt: '2025-12-15T10:01:00Z',
        },
      ];

      useMessageStore.getState().setMessagesForConversation(5, messages);
      useMessageStore.getState().markAllMessagesAsSeen(5);

      const state = useMessageStore.getState();
      expect(state.messages[5][0].isSeen).toBe(true);
      expect(state.messages[5][1].isSeen).toBe(true);
    });
  });

  describe('unseenCounts', () => {
    it('should set unseen count', () => {
      useMessageStore.getState().setUnseenCount(5, 3);

      const state = useMessageStore.getState();
      expect(state.unseenCounts[5]).toBe(3);
    });

    it('should update conversation unseen count', () => {
      const conversation = {
        id: 1,
        conversationId: 1,
        user1Id: 1,
        user2Id: 2,
        createdAt: '2025-12-15T10:00:00Z',
        unseenCount: 0,
      };

      useMessageStore.getState().addConversation(conversation);
      useMessageStore.getState().updateConversationUnseenCount(1, 5);

      const state = useMessageStore.getState();
      expect(state.conversations[0].unseenCount).toBe(5);
      expect(state.unseenCounts[1]).toBe(5);
    });
  });
});
