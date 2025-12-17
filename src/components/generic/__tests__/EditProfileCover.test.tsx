import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EditProfileCover from '../components/EditProfileCover';

vi.mock('../Cover', () => ({
  default: ({
    coverImage,
    className,
    children,
    'data-testid': testId,
  }: any) => (
    <div
      data-testid={testId}
      data-cover-image={coverImage || 'none'}
      data-classname={className}
    >
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/UploadImage', () => ({
  default: ({
    onFileSelect,
    showClearButton,
    onClear,
    'data-testid': testId,
  }: {
    onFileSelect: (file: File | null) => void;
    showClearButton: boolean;
    onClear: () => void;
    'data-testid': string;
  }) => (
    <div>
      <button
        data-testid={testId}
        onClick={() => {
          const file = new File(['test'], 'cover.jpg', { type: 'image/jpeg' });
          onFileSelect(file);
        }}
      >
        Upload Cover
      </button>
      {showClearButton && (
        <button data-testid={`${testId}-clear`} onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  ),
}));

describe('EditProfileCover Component', () => {
  const mockOnFileSelect = vi.fn();
  const mockOnClear = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render cover with default props', () => {
    render(
      <EditProfileCover
        onFileSelect={mockOnFileSelect}
        showClearButton={false}
        onClear={mockOnClear}
      />
    );

    const cover = screen.getByTestId('edit-profile-cover');
    expect(cover).toBeInTheDocument();
    expect(cover).toHaveAttribute('data-cover-image', 'none');
  });

  it('should render cover with provided image', () => {
    const coverUrl = 'https://example.com/cover.jpg';
    render(
      <EditProfileCover
        coverImage={coverUrl}
        onFileSelect={mockOnFileSelect}
        showClearButton={false}
        onClear={mockOnClear}
      />
    );

    const cover = screen.getByTestId('edit-profile-cover');
    expect(cover).toHaveAttribute('data-cover-image', coverUrl);
  });

  it('should render with correct className', () => {
    render(
      <EditProfileCover
        onFileSelect={mockOnFileSelect}
        showClearButton={false}
        onClear={mockOnClear}
      />
    );

    const cover = screen.getByTestId('edit-profile-cover');
    expect(cover).toHaveAttribute('data-classname', 'mt-4');
  });

  it('should render upload image button', () => {
    render(
      <EditProfileCover
        onFileSelect={mockOnFileSelect}
        showClearButton={false}
        onClear={mockOnClear}
      />
    );

    const uploadButton = screen.getByTestId('edit-profile-cover-upload');
    expect(uploadButton).toBeInTheDocument();
  });

  it('should call onFileSelect when file is selected', () => {
    render(
      <EditProfileCover
        onFileSelect={mockOnFileSelect}
        showClearButton={false}
        onClear={mockOnClear}
      />
    );

    const uploadButton = screen.getByTestId('edit-profile-cover-upload');
    fireEvent.click(uploadButton);

    expect(mockOnFileSelect).toHaveBeenCalled();
    const callArgs = mockOnFileSelect.mock.calls[0][0];
    expect(callArgs).toBeInstanceOf(File);
    expect(callArgs.name).toBe('cover.jpg');
  });

  it('should not show clear button when showClearButton is false', () => {
    render(
      <EditProfileCover
        coverImage="https://example.com/cover.jpg"
        onFileSelect={mockOnFileSelect}
        showClearButton={false}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.queryByTestId('edit-profile-cover-upload-clear');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should show clear button when showClearButton is true', () => {
    render(
      <EditProfileCover
        coverImage="https://example.com/cover.jpg"
        onFileSelect={mockOnFileSelect}
        showClearButton={true}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByTestId('edit-profile-cover-upload-clear');
    expect(clearButton).toBeInTheDocument();
  });

  it('should call onClear when clear button is clicked', () => {
    render(
      <EditProfileCover
        coverImage="https://example.com/cover.jpg"
        onFileSelect={mockOnFileSelect}
        showClearButton={true}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByTestId('edit-profile-cover-upload-clear');
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalled();
  });

  it('should render upload button inside centered div', () => {
    const { container } = render(
      <EditProfileCover
        onFileSelect={mockOnFileSelect}
        showClearButton={false}
        onClear={mockOnClear}
      />
    );

    const centeredDiv = container.querySelector(
      '.absolute.top-1\\/2.left-1\\/2.transform.-translate-x-1\\/2.-translate-y-1\\/2'
    );
    expect(centeredDiv).toBeInTheDocument();
  });
});
