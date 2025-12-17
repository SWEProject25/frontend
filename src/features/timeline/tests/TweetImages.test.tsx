import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Mock toasterMessage
const mockToasterMessage = vi.fn();
vi.mock('@/components/ui/home/ToasterMessage', () => ({
  default: (message: string, position: string, type: string) =>
    mockToasterMessage(message, position, type),
}));

// Mock AddPostContext
const mockAddMedia = vi.fn();
vi.mock('../store/AddPostContext', () => ({
  useAddPostContext: vi.fn(() => ({
    useMedia: () => [],
    useActions: () => ({
      addMedia: mockAddMedia,
      removeMedia: vi.fn(),
    }),
  })),
}));

// Mock Icon
vi.mock('@/components/ui/home/Icon', () => ({
  default: (props: { title?: string; disabled?: boolean }) => (
    <div
      data-testid="icon"
      data-disabled={props.disabled}
      data-title={props.title}
    >
      {props.title}
    </div>
  ),
}));

import TweetImages from '../components/TweetImages';
import { useAddPostContext } from '../store/AddPostContext';

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

  it('should disable input when max media reached', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useMedia: () => [{}, {}, {}, {}],
      useActions: () => ({
        addMedia: mockAddMedia,
        removeMedia: vi.fn(),
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<TweetImages />);
    const input = screen.getByTestId('media-import');
    expect(input).toBeDisabled();
  });

  it('should show disabled icon when max media reached', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useMedia: () => [{}, {}, {}, {}],
      useActions: () => ({
        addMedia: mockAddMedia,
        removeMedia: vi.fn(),
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<TweetImages />);
    const icon = screen.getByTestId('icon');
    expect(icon.getAttribute('data-disabled')).toBe('true');
  });

  it('should add media when valid files are selected', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useMedia: () => [],
      useActions: () => ({
        addMedia: mockAddMedia,
        removeMedia: vi.fn(),
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<TweetImages />);
    const input = screen.getByTestId('media-import');

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(mockAddMedia).toHaveBeenCalledWith([file]);
  });

  it('should show error when invalid file type is selected', () => {
    render(<TweetImages />);
    const input = screen.getByTestId('media-import');

    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(mockToasterMessage).toHaveBeenCalled();
    expect(mockAddMedia).not.toHaveBeenCalled();
  });

  it('should show error when too many files are selected', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useMedia: () => [{}],
      useActions: () => ({
        addMedia: mockAddMedia,
        removeMedia: vi.fn(),
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<TweetImages />);
    const input = screen.getByTestId('media-import');

    const files = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
      new File(['test3'], 'test3.jpg', { type: 'image/jpeg' }),
      new File(['test4'], 'test4.jpg', { type: 'image/jpeg' }),
    ];
    fireEvent.change(input, { target: { files } });

    expect(mockToasterMessage).toHaveBeenCalled();
    expect(mockAddMedia).not.toHaveBeenCalled();
  });

  it('should show error when file is too large', () => {
    render(<TweetImages />);
    const input = screen.getByTestId('media-import');

    // Create a small file but mock its size to be too large
    const largeFile = new File(['x'], 'large.jpg', {
      type: 'image/jpeg',
    });
    Object.defineProperty(largeFile, 'size', { value: 101 * 1024 * 1024 });

    fireEvent.change(input, { target: { files: [largeFile] } });

    expect(mockToasterMessage).toHaveBeenCalled();
    expect(mockAddMedia).not.toHaveBeenCalled();
  });

  it('should handle empty file selection', () => {
    render(<TweetImages />);
    const input = screen.getByTestId('media-import');

    fireEvent.change(input, { target: { files: null } });

    expect(mockAddMedia).not.toHaveBeenCalled();
  });

  it('should reset input value after adding media', () => {
    render(<TweetImages />);
    const input = screen.getByTestId('media-import') as HTMLInputElement;

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    fireEvent.change(input, { target: { files: [file] } });

    expect(input.value).toBe('');
  });

  it('should have pointer-events-none class when max media reached', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useMedia: () => [{}, {}, {}, {}],
      useActions: () => ({
        addMedia: mockAddMedia,
        removeMedia: vi.fn(),
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<TweetImages />);
    const label = screen.getByLabelText('Add media');
    expect(label.className).toContain('pointer-events-none');
  });

  it('should have cursor-pointer class when media can be added', () => {
    vi.mocked(useAddPostContext).mockReturnValue({
      useMedia: () => [],
      useActions: () => ({
        addMedia: mockAddMedia,
        removeMedia: vi.fn(),
      }),
    } as ReturnType<typeof useAddPostContext>);

    render(<TweetImages />);
    const label = screen.getByLabelText('Add media');
    expect(label.className).toContain('cursor-pointer');
  });
});
