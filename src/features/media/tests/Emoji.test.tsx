import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Use vi.hoisted for mocks used inside vi.mock factories
const { mockSetEmoji } = vi.hoisted(() => ({
  mockSetEmoji: vi.fn(),
}));

// Mock AddPostContext
vi.mock('@/features/timeline/store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useActions: () => ({
      setEmoji: mockSetEmoji,
    }),
  })),
}));

// Mock Icon
vi.mock('@/components/ui/home/Icon', () => ({
  default: function Icon(props: { title: string; 'data-testid'?: string }) {
    return (
      <div data-testid={props['data-testid'] || 'icon'}>{props.title}</div>
    );
  },
}));

// Mock XMenu
vi.mock('@/components/ui/home/XMenu', () => {
  const XMenu = function XMenu({ children }: { children: React.ReactNode }) {
    return <div data-testid="x-menu">{children}</div>;
  };
  XMenu.Button = function XMenuButton({
    children,
    name,
    panelHeight,
  }: {
    children: React.ReactNode;
    name: string;
    panelHeight: number;
  }) {
    return (
      <div
        data-testid="x-menu-button"
        data-name={name}
        data-panel-height={panelHeight}
      >
        {children}
      </div>
    );
  };
  XMenu.List = function XMenuList({
    children,
    name,
    height,
    width,
    preventScroll,
  }: {
    children: React.ReactNode;
    name: string;
    height: string;
    width: string;
    preventScroll: boolean;
  }) {
    return (
      <div
        data-testid="x-menu-list"
        data-name={name}
        data-height={height}
        data-width={width}
        data-prevent-scroll={preventScroll}
      >
        {children}
      </div>
    );
  };
  return { default: XMenu };
});

// Mock emoji-picker-react
vi.mock('emoji-picker-react', () => ({
  default: function EmojiPicker({
    onEmojiClick,
    autoFocusSearch,
    emojiStyle,
    theme,
    searchPlaceholder,
    width,
    height,
  }: {
    onEmojiClick: (data: { emoji: string }) => void;
    autoFocusSearch: boolean;
    emojiStyle: string;
    theme: string;
    searchPlaceholder: string;
    width: number;
    height: number;
  }) {
    return (
      <div
        data-testid="emoji-picker"
        data-auto-focus={autoFocusSearch}
        data-style={emojiStyle}
        data-theme={theme}
        data-placeholder={searchPlaceholder}
        data-width={width}
        data-height={height}
      >
        <button
          data-testid="emoji-button"
          onClick={() => onEmojiClick({ emoji: '😀' })}
        >
          Pick Emoji
        </button>
      </div>
    );
  },
  EmojiStyle: {
    TWITTER: 'twitter',
  },
  Theme: {
    DARK: 'dark',
  },
}));

import Emoji from '../components/Emoji';

describe('Emoji Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render emoji component', () => {
    render(<Emoji />);
    expect(screen.getByTestId('x-menu')).toBeInTheDocument();
  });

  it('should render emoji icon button', () => {
    render(<Emoji />);
    expect(screen.getByTestId('tweet-option-emoji')).toBeInTheDocument();
    expect(screen.getByText('Emoji')).toBeInTheDocument();
  });

  it('should render x-menu button with correct panel height', () => {
    render(<Emoji />);
    const button = screen.getByTestId('x-menu-button');
    expect(button).toHaveAttribute('data-panel-height', '400');
  });

  it('should render x-menu button with EmojiMenu name', () => {
    render(<Emoji />);
    const button = screen.getByTestId('x-menu-button');
    expect(button.getAttribute('data-name')).toContain('EmojiMenu');
  });

  it('should render x-menu list with correct dimensions', () => {
    render(<Emoji />);
    const list = screen.getByTestId('x-menu-list');
    expect(list).toHaveAttribute('data-height', 'h-[400px]');
    expect(list).toHaveAttribute('data-width', 'w-[320px]');
    expect(list).toHaveAttribute('data-prevent-scroll', 'true');
  });

  it('should render emoji picker with correct props', () => {
    render(<Emoji />);
    const picker = screen.getByTestId('emoji-picker');
    expect(picker).toHaveAttribute('data-auto-focus', 'true');
    expect(picker).toHaveAttribute('data-style', 'twitter');
    expect(picker).toHaveAttribute('data-theme', 'dark');
    expect(picker).toHaveAttribute('data-placeholder', 'Search emojis');
    expect(picker).toHaveAttribute('data-width', '320');
    expect(picker).toHaveAttribute('data-height', '400');
  });

  it('should call setEmoji when emoji is picked', () => {
    render(<Emoji />);
    const emojiButton = screen.getByTestId('emoji-button');
    emojiButton.click();
    expect(mockSetEmoji).toHaveBeenCalledWith('😀');
  });

  it('should have matching menu names for button and list', () => {
    render(<Emoji />);
    const button = screen.getByTestId('x-menu-button');
    const list = screen.getByTestId('x-menu-list');
    expect(button.getAttribute('data-name')).toBe(
      list.getAttribute('data-name')
    );
  });
});
