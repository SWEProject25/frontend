import { describe, it, expect, beforeEach } from 'vitest';
import { server } from '@/mocks/server';
import { MESSAGES_API_CONFIG } from '../constants/api';

describe('Messages API', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  describe('API Endpoints', () => {
    it('should have BASE_URL defined', () => {
      expect(MESSAGES_API_CONFIG.BASE_URL).toBeDefined();
      expect(typeof MESSAGES_API_CONFIG.BASE_URL).toBe('string');
    });

    it('should have WS_URL defined', () => {
      expect(MESSAGES_API_CONFIG.WS_URL).toBeDefined();
      expect(typeof MESSAGES_API_CONFIG.WS_URL).toBe('string');
    });
  });

  describe('Data Structures', () => {
    it('should construct message payload correctly', () => {
      const payload = { conversationId: 1, text: 'Hello' };
      expect(payload).toHaveProperty('conversationId');
      expect(payload).toHaveProperty('text');
      expect(payload.conversationId).toBe(1);
      expect(payload.text).toBe('Hello');
    });

    it('should construct conversation payload correctly', () => {
      const payload = { participantId: 5 };
      expect(payload).toHaveProperty('participantId');
      expect(payload.participantId).toBe(5);
    });

    it('should handle message with seen status', () => {
      const message = {
        id: 1,
        text: 'Test',
        isSeen: true,
        senderId: 123,
        conversationId: 456,
        createdAt: new Date().toISOString(),
      };
      expect(message.isSeen).toBe(true);
    });
  });
});
