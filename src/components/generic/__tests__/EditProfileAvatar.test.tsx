import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import EditProfileAvatar from '../components/EditProfileAvatar';

vi.mock('../Avatar', () => ({
  default: ({
    avatarImage,
    className,
    position,
    customPosition,
    children,
    'data-testid': testId,
  }: any) => (
    <div
      data-testid={testId}
      data-avatar-image={avatarImage || 'null'}
      data-classname={className}
      data-position={position}
      data-custom-position={customPosition}
    >
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/UploadImage', () => ({
  default: ({
    onFileSelect,
    'data-testid': testId,
  }: {
    onFileSelect: (file: File | null) => void;
    'data-testid': string;
  }) => (
    <button
      data-testid={testId}
      onClick={() => {
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        onFileSelect(file);
      }}
    >
      Upload Image
    </button>
  ),
}));

describe('EditProfileAvatar Component', () => {
  const mockOnFileSelect = vi.fn();

  it('should render avatar with default props', () => {
    render(<EditProfileAvatar onFileSelect={mockOnFileSelect} />);

    const avatar = screen.getByTestId('edit-profile-avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('data-avatar-image', 'null');
  });

  it('should render avatar with provided image', () => {
    const avatarUrl = 'https://example.com/avatar.jpg';
    render(
      <EditProfileAvatar
        avatarImage={avatarUrl}
        onFileSelect={mockOnFileSelect}
      />
    );

    const avatar = screen.getByTestId('edit-profile-avatar');
    expect(avatar).toHaveAttribute('data-avatar-image', avatarUrl);
  });

  it('should render with correct avatar position', () => {
    render(<EditProfileAvatar onFileSelect={mockOnFileSelect} />);

    const avatar = screen.getByTestId('edit-profile-avatar');
    expect(avatar).toHaveAttribute('data-position', 'absolute');
    expect(avatar).toHaveAttribute('data-custom-position', 'true');
  });

  it('should render with correct avatar className', () => {
    render(<EditProfileAvatar onFileSelect={mockOnFileSelect} />);

    const avatar = screen.getByTestId('edit-profile-avatar');
    expect(avatar).toHaveAttribute(
      'data-classname',
      '-top-[66px] left-3 border-2'
    );
  });

  it('should render upload image button', () => {
    render(<EditProfileAvatar onFileSelect={mockOnFileSelect} />);

    const uploadButton = screen.getByTestId('edit-profile-avatar-upload');
    expect(uploadButton).toBeInTheDocument();
  });

  it('should call onFileSelect when file is selected', () => {
    render(<EditProfileAvatar onFileSelect={mockOnFileSelect} />);

    const uploadButton = screen.getByTestId('edit-profile-avatar-upload');
    uploadButton.click();

    expect(mockOnFileSelect).toHaveBeenCalled();
    const callArgs = mockOnFileSelect.mock.calls[0][0];
    expect(callArgs).toBeInstanceOf(File);
    expect(callArgs.name).toBe('test.jpg');
  });

  it('should render upload button inside centered div', () => {
    const { container } = render(
      <EditProfileAvatar onFileSelect={mockOnFileSelect} />
    );

    const centeredDiv = container.querySelector(
      '.absolute.top-1\\/2.left-1\\/2.transform.-translate-x-1\\/2.-translate-y-1\\/2'
    );
    expect(centeredDiv).toBeInTheDocument();
  });
});
