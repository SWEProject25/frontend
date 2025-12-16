import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  useTimelineComposerStore,
  timelineComposerSelectors,
} from '../store/useTimelineComposer';

describe('useTimelineComposerStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useTimelineComposerStore.setState({
      tweetText: '',
      isSending: false,
      error: '',
      isSuccess: false,
      mentions: [],
      media: [],
      emoji: '',
      mention: '',
      isOpen: false,
      mentionIsdone: '',
      currentKey: '',
      placeHolder: "What's happening?",
      isGifOpen: false,
      search: '',
      parentId: -1,
      selectedReplyOption: -1,
    });
  });

  describe('initial state', () => {
    it('should have empty tweetText', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      expect(result.current.tweetText).toBe('');
    });

    it('should have isSending as false', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      expect(result.current.isSending).toBe(false);
    });

    it('should have empty error', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      expect(result.current.error).toBe('');
    });

    it('should have isSuccess as false', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      expect(result.current.isSuccess).toBe(false);
    });

    it('should have empty mentions', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      expect(result.current.mentions).toEqual([]);
    });

    it('should have empty media', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      expect(result.current.media).toEqual([]);
    });

    it('should have default placeHolder', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      expect(result.current.placeHolder).toBe("What's happening?");
    });

    it('should have isGifOpen as false', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      expect(result.current.isGifOpen).toBe(false);
    });

    it('should have parentId as -1', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      expect(result.current.parentId).toBe(-1);
    });

    it('should have selectedReplyOption as -1', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      expect(result.current.selectedReplyOption).toBe(-1);
    });
  });

  describe('actions.setTweetText', () => {
    it('should update tweet text', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.setTweetText('Hello World');
      });

      expect(result.current.tweetText).toBe('Hello World');
    });
  });

  describe('actions.startSending', () => {
    it('should set isSending to true and clear error', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      useTimelineComposerStore.setState({ error: 'Previous error' });

      act(() => {
        result.current.actions.startSending();
      });

      expect(result.current.isSending).toBe(true);
      expect(result.current.error).toBe('');
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('actions.onSuccess', () => {
    it('should reset state on success', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      // Set some state
      act(() => {
        result.current.actions.setTweetText('Test');
        result.current.actions.startSending();
      });

      act(() => {
        result.current.actions.onSuccess();
      });

      expect(result.current.isSending).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.tweetText).toBe('');
      expect(result.current.mentions).toEqual([]);
      expect(result.current.media).toEqual([]);
    });
  });

  describe('actions.seterror', () => {
    it('should set error message and stop sending', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.startSending();
      });

      act(() => {
        result.current.actions.seterror('Something went wrong');
      });

      expect(result.current.error).toBe('Something went wrong');
      expect(result.current.isSending).toBe(false);
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('actions.addMedia', () => {
    it('should add media files', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });

      act(() => {
        result.current.actions.addMedia([mockFile]);
      });

      expect(result.current.media.length).toBe(1);
      expect(result.current.media[0].data).toBe(mockFile);
    });

    it('should add multiple media files', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      const mockFile1 = new File(['test1'], 'test1.png', { type: 'image/png' });
      const mockFile2 = new File(['test2'], 'test2.png', { type: 'image/png' });

      act(() => {
        result.current.actions.addMedia([mockFile1, mockFile2]);
      });

      expect(result.current.media.length).toBe(2);
    });

    it('should generate unique IDs for media', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      const mockFile1 = new File(['test1'], 'test1.png', { type: 'image/png' });
      const mockFile2 = new File(['test2'], 'test2.png', { type: 'image/png' });

      act(() => {
        result.current.actions.addMedia([mockFile1, mockFile2]);
      });

      expect(result.current.media[0].id).not.toBe(result.current.media[1].id);
    });
  });

  describe('actions.removeMedia', () => {
    it('should remove media by id', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });

      act(() => {
        result.current.actions.addMedia([mockFile]);
      });

      const mediaId = result.current.media[0].id;

      act(() => {
        result.current.actions.removeMedia(mediaId);
      });

      expect(result.current.media.length).toBe(0);
    });
  });

  describe('actions.clearMedia', () => {
    it('should clear all media', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' });

      act(() => {
        result.current.actions.addMedia([mockFile]);
        result.current.actions.clearMedia();
      });

      expect(result.current.media).toEqual([]);
    });
  });

  describe('actions.setEmoji and clearEmoji', () => {
    it('should set emoji', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.setEmoji('😀');
      });

      expect(result.current.emoji).toBe('😀');
    });

    it('should clear emoji', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.setEmoji('😀');
        result.current.actions.clearEmoji();
      });

      expect(result.current.emoji).toBe('');
    });
  });

  describe('actions.setMention', () => {
    it('should set mention', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.setMention('@user');
      });

      expect(result.current.mention).toBe('@user');
    });
  });

  describe('actions.setIsOpen', () => {
    it('should set isOpen', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.setIsOpen(true);
      });

      expect(result.current.isOpen).toBe(true);
    });
  });

  describe('actions.setIsDone', () => {
    it('should set mentionIsdone', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.setIsDone('username 123');
      });

      expect(result.current.mentionIsdone).toBe('username 123');
    });
  });

  describe('actions.setKeyDown', () => {
    it('should set currentKey', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.setKeyDown('ArrowDown');
      });

      expect(result.current.currentKey).toBe('ArrowDown');
    });
  });

  describe('actions.setPlaceHolder', () => {
    it('should set placeHolder', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.setPlaceHolder('Post your reply');
      });

      expect(result.current.placeHolder).toBe('Post your reply');
    });
  });

  describe('actions.open and close (gif)', () => {
    it('should open gif modal', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.open();
      });

      expect(result.current.isGifOpen).toBe(true);
    });

    it('should close gif modal', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.open();
        result.current.actions.close();
      });

      expect(result.current.isGifOpen).toBe(false);
    });
  });

  describe('actions.setSearch', () => {
    it('should set search', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.setSearch('cat gifs');
      });

      expect(result.current.search).toBe('cat gifs');
    });
  });

  describe('actions.setParentId', () => {
    it('should set parentId', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.setParentId(123);
      });

      expect(result.current.parentId).toBe(123);
    });
  });

  describe('actions.updateReplyOption', () => {
    it('should update selectedReplyOption', () => {
      const { result } = renderHook(() => useTimelineComposerStore());

      act(() => {
        result.current.actions.updateReplyOption(2);
      });

      expect(result.current.selectedReplyOption).toBe(2);
    });
  });

  describe('actions.setMentions', () => {
    it('should set mentions', () => {
      const { result } = renderHook(() => useTimelineComposerStore());
      const mockMentions = [
        { indx: 0, username: '@user1', checked: true, id: 1 },
      ];

      act(() => {
        result.current.actions.setMentions(mockMentions);
      });

      expect(result.current.mentions).toEqual(mockMentions);
    });
  });
});

