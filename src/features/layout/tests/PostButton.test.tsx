import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import PostButton from '../components/PostButton';

vi.mock('@/features/timeline/components/ComposeModal', () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="compose-modal" onClick={onClose}>
        Compose Modal
      </div>
    ) : null,
}));

describe('PostButton', () => {
  it('should render a button element', () => {
    render(<PostButton />);
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
  });

  it('should have correct base styling', () => {
    render(<PostButton />);
    const button = screen.getByRole('button');

    expect(button).toHaveClass(
      'bg-white',
      'text-black',
      'font-bold',
      'rounded-full',
      'transition-colors'
    );
  });

  it('should render Plus icon', () => {
    const { container } = render(<PostButton />);
    const icon = container.querySelector('svg');

    expect(icon).toBeInTheDocument();
  });

  it('should render "Post" text', () => {
    render(<PostButton />);

    expect(screen.getByText('Post')).toBeInTheDocument();
  });

  it('should open compose modal when clicked', () => {
    render(<PostButton />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(screen.getByTestId('compose-modal')).toBeInTheDocument();
  });

  it('should close compose modal', () => {
    render(<PostButton />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(screen.getByTestId('compose-modal')).toBeInTheDocument();

    const modal = screen.getByTestId('compose-modal');
    fireEvent.click(modal);

    expect(screen.queryByTestId('compose-modal')).not.toBeInTheDocument();
  });

  it('should not render modal initially', () => {
    render(<PostButton />);

    expect(screen.queryByTestId('compose-modal')).not.toBeInTheDocument();
  });

  it('should have data-testid attribute', () => {
    render(<PostButton />);

    expect(screen.getByTestId('sidebar-post-button')).toBeInTheDocument();
  });
});
// describe('PostButton', () => {
//   it('should render a button element', () => {
//     render(<PostButton />);
//     const button = screen.getByRole('button');

//     expect(button).toBeInTheDocument();
//   });

//   it('should have correct base styling', () => {
//     render(<PostButton />);
//     const button = screen.getByRole('button');

//     expect(button).toHaveClass(
//       'bg-white',
//       'hover:bg-gray-200',
//       'text-black',
//       'font-bold',
//       'rounded-full',
//       'transition-colors'
//     );
//   });

//   it('should have responsive size classes', () => {
//     render(<PostButton />);
//     const button = screen.getByRole('button');

//     expect(button).toHaveClass(
//       'w-14',
//       'h-14',
//       'xl:w-full',
//       'xl:h-auto',
//       'xl:py-3'
//     );
//   });

//   it('should render Plus icon', () => {
//     const { container } = render(<PostButton />);
//     const icon = container.querySelector('svg');

//     expect(icon).toBeInTheDocument();
//     expect(icon).toHaveClass('w-6', 'h-6', 'xl:hidden');
//   });

//   it('should render "Post" text', () => {
//     render(<PostButton />);
//     const text = screen.getByText('Post');

//     expect(text).toBeInTheDocument();
//     expect(text).toHaveClass('hidden', 'xl:inline', 'text-lg');
//   });

//   it('should have flex layout for content centering', () => {
//     render(<PostButton />);
//     const button = screen.getByRole('button');

//     expect(button).toHaveClass('flex', 'items-center', 'justify-center');
//   });

//   it('should have margin top spacing', () => {
//     render(<PostButton />);
//     const button = screen.getByRole('button');

//     expect(button).toHaveClass('mt-4');
//   });

//   it('should be clickable', () => {
//     render(<PostButton />);
//     const button = screen.getByRole('button');

//     expect(button).not.toBeDisabled();
//   });
// });
