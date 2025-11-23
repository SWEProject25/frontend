import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { LoadingSpinner } from '../components/AuthLoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render the loading message', () => {
    render(<LoadingSpinner message="Loading..." />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render the title when provided', () => {
    render(<LoadingSpinner title="Please wait" message="Loading..." />);

    expect(screen.getByText('Please wait')).toBeInTheDocument();
  });

  it('should not render title when not provided', () => {
    render(<LoadingSpinner message="Loading..." />);

    expect(screen.queryByText('Please wait')).not.toBeInTheDocument();
  });

  it('should render the subtitle when provided', () => {
    render(<LoadingSpinner message="Loading..." subtitle="test@example.com" />);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should not render subtitle when not provided', () => {
    const { container } = render(<LoadingSpinner message="Loading..." />);

    // Check that subtitle container doesn't exist
    const subtitleContainer = container.querySelector('.font-medium');
    expect(subtitleContainer).not.toBeInTheDocument();
  });

  it('should render all elements when all props provided', () => {
    render(
      <LoadingSpinner
        title="Verification"
        message="Please wait..."
        subtitle="user@example.com"
      />
    );

    expect(screen.getByText('Verification')).toBeInTheDocument();
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(
      <LoadingSpinner message="Loading..." className="custom-class" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should have a spinner element', () => {
    const { container } = render(<LoadingSpinner message="Loading..." />);

    // Check for spinner element by its classes
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render spinner with correct styling classes', () => {
    const { container } = render(<LoadingSpinner message="Loading..." />);

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toHaveClass('rounded-full');
    expect(spinner).toHaveClass('h-8');
    expect(spinner).toHaveClass('w-8');
    expect(spinner).toHaveClass('border-b-2');
    expect(spinner).toHaveClass('border-primary');
  });

  it('should have correct layout structure', () => {
    const { container } = render(
      <LoadingSpinner title="Title" message="Message" subtitle="Subtitle" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('space-y-6');
  });
});
