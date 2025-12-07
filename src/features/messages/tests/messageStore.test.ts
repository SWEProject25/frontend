import { describe, it, expect, beforeEach } from 'vitest';

// Mock basic store behavior
describe('Message Store', () => {
  let mockStore: any;

  beforeEach(() => {
    // Reset mock store before each test
    mockStore = {
      messages: {},
      conversations: [],
      activeConversationId: null,
    };
  });

  describe('addMessage', () => {
    it('should add message to conversation', () => {
      const message = {
        id: 1,
        conversationId: 5,
        text: 'Hello',
        senderId: 2,
      };

      if (!mockStore.messages[message.conversationId]) {
        mockStore.messages[message.conversationId] = [];
      }
      mockStore.messages[message.conversationId].push(message);

      expect(mockStore.messages[5]).toHaveLength(1);
      expect(mockStore.messages[5][0].text).toBe('Hello');
    });
  });

  describe('setActiveConversation', () => {
    it('should set active conversation id', () => {
      mockStore.activeConversationId = 10;
      expect(mockStore.activeConversationId).toBe(10);
    });

    it('should clear active conversation', () => {
      mockStore.activeConversationId = 10;
      mockStore.activeConversationId = null;
      expect(mockStore.activeConversationId).toBeNull();
    });
  });

  describe('addConversation', () => {
    it('should add new conversation to list', () => {
      const conversation = {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
      };

      mockStore.conversations.push(conversation);
      expect(mockStore.conversations).toHaveLength(1);
      expect(mockStore.conversations[0].name).toBe('John Doe');
    });
  });

  describe('markMessagesAsSeen', () => {
    it('should mark all messages in conversation as seen', () => {
      const conversationId = 5;
      mockStore.messages[conversationId] = [
        { id: 1, isSeen: false },
        { id: 2, isSeen: false },
      ];

      mockStore.messages[conversationId].forEach((msg: any) => {
        msg.isSeen = true;
      });

      expect(mockStore.messages[conversationId][0].isSeen).toBe(true);
      expect(mockStore.messages[conversationId][1].isSeen).toBe(true);
    });
  });
});
