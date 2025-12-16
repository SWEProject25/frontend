import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock AddPostContext
vi.mock('../store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useMedia: () => [],
    useActions: () => ({
      addMedia: vi.fn(),
      removeMedia: vi.fn(),
    }),
  })),
}));

// Mock Icon
vi.mock('@/components/ui/home/Icon', () => ({
  default: (props: any) => <div data-testid="icon">{props.title}</div>,
}));

// Mock toasterMessage
vi.mock('@/components/ui/home/ToasterMessage', () => ({
  default: vi.fn(),
}));

import TweetImages from '../components/TweetImages';

describe('TweetImages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render media import input', () => {
    render(<TweetImages />);
    expect(screen.getByTestId('media-import')).toBeInTheDocument();
  });

  it('should render icon for media', () => {
    render(<TweetImages />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should have file input with multiple attribute', () => {
    render(<TweetImages />);
    const input = screen.getByTestId('media-import');
    expect(input).toHaveAttribute('multiple');
  });

  it('should have file input with correct type', () => {
    render(<TweetImages />);
    const input = screen.getByTestId('media-import');
    expect(input).toHaveAttribute('type', 'file');
  });
});
