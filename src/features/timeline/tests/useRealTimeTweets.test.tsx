import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock the socket
const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  connected: true,
};

let shouldThrowSocketError = false;

// Mock socket service
vi.mock('@/features/messages/services/socket', () => ({
  getSocket: () => {
    if (shouldThrowSocketError) {
      throw new Error('Socket not initialized');
    }
    return mockSocket;
  },
}));

// Mock optimistic hooks
const mockRealTimeOnMutate = vi.fn();

vi.mock('../optimistics/RealTimeTweet', () => ({
  useRealTimeTweet: vi.fn(() => ({
    onMutate: mockRealTimeOnMutate,
  })),
}));

// Import after mocks
import { useRealTimeTweets } from '../hooks/useRealTimeTweets';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  const Wrapper = function Wrapper({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
  return Wrapper;
};

describe('useRealTimeTweets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSocket.on.mockReset();
    mockSocket.off.mockReset();
    mockSocket.emit.mockReset();
    mockSocket.connected = true;
    shouldThrowSocketError = false;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return joinPost, leavePost, and usePostUpdates', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useRealTimeTweets(), { wrapper });

    expect(result.current.joinPost).toBeDefined();
    expect(result.current.leavePost).toBeDefined();
    expect(result.current.usePostUpdates).toBeDefined();
  });

  describe('joinPost', () => {
    it('should emit join post event when socket is connected', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRealTimeTweets(), { wrapper });

      act(() => {
        result.current.joinPost(123);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith(
        'joinPost',
        123,
        expect.any(Function)
      );
    });

    it('should call callback on success response', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRealTimeTweets(), { wrapper });
      const callback = vi.fn();

      mockSocket.emit.mockImplementation((event, postId, cb) => {
        cb({ status: 'success' });
      });

      act(() => {
        result.current.joinPost(123, callback);
      });

      expect(callback).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should warn when join post fails', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRealTimeTweets(), { wrapper });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation();

      mockSocket.emit.mockImplementation((event, postId, cb) => {
        cb({ status: 'error' });
      });

      act(() => {
        result.current.joinPost(123);
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith('failed to join post', {
        status: 'error',
      });
      consoleWarnSpy.mockRestore();
    });

    it('should not emit when socket is disconnected', () => {
      mockSocket.connected = false;
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRealTimeTweets(), { wrapper });

      act(() => {
        result.current.joinPost(123);
      });

      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it('should handle socket error gracefully', () => {
      shouldThrowSocketError = true;
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRealTimeTweets(), { wrapper });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation();

      act(() => {
        result.current.joinPost(123);
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Socket not initialized, cannot join post:',
        123
      );
      consoleWarnSpy.mockRestore();
    });
  });

  describe('leavePost', () => {
    it('should emit leave post event when socket is connected', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRealTimeTweets(), { wrapper });

      act(() => {
        result.current.leavePost(123);
      });

      expect(mockSocket.emit).toHaveBeenCalledWith(
        'leavePost',
        123,
        expect.any(Function)
      );
    });

    it('should call callback on success response', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRealTimeTweets(), { wrapper });
      const callback = vi.fn();

      mockSocket.emit.mockImplementation((event, postId, cb) => {
        cb({ status: 'success' });
      });

      act(() => {
        result.current.leavePost(123, callback);
      });

      expect(callback).toHaveBeenCalledWith({ status: 'success' });
    });

    it('should warn when leave post fails', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRealTimeTweets(), { wrapper });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation();

      mockSocket.emit.mockImplementation((event, postId, cb) => {
        cb({ status: 'error' });
      });

      act(() => {
        result.current.leavePost(123);
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith('failed to leave post', {
        status: 'error',
      });
      consoleWarnSpy.mockRestore();
    });

    it('should not emit when socket is disconnected', () => {
      mockSocket.connected = false;
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRealTimeTweets(), { wrapper });

      act(() => {
        result.current.leavePost(123);
      });

      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it('should handle socket error gracefully', () => {
      shouldThrowSocketError = true;
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRealTimeTweets(), { wrapper });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation();

      act(() => {
        result.current.leavePost(123);
      });

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Socket not initialized, cannot leave post:',
        123
      );
      consoleWarnSpy.mockRestore();
    });
  });

  describe('usePostUpdates', () => {
    it('should be a function', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useRealTimeTweets(), { wrapper });

      expect(typeof result.current.usePostUpdates).toBe('function');
    });

    it('should setup socket listeners for post updates', () => {
      const wrapper = createWrapper();

      const TestComponent = () => {
        const { usePostUpdates } = useRealTimeTweets();
        usePostUpdates(123, 456, 'Post', -1);
        return null;
      };

      render(<TestComponent />, { wrapper });

      // Should register multiple socket listeners (like, comment, repost)
      expect(mockSocket.on).toHaveBeenCalled();
    });

    it('should not setup listeners when postId is null', () => {
      const wrapper = createWrapper();

      const TestComponent = () => {
        const { usePostUpdates } = useRealTimeTweets();
        usePostUpdates(null, 456, 'Post', -1);
        return null;
      };

      render(<TestComponent />, { wrapper });

      // Should not register socket listeners for null postId
      expect(mockSocket.on).not.toHaveBeenCalled();
    });

    it('should cleanup listeners on unmount', () => {
      const wrapper = createWrapper();

      const TestComponent = () => {
        const { usePostUpdates } = useRealTimeTweets();
        usePostUpdates(123, 456, 'Post', -1);
        return null;
      };

      const { unmount } = render(<TestComponent />, { wrapper });
      unmount();

      expect(mockSocket.off).toHaveBeenCalled();
    });
  });
});

