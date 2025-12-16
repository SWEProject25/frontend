import { renderHook } from '@testing-library/react';
import { useInteractions } from '../useInteractions';
import * as useFollowModule from '../useFollow';
import * as useBlockModule from '../useBlock';
import * as useMuteModule from '../useMute';
import { vi } from 'vitest';

describe('useInteractions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all expected functions and state', () => {
    // Mock the underlying hooks
    vi.spyOn(useFollowModule, 'useFollow').mockReturnValue({
      followUser: vi.fn(),
      unfollowUser: vi.fn(),
      toggleFollow: vi.fn(),
      isFollowing: true,
      isUnfollowing: false,
      isLoading: true,
      error: 'followError',
      isSuccess: false,
    } as any);
    vi.spyOn(useBlockModule, 'useBlock').mockReturnValue({
      blockUser: vi.fn(),
      unblockUser: vi.fn(),
      toggleBlock: vi.fn(),
      isBlocking: false,
      isUnblocking: true,
      isLoading: false,
      error: 'blockError',
      isSuccess: true,
    } as any);
    vi.spyOn(useMuteModule, 'useMute').mockReturnValue({
      muteUser: vi.fn(),
      unmuteUser: vi.fn(),
      toggleMute: vi.fn(),
      isMuting: false,
      isUnmuting: false,
      isLoading: false,
      error: 'muteError',
      isSuccess: true,
    } as any);

    const { result } = renderHook(() => useInteractions());
    const api = result.current;

    // Functions
    expect(typeof api.followUser).toBe('function');
    expect(typeof api.unfollowUser).toBe('function');
    expect(typeof api.toggleFollow).toBe('function');
    expect(typeof api.blockUser).toBe('function');
    expect(typeof api.unblockUser).toBe('function');
    expect(typeof api.toggleBlock).toBe('function');
    expect(typeof api.muteUser).toBe('function');
    expect(typeof api.unmuteUser).toBe('function');
    expect(typeof api.toggleMute).toBe('function');

    // Loading states
    expect(api.isFollowing).toBe(true);
    expect(api.isUnfollowing).toBe(false);
    expect(api.isBlocking).toBe(false);
    expect(api.isUnblocking).toBe(true);
    expect(api.isMuting).toBe(false);
    expect(api.isUnmuting).toBe(false);
    expect(api.isFollowLoading).toBe(true);
    expect(api.isBlockLoading).toBe(false);
    expect(api.isMuteLoading).toBe(false);
    expect(api.isAnyActionLoading).toBe(true);

    // Error states
    expect(api.followError).toBe('followError');
    expect(api.blockError).toBe('blockError');
    expect(api.muteError).toBe('muteError');

    // Success states
    expect(api.isFollowSuccess).toBe(false);
    expect(api.isBlockSuccess).toBe(true);
    expect(api.isMuteSuccess).toBe(true);
  });
});
