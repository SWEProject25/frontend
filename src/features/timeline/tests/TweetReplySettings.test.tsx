import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock AddPostContext
vi.mock('../store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useSelectedReplyOption: () => 1,
    useActions: () => ({
      updateReplyOption: vi.fn(),
    }),
  })),
}));

// Mock Icon
vi.mock('../../../components/ui/home/Icon', () => ({
  default: function Icon() {
    return <div data-testid="icon">Icon</div>;
  },
}));

// Mock XMenu
vi.mock('@/components/ui/home/XMenu', () => {
  const XMenu = function XMenu({ children }: { children: React.ReactNode }) {
    return <div data-testid="x-menu">{children}</div>;
  };
  XMenu.Button = function XMenuButton({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="x-menu-button">{children}</div>;
  };
  XMenu.List = function XMenuList({ children }: { children: React.ReactNode }) {
    return <div data-testid="x-menu-list">{children}</div>;
  };
  XMenu.Items = function XMenuItems({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="x-menu-items">{children}</div>;
  };
  return { default: XMenu, onClose: vi.fn() };
});

import TweetReplySettings from '../components/TweetReplySettings';

describe('TweetReplySettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render reply settings', () => {
    render(<TweetReplySettings />);
    expect(screen.getByTestId('tweet-reply-settings')).toBeInTheDocument();
  });

  it('should show reply option text', () => {
    render(<TweetReplySettings />);
    expect(screen.getByTestId('selected-reply')).toBeInTheDocument();
  });

  it('should render button for menu', () => {
    render(<TweetReplySettings />);
    expect(
      screen.getByTestId('tweet-reply-settings-button')
    ).toBeInTheDocument();
  });
});
