import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

import Video from '../components/Video';

// Mock URL.createObjectURL
const mockObjectUrl = 'blob:http://localhost/mock-video-url';
global.URL.createObjectURL = vi.fn(() => mockObjectUrl);

describe('Video Component', () => {
  it('should render video element with correct testid', () => {
    const videoFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    render(<Video id="test-1" video={videoFile} />);

    expect(screen.getByTestId('video-test-1')).toBeInTheDocument();
  });

  it('should have controls attribute', () => {
    const videoFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    render(<Video id="test-2" video={videoFile} />);

    const video = screen.getByTestId('video-test-2');
    expect(video).toHaveAttribute('controls');
  });

  it('should have loop attribute', () => {
    const videoFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    render(<Video id="test-3" video={videoFile} />);

    const video = screen.getByTestId('video-test-3');
    expect(video).toHaveAttribute('loop');
  });

  it('should have preload set to none', () => {
    const videoFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    render(<Video id="test-4" video={videoFile} />);

    const video = screen.getByTestId('video-test-4');
    expect(video).toHaveAttribute('preload', 'none');
  });

  it('should have correct CSS classes', () => {
    const videoFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    render(<Video id="test-5" video={videoFile} />);

    const video = screen.getByTestId('video-test-5');
    expect(video).toHaveClass(
      'w-full',
      'h-full',
      'rounded-2xl',
      'object-contain',
      'cursor-pointer',
      'bg-black'
    );
  });

  it('should create object URL from video file', () => {
    const videoFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    render(<Video id="test-6" video={videoFile} />);

    expect(URL.createObjectURL).toHaveBeenCalledWith(videoFile);
  });

  it('should render source element with correct type', () => {
    const videoFile = new File(['test'], 'test.mp4', { type: 'video/mp4' });
    const { container } = render(<Video id="test-7" video={videoFile} />);

    const source = container.querySelector('source');
    expect(source).toBeInTheDocument();
    expect(source).toHaveAttribute('type', 'video/mp4');
  });

  it('should render source element with object URL', () => {
    const videoFile = new File(['test'], 'test.webm', { type: 'video/webm' });
    const { container } = render(<Video id="test-8" video={videoFile} />);

    const source = container.querySelector('source');
    expect(source).toHaveAttribute('src', mockObjectUrl);
  });

  it('should handle different video types', () => {
    const webmFile = new File(['test'], 'test.webm', { type: 'video/webm' });
    const { container } = render(<Video id="test-9" video={webmFile} />);

    const source = container.querySelector('source');
    expect(source).toHaveAttribute('type', 'video/webm');
  });

  it('should render with unique id', () => {
    const videoFile1 = new File(['test'], 'test1.mp4', { type: 'video/mp4' });
    const videoFile2 = new File(['test'], 'test2.mp4', { type: 'video/mp4' });

    render(
      <>
        <Video id="unique-1" video={videoFile1} />
        <Video id="unique-2" video={videoFile2} />
      </>
    );

    expect(screen.getByTestId('video-unique-1')).toBeInTheDocument();
    expect(screen.getByTestId('video-unique-2')).toBeInTheDocument();
  });
});
