import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock AddPostContext
vi.mock('../store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useTweetText: () => 'test tweet',
    useActions: () => ({}),
  })),
}));

// Mock Icon
vi.mock('../../../components/ui/home/Icon', () => ({
  default: (props: any) => (
    <button data-testid="tweet-option-grok">{props.title}</button>
  ),
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
  return { default: XMenu, onClose: vi.fn() };
});

import GrokMenu from '../components/GrokMenu';

describe('GrokMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render grok menu', () => {
    render(<GrokMenu />);
    expect(screen.getByTestId('x-menu')).toBeInTheDocument();
  });

  it('should render grok icon button', () => {
    render(<GrokMenu />);
    // The icon has title "Enhance you post with Grok"
    expect(screen.getByText('Enhance you post with Grok')).toBeInTheDocument();
  });

  it('should render x-menu wrapper', () => {
    render(<GrokMenu />);
    expect(screen.getByTestId('x-menu')).toBeInTheDocument();
  });
});