describe('timelineComposerSelectors', () => {
  beforeEach(() => {
    useTimelineComposerStore.setState({
      tweetText: 'Test tweet',
      isSending: true,
      error: 'Test error',
      isSuccess: true,
      mentions: [{ indx: 0, username: 'user', checked: true, id: 1 }],
      media: [],
      emoji: '😀',
      mention: '@test',
      isOpen: true,
      mentionIsdone: 'done',
      currentKey: 'Enter',
      placeHolder: 'Custom placeholder',
      isGifOpen: true,
      search: 'search term',
      parentId: 42,
      selectedReplyOption: 3,
    });
  });

  it('useTweetText should return tweet text', () => {
    const { result } = renderHook(() =>
      timelineComposerSelectors.useTweetText()
    );
    expect(result.current).toBe('Test tweet');
  });

  it('useIsSending should return sending state', () => {
    const { result } = renderHook(() =>
      timelineComposerSelectors.useIsSending()
    );
    expect(result.current).toBe(true);
  });

  it('useError should return error', () => {
    const { result } = renderHook(() => timelineComposerSelectors.useError());
    expect(result.current).toBe('Test error');
  });

  it('useIsSuccess should return success state', () => {
    const { result } = renderHook(() =>
      timelineComposerSelectors.useIsSuccess()
    );
    expect(result.current).toBe(true);
  });

  it('useMentions should return mentions', () => {
    const { result } = renderHook(() =>
      timelineComposerSelectors.useMentions()
    );
    expect(result.current).toHaveLength(1);
  });

  it('useMedia should return media', () => {
    const { result } = renderHook(() => timelineComposerSelectors.useMedia());
    expect(result.current).toEqual([]);
  });

  it('useEmoji should return emoji', () => {
    const { result } = renderHook(() => timelineComposerSelectors.useEmoji());
    expect(result.current).toBe('😀');
  });

  it('useMention should return mention', () => {
    const { result } = renderHook(() => timelineComposerSelectors.useMention());
    expect(result.current).toBe('@test');
  });

  it('useIsOpen should return isOpen', () => {
    const { result } = renderHook(() => timelineComposerSelectors.useIsOpen());
    expect(result.current).toBe(true);
  });

  it('useMentionIsDone should return mentionIsdone', () => {
    const { result } = renderHook(() =>
      timelineComposerSelectors.useMentionIsDone()
    );
    expect(result.current).toBe('done');
  });

  it('useCurrentKey should return currentKey', () => {
    const { result } = renderHook(() =>
      timelineComposerSelectors.useCurrentKey()
    );
    expect(result.current).toBe('Enter');
  });

  it('usePlaceHolder should return placeHolder', () => {
    const { result } = renderHook(() =>
      timelineComposerSelectors.usePlaceHolder()
    );
    expect(result.current).toBe('Custom placeholder');
  });

  it('useGifVisibility should return isGifOpen', () => {
    const { result } = renderHook(() =>
      timelineComposerSelectors.useGifVisibility()
    );
    expect(result.current).toBe(true);
  });

  it('useGifsSearch should return search', () => {
    const { result } = renderHook(() =>
      timelineComposerSelectors.useGifsSearch()
    );
    expect(result.current).toBe('search term');
  });

  it('useParentId should return parentId', () => {
    const { result } = renderHook(() =>
      timelineComposerSelectors.useParentId()
    );
    expect(result.current).toBe(42);
  });

  it('useSelectedReplyOption should return selectedReplyOption', () => {
    const { result } = renderHook(() =>
      timelineComposerSelectors.useSelectedReplyOption()
    );
    expect(result.current).toBe(3);
  });

  it('useActions should return actions object', () => {
    const { result } = renderHook(() => timelineComposerSelectors.useActions());
    expect(result.current).toHaveProperty('setTweetText');
    expect(result.current).toHaveProperty('addMedia');
    expect(result.current).toHaveProperty('startSending');
    expect(result.current).toHaveProperty('onSuccess');
  });
});
