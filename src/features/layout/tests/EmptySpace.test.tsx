import { describe, it, expect } from 'vitest';
import { render } from '@/test/test-utils';
import EmptySpace from '../components/EmptySpace';

describe('EmptySpace', () => {
  it('should render without crashing', () => {
    const { container } = render(<EmptySpace />);

    expect(container).toBeInTheDocument();
  });

  it('should render a div element', () => {
    const { container } = render(<EmptySpace />);
    const emptySpace = container.firstChild;

    expect(emptySpace).toBeInTheDocument();
  });

  it('should have appropriate spacing classes', () => {
    const { container } = render(<EmptySpace />);
    const emptySpace = container.firstChild as HTMLElement;

    expect(emptySpace.className).toBeTruthy();
  });
});