describe('useRealTimeTweets socket event handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSocket.on.mockReset();
    mockSocket.off.mockReset();
    mockSocket.emit.mockReset();
    mockSocket.connected = true;
    shouldThrowSocketError = false;
  });

  it('should handle like update event with matching postId', () => {
    const wrapper = createWrapper();
    let likeHandler:
      | ((data: { postId: number; count: number }) => void)
      | undefined;

    mockSocket.on.mockImplementation(
      (
        event: string,
        handler: (data: { postId: number; count: number }) => void
      ) => {
        if (event === 'likeUpdate') {
          likeHandler = handler;
        }
      }
    );

    const TestComponent = () => {
      const { usePostUpdates } = useRealTimeTweets();
      usePostUpdates(123, 456, 'Post', -1);
      return null;
    };

    render(<TestComponent />, { wrapper });

    if (likeHandler) {
      act(() => {
        likeHandler!({ postId: 123, count: 10 });
      });

      expect(mockRealTimeOnMutate).toHaveBeenCalledWith(
        'like',
        123,
        456,
        10,
        'Post',
        -1
      );
    }
  });

  it('should handle comment update event with matching postId', () => {
    const wrapper = createWrapper();
    let commentHandler:
      | ((data: { postId: number; count: number }) => void)
      | undefined;

    mockSocket.on.mockImplementation(
      (
        event: string,
        handler: (data: { postId: number; count: number }) => void
      ) => {
        if (event === 'commentUpdate') {
          commentHandler = handler;
        }
      }
    );

    const TestComponent = () => {
      const { usePostUpdates } = useRealTimeTweets();
      usePostUpdates(123, 456, 'Post', -1);
      return null;
    };

    render(<TestComponent />, { wrapper });

    if (commentHandler) {
      act(() => {
        commentHandler!({ postId: 123, count: 5 });
      });

      expect(mockRealTimeOnMutate).toHaveBeenCalledWith(
        'reply',
        123,
        456,
        5,
        'Post',
        -1
      );
    }
  });

  it('should handle repost update event with matching postId', () => {
    const wrapper = createWrapper();
    let repostHandler:
      | ((data: { postId: number; count: number }) => void)
      | undefined;

    mockSocket.on.mockImplementation(
      (
        event: string,
        handler: (data: { postId: number; count: number }) => void
      ) => {
        if (event === 'repostUpdate') {
          repostHandler = handler;
        }
      }
    );

    const TestComponent = () => {
      const { usePostUpdates } = useRealTimeTweets();
      usePostUpdates(123, 456, 'Post', -1);
      return null;
    };

    render(<TestComponent />, { wrapper });

    if (repostHandler) {
      act(() => {
        repostHandler!({ postId: 123, count: 3 });
      });

      expect(mockRealTimeOnMutate).toHaveBeenCalledWith(
        'repost',
        123,
        456,
        3,
        'Post',
        -1
      );
    }
  });

  it('should not call onMutate for different postId on like', () => {
    const wrapper = createWrapper();
    let likeHandler:
      | ((data: { postId: number; count: number }) => void)
      | undefined;

    mockSocket.on.mockImplementation(
      (
        event: string,
        handler: (data: { postId: number; count: number }) => void
      ) => {
        if (event === 'likeUpdate') {
          likeHandler = handler;
        }
      }
    );

    const TestComponent = () => {
      const { usePostUpdates } = useRealTimeTweets();
      usePostUpdates(123, 456, 'Post', -1);
      return null;
    };

    render(<TestComponent />, { wrapper });

    if (likeHandler) {
      act(() => {
        likeHandler!({ postId: 999, count: 10 });
      });

      expect(mockRealTimeOnMutate).not.toHaveBeenCalled();
    }
  });

  it('should not call onMutate for different postId on comment', () => {
    const wrapper = createWrapper();
    let commentHandler:
      | ((data: { postId: number; count: number }) => void)
      | undefined;

    mockSocket.on.mockImplementation(
      (
        event: string,
        handler: (data: { postId: number; count: number }) => void
      ) => {
        if (event === 'commentUpdate') {
          commentHandler = handler;
        }
      }
    );

    const TestComponent = () => {
      const { usePostUpdates } = useRealTimeTweets();
      usePostUpdates(123, 456, 'Post', -1);
      return null;
    };

    render(<TestComponent />, { wrapper });

    if (commentHandler) {
      act(() => {
        commentHandler!({ postId: 999, count: 5 });
      });

      expect(mockRealTimeOnMutate).not.toHaveBeenCalled();
    }
  });

  it('should not call onMutate for different postId on repost', () => {
    const wrapper = createWrapper();
    let repostHandler:
      | ((data: { postId: number; count: number }) => void)
      | undefined;

    mockSocket.on.mockImplementation(
      (
        event: string,
        handler: (data: { postId: number; count: number }) => void
      ) => {
        if (event === 'repostUpdate') {
          repostHandler = handler;
        }
      }
    );

    const TestComponent = () => {
      const { usePostUpdates } = useRealTimeTweets();
      usePostUpdates(123, 456, 'Post', -1);
      return null;
    };

    render(<TestComponent />, { wrapper });

    if (repostHandler) {
      act(() => {
        repostHandler!({ postId: 999, count: 3 });
      });

      expect(mockRealTimeOnMutate).not.toHaveBeenCalled();
    }
  });

  it('should handle socket disconnected for listeners', () => {
    mockSocket.connected = false;
    const wrapper = createWrapper();
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation();

    const TestComponent = () => {
      const { usePostUpdates } = useRealTimeTweets();
      usePostUpdates(123, 456, 'Post', -1);
      return null;
    };

    render(<TestComponent />, { wrapper });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Socket not connected, cannot listen to post like:',
      123
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Socket not connected, cannot listen to post Reply:',
      123
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Socket not connected, cannot listen to post repost:',
      123
    );
    consoleWarnSpy.mockRestore();
  });

  it('should handle socket error for listeners', () => {
    shouldThrowSocketError = true;
    const wrapper = createWrapper();
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation();

    const TestComponent = () => {
      const { usePostUpdates } = useRealTimeTweets();
      usePostUpdates(123, 456, 'Post', -1);
      return null;
    };

    render(<TestComponent />, { wrapper });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Socket not initialized, cannot listen to post like:',
      123
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Socket not initialized, cannot listen to post reply:',
      123
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Socket not initialized, cannot listen to post repost:',
      123
    );
    consoleWarnSpy.mockRestore();
  });

  it('should use default type value', () => {
    const wrapper = createWrapper();

    const TestComponent = () => {
      const { usePostUpdates } = useRealTimeTweets();
      usePostUpdates(123, 456);
      return null;
    };

    render(<TestComponent />, { wrapper });
    expect(mockSocket.on).toHaveBeenCalled();
  });
});
