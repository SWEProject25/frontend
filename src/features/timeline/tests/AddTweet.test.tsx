import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

// Since AddTweet is a complex component with many dependencies,
// we test that the store and context exports work correctly
import {
  createAddTweetStore,
  createAddTweetSelectors,
} from '../store/useAddPostStore';
import { timelineComposerSelectors } from '../store/useTimelineComposer';
import { ADD_TWEET } from '../constants/tweetConstants';

describe('AddTweet', () => {
  describe('ADD_TWEET constants', () => {
    it('should have POST type', () => {
      expect(ADD_TWEET.POST).toBe('POST');
    });

    it('should have REPLY type', () => {
      expect(ADD_TWEET.REPLY).toBe('REPLY');
    });

    it('should have QUOTE type', () => {
      expect(ADD_TWEET.QUOTE).toBe('QUOTE');
    });
  });

  describe('Store factory functions', () => {
    it('should create store with createAddTweetStore', () => {
      const store = createAddTweetStore();
      expect(store).toBeDefined();
      expect(typeof store).toBe('function');
    });

    it('should create selectors with createAddTweetSelectors', () => {
      const store = createAddTweetStore();
      const selectors = createAddTweetSelectors(store);
      expect(selectors).toBeDefined();
      expect(selectors.useTweetText).toBeDefined();
      expect(selectors.useMedia).toBeDefined();
    });
  });

  describe('Timeline composer selectors', () => {
    it('should have useTweetText selector', () => {
      expect(timelineComposerSelectors.useTweetText).toBeDefined();
    });

    it('should have useMedia selector', () => {
      expect(timelineComposerSelectors.useMedia).toBeDefined();
    });

    it('should have useIsSending selector', () => {
      expect(timelineComposerSelectors.useIsSending).toBeDefined();
    });

    it('should have useActions selector', () => {
      expect(timelineComposerSelectors.useActions).toBeDefined();
    });
  });
});
