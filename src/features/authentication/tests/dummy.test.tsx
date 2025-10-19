import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';

// Simple component for testing
function TestComponent() {
  return <div>Hello, World!</div>;
}

describe('render test', () => {
  it('should render component', () => {
    render(<TestComponent />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('should pass basic test', () => {
    expect(true).toBe(true);
  });
});
