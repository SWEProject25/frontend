import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useConversationsList } from '../components/conversationlist/useConversationsList';
import { useMessageStore } from '../store/useMessageStore';
import { useAuthStore } from '../../authentication/store/authStore';
import * as messagesApi from '../api/messages';

// Mock the modules
vi.mock('../store/useMessageStore');
vi.mock('../../authentication/store/authStore');
vi.mock('../api/messages');

describe('useConversationsList', () => {
  const mockOnSelectConversation = vi.fn();
  const mockSetConversations = vi.fn();
  const mockAddMessage = vi.fn();
  const mockUpdateConversationUnseenCount = vi.fn();

  const mockConversations = [
    {
      id: 1,
      conversationId: 1,
      user1Id: 1,
      user2Id: 2,
      createdAt: '2025-12-15T10:00:00Z',
      name: 'John Doe',
      username: 'johndoe',
      lastMessage: {
        id: 1,
        text: 'Hello',
        senderId: 2,
        conversationId: 1,
        isSeen: false,
        createdAt: '2025-12-15T10:00:00Z',
      },
      unseenCount: 3,
    },
    {
      id: 2,
      conversationId: 2,
      user1Id: 1,
      user2Id: 3,
      createdAt: '2025-12-15T09:00:00Z',
      name: 'Jane Smith',
      username: 'janesmith',
      lastMessage: {
        id: 2,
        text: 'Hi',
        senderId: 3,
        conversationId: 2,
        isSeen: true,
        createdAt: '2025-12-15T09:00:00Z',
      },
      unseenCount: 0,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useMessageStore
    (useMessageStore as any).mockImplementation((selector: any) => {
      const state = {
        conversations: mockConversations,
        typingUsers: {},
        unseenCounts: { 1: 3, 2: 0 },
        setConversations: mockSetConversations,
        addMessage: mockAddMessage,
        updateConversationUnseenCount: mockUpdateConversationUnseenCount,
      };
      return selector(state);
    });

    // Mock useAuthStore
    (useAuthStore as any).mockImplementation((selector: any) => {
      const state = {
        user: { id: 1, username: 'testuser' },
      };
      return selector(state);
    });

    // Mock API calls
    vi.mocked(messagesApi.fetchConversations).mockResolvedValue(
      mockConversations
    );
    vi.mocked(messagesApi.createConversation).mockResolvedValue({
      data: { id: 3, conversationId: 3 },
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.showNewConvoModal).toBe(false);
    expect(result.current.newUserId).toBe('');
    expect(result.current.creatingConvo).toBe(false);
  });

  it('should return conversations from store', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    expect(result.current.conversations).toEqual(mockConversations);
  });

  it('should calculate unseenConversationsCount correctly', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    expect(result.current.unseenConversationsCount).toBe(1);
  });

  it('should toggle new conversation modal', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    act(() => {
      result.current.setShowNewConvoModal(true);
    });

    expect(result.current.showNewConvoModal).toBe(true);

    act(() => {
      result.current.setShowNewConvoModal(false);
    });

    expect(result.current.showNewConvoModal).toBe(false);
  });

  it('should update newUserId', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    act(() => {
      result.current.setNewUserId('123');
    });

    expect(result.current.newUserId).toBe('123');
  });

  it('should format timestamp correctly for recent messages', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    const now = new Date();
    const recentTime = new Date(now.getTime() - 30000).toISOString(); // 30 seconds ago

    const display = result.current.getConversationDisplay({
      ...mockConversations[0],
      lastMessage: {
        ...mockConversations[0].lastMessage!,
        createdAt: recentTime,
      },
    });

    expect(display.timestamp).toContain(':'); // Should show time
  });

  it('should format timestamp as "Yesterday" for yesterday messages', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(10, 0, 0);

    const display = result.current.getConversationDisplay({
      ...mockConversations[0],
      lastMessage: {
        ...mockConversations[0].lastMessage!,
        createdAt: yesterday.toISOString(),
      },
    });

    expect(display.timestamp).toBe('Yesterday');
  });

  it('should show typing indicator when user is typing', () => {
    (useMessageStore as any).mockImplementation((selector: any) => {
      const state = {
        conversations: mockConversations,
        typingUsers: { 1: [2] },
        unseenCounts: { 1: 3, 2: 0 },
        setConversations: mockSetConversations,
        addMessage: mockAddMessage,
        updateConversationUnseenCount: mockUpdateConversationUnseenCount,
      };
      return selector(state);
    });

    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    const display = result.current.getConversationDisplay(mockConversations[0]);

    expect(display.isTyping).toBe(true);
    expect(display.lastMessageText).toBe('typing...');
  });

  it('should show "You:" prefix for own messages', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    const display = result.current.getConversationDisplay({
      ...mockConversations[0],
      lastMessage: {
        ...mockConversations[0].lastMessage!,
        senderId: 1, // Current user
      },
    });

    expect(display.lastMessageText).toContain('You:');
  });

  it('should handle conversation without last message', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    const display = result.current.getConversationDisplay({
      ...mockConversations[0],
      lastMessage: undefined,
    });

    expect(display.lastMessageText).toBe('No messages yet');
  });

  it('should get unseen count from store', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    const display = result.current.getConversationDisplay(mockConversations[0]);

    expect(display.unseenCount).toBe(3);
  });

  it('should handle create conversation with valid user id', async () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    act(() => {
      result.current.setNewUserId('123');
    });

    await act(async () => {
      await result.current.handleCreateConversation();
    });

    await waitFor(() => {
      expect(messagesApi.createConversation).toHaveBeenCalledWith(123);
      expect(mockOnSelectConversation).toHaveBeenCalledWith('3');
    });
  });

  it('should not create conversation with empty user id', async () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    await act(async () => {
      await result.current.handleCreateConversation();
    });

    expect(messagesApi.createConversation).not.toHaveBeenCalled();
  });

  it('should not create conversation with invalid user id', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    act(() => {
      result.current.setNewUserId('invalid');
    });

    await act(async () => {
      await result.current.handleCreateConversation();
    });

    expect(messagesApi.createConversation).not.toHaveBeenCalled();
    alertMock.mockRestore();
  });

  it('should handle create conversation error', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.mocked(messagesApi.createConversation).mockRejectedValue(
      new Error('Failed to create')
    );

    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    act(() => {
      result.current.setNewUserId('123');
    });

    await act(async () => {
      await result.current.handleCreateConversation();
    });

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalled();
    });

    alertMock.mockRestore();
  });

  it('should set creatingConvo state during conversation creation', async () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    act(() => {
      result.current.setNewUserId('123');
    });

    vi.mocked(messagesApi.createConversation).mockResolvedValue({
      data: { id: 3, conversationId: 3 },
    });

    await act(async () => {
      await result.current.handleCreateConversation();
    });

    await waitFor(() => {
      expect(result.current.creatingConvo).toBe(false);
    });
  });

  it('should close modal and reset form after successful creation', async () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    act(() => {
      result.current.setShowNewConvoModal(true);
      result.current.setNewUserId('123');
    });

    await act(async () => {
      await result.current.handleCreateConversation();
    });

    await waitFor(() => {
      expect(result.current.showNewConvoModal).toBe(false);
      expect(result.current.newUserId).toBe('');
    });
  });

  it('should get display properties for verified user', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    const display = result.current.getConversationDisplay({
      ...mockConversations[0],
      verified: true,
    });

    expect(display.isVerified).toBe(true);
  });

  it('should handle conversation with user object', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    const display = result.current.getConversationDisplay({
      id: 1,
      conversationId: 1,
      user: {
        id: 2,
        displayName: 'Test User',
        username: 'testuser',
        profile_image_url: 'https://example.com/avatar.jpg',
        verified: true,
      },
      lastMessage: {
        text: 'Test message',
        createdAt: new Date().toISOString(),
      },
    });

    expect(display.displayName).toBe('Test User');
    expect(display.displayUsername).toBe('testuser');
    expect(display.displayAvatar).toBe('https://example.com/avatar.jpg');
    expect(display.isVerified).toBe(true);
  });

  it('should handle conversation with participants array', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    const display = result.current.getConversationDisplay({
      id: 1,
      conversationId: 1,
      user: undefined,
      participants: [
        {
          id: 2,
          name: 'Participant Name',
          username: 'participant',
          avatar: 'https://example.com/participant.jpg',
        },
      ],
      lastMessage: {
        text: 'Test message',
        createdAt: new Date().toISOString(),
      },
    });

    expect(display.displayName).toBe('Participant Name');
    expect(display.displayUsername).toBe('participant');
  });

  it('should fallback to "Unknown" for missing user data', () => {
    const { result } = renderHook(() =>
      useConversationsList(mockOnSelectConversation)
    );

    const display = result.current.getConversationDisplay({
      id: 999,
      conversationId: 999,
      user1Id: 1,
      user2Id: 2,
      createdAt: '2025-12-15T10:00:00Z',
    });

    expect(display.displayName).toBe('Unknown');
    expect(display.displayUsername).toBe('unknown');
  });
});
