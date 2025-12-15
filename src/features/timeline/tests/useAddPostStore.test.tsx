import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  createAddTweetStore,
  createAddTweetSelectors,
} from '../store/useAddPostStore';

describe('useAddPostStore', () => {
  describe('createAddTweetStore', () => {
    it('should create a new store instance', () => {
      const store = createAddTweetStore();
      expect(store).toBeDefined();
      expect(typeof store).toBe('function');
    });

    it('should create independent store instances', () => {
      const store1 = createAddTweetStore();
      const store2 = createAddTweetStore();

      // They should be different instances
      expect(store1).not.toBe(store2);
    });

    it('should have correct initial state', () => {
      const store = createAddTweetStore();
      const state = store.getState();

      expect(state.tweetText).toBe('');
      expect(state.isSending).toBe(false);
      expect(state.error).toBe('');
      expect(state.isSuccess).toBe(false);
      expect(state.mentions).toEqual([]);
      expect(state.media).toEqual([]);
      expect(state.emoji).toBe('');
      expect(state.mention).toBe('');
      expect(state.isOpen).toBe(false);
      expect(state.mentionIsdone).toBe('');
      expect(state.currentKey).toBe('');
      expect(state.placeHolder).toBe("What's happening?");
      expect(state.isGifOpen).toBe(false);
      expect(state.search).toBe('');
      expect(state.parentId).toBe(-1);
      expect(state.selectedReplyOption).toBe(-1);
    });
  });

  describe('store actions', () => {
    let store: ReturnType<typeof createAddTweetStore>;

    beforeEach(() => {
      store = createAddTweetStore();
    });

    it('actions.setTweetText should update tweet text', () => {
      act(() => {
        store.getState().actions.setTweetText('Hello World');
      });

      expect(store.getState().tweetText).toBe('Hello World');
    });

    it('actions.startSending should update sending state', () => {
      act(() => {
        store.getState().actions.startSending();
      });

      expect(store.getState().isSending).toBe(true);
      expect(store.getState().error).toBe('');
      expect(store.getState().isSuccess).toBe(false);
    });

    it('actions.onSuccess should reset state', () => {
      // Set some state first
      act(() => {
        store.getState().actions.setTweetText('Test');
        store.getState().actions.startSending();
      });

      act(() => {
        store.getState().actions.onSuccess();
      });

      expect(store.getState().isSending).toBe(false);
      expect(store.getState().isSuccess).toBe(true);
      expect(store.getState().tweetText).toBe('');
      expect(store.getState().mentions).toEqual([]);
      expect(store.getState().media).toEqual([]);
    });

    it('actions.seterror should set error message', () => {
      act(() => {
        store.getState().actions.seterror('Something went wrong');
      });

      expect(store.getState().error).toBe('Something went wrong');
      expect(store.getState().isSending).toBe(false);
      expect(store.getState().isSuccess).toBe(false);
    });

    it('actions.addMedia should add media files', () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });

      act(() => {
        store.getState().actions.addMedia([mockFile]);
      });

      expect(store.getState().media.length).toBe(1);
      expect(store.getState().media[0].data).toBe(mockFile);
      expect(store.getState().media[0].type).toBe('localMedia');
    });

    it('actions.removeMedia should remove media by id', () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });

      act(() => {
        store.getState().actions.addMedia([mockFile]);
      });

      const mediaId = store.getState().media[0].id;

      act(() => {
        store.getState().actions.removeMedia(mediaId);
      });

      expect(store.getState().media.length).toBe(0);
    });

    it('actions.clearMedia should clear all media', () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });

      act(() => {
        store.getState().actions.addMedia([mockFile]);
        store.getState().actions.clearMedia();
      });

      expect(store.getState().media).toEqual([]);
    });

    it('actions.setEmoji should set emoji', () => {
      act(() => {
        store.getState().actions.setEmoji('😀');
      });

      expect(store.getState().emoji).toBe('😀');
    });

    it('actions.clearEmoji should clear emoji', () => {
      act(() => {
        store.getState().actions.setEmoji('😀');
        store.getState().actions.clearEmoji();
      });

      expect(store.getState().emoji).toBe('');
    });

    it('actions.setMention should set mention', () => {
      act(() => {
        store.getState().actions.setMention('@user');
      });

      expect(store.getState().mention).toBe('@user');
    });

    it('actions.setIsOpen should set isOpen', () => {
      act(() => {
        store.getState().actions.setIsOpen(true);
      });

      expect(store.getState().isOpen).toBe(true);
    });

    it('actions.setIsDone should set mentionIsdone', () => {
      act(() => {
        store.getState().actions.setIsDone('username 123');
      });

      expect(store.getState().mentionIsdone).toBe('username 123');
    });

    it('actions.setKeyDown should set currentKey', () => {
      act(() => {
        store.getState().actions.setKeyDown('ArrowDown');
      });

      expect(store.getState().currentKey).toBe('ArrowDown');
    });

    it('actions.setPlaceHolder should set placeHolder', () => {
      act(() => {
        store.getState().actions.setPlaceHolder('Custom placeholder');
      });

      expect(store.getState().placeHolder).toBe('Custom placeholder');
    });

    it('actions.open should open gif modal', () => {
      act(() => {
        store.getState().actions.open();
      });

      expect(store.getState().isGifOpen).toBe(true);
    });

    it('actions.close should close gif modal', () => {
      act(() => {
        store.getState().actions.open();
        store.getState().actions.close();
      });

      expect(store.getState().isGifOpen).toBe(false);
    });

    it('actions.setSearch should set search', () => {
      act(() => {
        store.getState().actions.setSearch('cat gifs');
      });

      expect(store.getState().search).toBe('cat gifs');
    });

    it('actions.setParentId should set parentId', () => {
      act(() => {
        store.getState().actions.setParentId(123);
      });

      expect(store.getState().parentId).toBe(123);
    });

    it('actions.updateReplyOption should update selectedReplyOption', () => {
      act(() => {
        store.getState().actions.updateReplyOption(2);
      });

      expect(store.getState().selectedReplyOption).toBe(2);
    });

    it('actions.setMentions should set mentions', () => {
      const mockMentions = [
        { indx: 0, username: '@user1', checked: true, id: 1 },
      ];

      act(() => {
        store.getState().actions.setMentions(mockMentions);
      });

      expect(store.getState().mentions).toEqual(mockMentions);
    });

    it('actions.addGifs should add gif media', () => {
      const mockGif = {
        id: 'gif123',
        title: 'Test Gif',
        images: {
          original: { url: 'http://example.com/gif.gif' },
          fixed_height: { url: 'http://example.com/gif-small.gif' },
        },
      };

      act(() => {
        store.getState().actions.addGifs(mockGif as any);
      });

      expect(store.getState().media.length).toBe(1);
      expect(store.getState().media[0].type).toBe('externalGif');
    });
  });

  describe('createAddTweetSelectors', () => {
    let store: ReturnType<typeof createAddTweetStore>;
    let selectors: ReturnType<typeof createAddTweetSelectors>;

    beforeEach(() => {
      store = createAddTweetStore();
      selectors = createAddTweetSelectors(store);
    });

    it('should create selectors from store', () => {
      expect(selectors).toBeDefined();
      expect(selectors.useTweetText).toBeDefined();
      expect(selectors.useMedia).toBeDefined();
      expect(selectors.useMentions).toBeDefined();
      expect(selectors.useIsSending).toBeDefined();
      expect(selectors.useIsSuccess).toBeDefined();
      expect(selectors.useError).toBeDefined();
      expect(selectors.useEmoji).toBeDefined();
      expect(selectors.useMention).toBeDefined();
      expect(selectors.useCurrentKey).toBeDefined();
      expect(selectors.useMentionIsDone).toBeDefined();
      expect(selectors.useIsOpen).toBeDefined();
      expect(selectors.usePlaceHolder).toBeDefined();
      expect(selectors.useGifVisibility).toBeDefined();
      expect(selectors.useGifsSearch).toBeDefined();
      expect(selectors.useParentId).toBeDefined();
      expect(selectors.useSelectedReplyOption).toBeDefined();
      expect(selectors.useActions).toBeDefined();
    });

    it('useTweetText should return tweet text', () => {
      act(() => {
        store.getState().actions.setTweetText('Test tweet');
      });

      const { result } = renderHook(() => selectors.useTweetText());
      expect(result.current).toBe('Test tweet');
    });

    it('useIsSending should return sending state', () => {
      act(() => {
        store.getState().actions.startSending();
      });

      const { result } = renderHook(() => selectors.useIsSending());
      expect(result.current).toBe(true);
    });

    it('useMedia should return media array', () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });

      act(() => {
        store.getState().actions.addMedia([mockFile]);
      });

      const { result } = renderHook(() => selectors.useMedia());
      expect(result.current.length).toBe(1);
    });

    it('useActions should return actions', () => {
      const { result } = renderHook(() => selectors.useActions());

      expect(result.current.setTweetText).toBeDefined();
      expect(result.current.addMedia).toBeDefined();
      expect(result.current.startSending).toBeDefined();
    });

    it('useGifVisibility should return gif modal visibility', () => {
      act(() => {
        store.getState().actions.open();
      });

      const { result } = renderHook(() => selectors.useGifVisibility());
      expect(result.current).toBe(true);
    });

    it('useParentId should return parent id', () => {
      act(() => {
        store.getState().actions.setParentId(42);
      });

      const { result } = renderHook(() => selectors.useParentId());
      expect(result.current).toBe(42);
    });

    it('useSelectedReplyOption should return selected option', () => {
      act(() => {
        store.getState().actions.updateReplyOption(3);
      });

      const { result } = renderHook(() => selectors.useSelectedReplyOption());
      expect(result.current).toBe(3);
    });
  });
});
