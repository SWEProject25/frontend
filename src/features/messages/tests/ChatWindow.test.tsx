import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatWindow from '../components/ChatWindow';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock the custom hook
vi.mock('../components/chatwindow/useChatWindow', () => ({
  useChatWindow: vi.fn(),
}));

import { useChatWindow } from '../components/chatwindow/useChatWindow';
const mockUseChatWindow = vi.mocked(useChatWindow);

const defaultMockReturn = {
  message: '',
  setMessage: vi.fn(),
  loading: false,
  error: null,
  messages: [],
  conversation: undefined,
  conversationDetails: {
    name: 'John Doe',
    username: 'johndoe',
    avatar: '',
    isVerified: false,
  },
  isTyping: false,
  currentUserId: 1,
  isAuthenticated: true,
  handleSendMessage: vi.fn(),
  handleKeyPress: vi.fn(),
  handleTyping: vi.fn(),
  handleDeleteMessage: vi.fn(),
  isMyMessage: vi.fn(),
};

describe('ChatWindow', () => {
  beforeEach(() => {
    mockUseChatWindow.mockReturnValue(defaultMockReturn);
  });

  it('should show "Select a conversation" when no conversationId', () => {
    render(<ChatWindow />);
    expect(screen.getByText('Select a conversation')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseChatWindow.mockReturnValue({
      ...defaultMockReturn,
      loading: true,
    });

    render(<ChatWindow conversationId="1" />);
    expect(screen.getByText('Loading messages...')).toBeInTheDocument();
  });

  it('should show not authenticated message when user is not logged in', () => {
    mockUseChatWindow.mockReturnValue({
      ...defaultMockReturn,
      isAuthenticated: false,
      currentUserId: null,
    });

    render(<ChatWindow conversationId="1" />);
    expect(screen.getAllByText('Not Authenticated')[0]).toBeInTheDocument();
  });

  it('should render chat components when authenticated and loaded', () => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();

    mockUseChatWindow.mockReturnValue({
      ...defaultMockReturn,
      conversationDetails: {
        name: 'Jane Smith',
        username: 'janesmith',
        avatar: '',
        isVerified: true,
      },
    });

    render(<ChatWindow conversationId="1" />);
    // Use getAllByText since the name appears in both header and empty conversation state
    expect(screen.getAllByText('Jane Smith')[0]).toBeInTheDocument();
  });
});
