import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import TypingIndicator from '../components/chatwindow/TypingIndicator';

describe('TypingIndicator', () => {
  it('should render three animated dots', () => {
    const { container } = render(<TypingIndicator />);
    const dots = container.querySelectorAll('.animate-bounce');
    expect(dots.length).toBe(3);
  });

  it('should have correct styling classes', () => {
    const { container } = render(<TypingIndicator />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex');
  });

  it('should render dots with different animation delays', () => {
    const { container } = render(<TypingIndicator />);
    const dots = container.querySelectorAll('.animate-bounce');
    expect(dots[0]).toHaveStyle({ animationDelay: '0ms' });
    expect(dots[1]).toHaveStyle({ animationDelay: '150ms' });
    expect(dots[2]).toHaveStyle({ animationDelay: '300ms' });
  });

  it('should render in gray bubble', () => {
    const { container } = render(<TypingIndicator />);
    const bubble = container.querySelector('.bg-gray-800');
    expect(bubble).toBeInTheDocument();
  });
});
