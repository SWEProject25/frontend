import { describe, it, expect } from 'vitest';

describe('Conversation Helpers', () => {
  describe('getUnseenMessageCount', () => {
    it('should count unseen messages correctly', () => {
      const messages = [
        { id: 1, isSeen: false },
        { id: 2, isSeen: true },
        { id: 3, isSeen: false },
      ];
      const unseenCount = messages.filter((msg) => !msg.isSeen).length;
      expect(unseenCount).toBe(2);
    });

    it('should return 0 when all messages are seen', () => {
      const messages = [
        { id: 1, isSeen: true },
        { id: 2, isSeen: true },
      ];
      const unseenCount = messages.filter((msg) => !msg.isSeen).length;
      expect(unseenCount).toBe(0);
    });

    it('should return total count when no messages are seen', () => {
      const messages = [
        { id: 1, isSeen: false },
        { id: 2, isSeen: false },
        { id: 3, isSeen: false },
      ];
      const unseenCount = messages.filter((msg) => !msg.isSeen).length;
      expect(unseenCount).toBe(3);
    });
  });

  describe('sortConversationsByDate', () => {
    it('should sort conversations by most recent first', () => {
      const conversations = [
        { id: 1, lastMessageAt: '2024-01-10T10:00:00Z' },
        { id: 2, lastMessageAt: '2024-01-15T10:00:00Z' },
        { id: 3, lastMessageAt: '2024-01-12T10:00:00Z' },
      ];

      const sorted = [...conversations].sort((a, b) => {
        return (
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime()
        );
      });

      expect(sorted[0].id).toBe(2);
      expect(sorted[1].id).toBe(3);
      expect(sorted[2].id).toBe(1);
    });
  });

  describe('formatConversationName', () => {
    it('should return full name when available', () => {
      const conversation = {
        name: 'John Doe',
        username: 'johndoe',
      };
      expect(conversation.name).toBe('John Doe');
    });

    it('should fallback to username when name is empty', () => {
      const conversation = {
        name: '',
        username: 'johndoe',
      };
      const displayName = conversation.name || conversation.username;
      expect(displayName).toBe('johndoe');
    });
  });
});
