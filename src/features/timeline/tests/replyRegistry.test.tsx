import { describe, it, expect, beforeEach } from 'vitest';
import { getAddReplyStore, clearReplyStore } from '../store/replyRegistry';

describe('replyRegistry', () => {
  beforeEach(() => {
    // Clear the registry between tests by clearing known keys
    clearReplyStore(1);
    clearReplyStore(2);
    clearReplyStore(3);
  });

  describe('getAddReplyStore', () => {
    it('should create a new store for a new key', () => {
      const store = getAddReplyStore(1);
      expect(store).toBeDefined();
    });

    it('should return the same store for the same key', () => {
      const store1 = getAddReplyStore(1);
      const store2 = getAddReplyStore(1);
      expect(store1).toBe(store2);
    });

    it('should return different stores for different keys', () => {
      const store1 = getAddReplyStore(1);
      const store2 = getAddReplyStore(2);
      expect(store1).not.toBe(store2);
    });

    it('should return a store that is a function', () => {
      const store = getAddReplyStore(1);
      expect(typeof store).toBe('function');
    });

    it('should create store with initial state', () => {
      const store = getAddReplyStore(1);
      const state = store?.getState();
      expect(state).toBeDefined();
      expect(state?.tweetText).toBe('');
      expect(state?.media).toEqual([]);
    });
  });

  describe('clearReplyStore', () => {
    it('should clear a specific store from the registry', () => {
      const store1 = getAddReplyStore(1);
      clearReplyStore(1);
      const store2 = getAddReplyStore(1);
      // After clearing, a new store should be created
      expect(store1).not.toBe(store2);
    });

    it('should not affect other stores when clearing one', () => {
      getAddReplyStore(1); // Create store 1
      const store2 = getAddReplyStore(2);
      clearReplyStore(1);
      const store2After = getAddReplyStore(2);
      expect(store2).toBe(store2After);
    });

    it('should not throw when clearing non-existent key', () => {
      expect(() => clearReplyStore(999)).not.toThrow();
    });
  });

  describe('store functionality', () => {
    it('should allow setting tweet text', () => {
      const store = getAddReplyStore(1);
      store?.getState().actions.setTweetText('Hello world');
      expect(store?.getState().tweetText).toBe('Hello world');
    });

    it('should allow adding media', () => {
      const store = getAddReplyStore(1);
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
      store?.getState().actions.addMedia([mockFile]);
      expect(store?.getState().media.length).toBe(1);
    });

    it('should isolate state between different stores', () => {
      const store1 = getAddReplyStore(1);
      const store2 = getAddReplyStore(2);

      store1?.getState().actions.setTweetText('Hello from store 1');
      store2?.getState().actions.setTweetText('Hello from store 2');

      expect(store1?.getState().tweetText).toBe('Hello from store 1');
      expect(store2?.getState().tweetText).toBe('Hello from store 2');
    });
  });
});
