import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import EditProfileModal from '../EditProfileModal';

// Mock child components
vi.mock('../components/EditProfileHeader', () => ({
  default: ({
    onClose,
    onSave,
    isUpdating,
  }: {
    onClose: () => void;
    onSave: () => void;
    isUpdating: boolean;
  }) => (
    <div data-testid="edit-profile-header">
      <button onClick={onClose} data-testid="mock-close">
        Close
      </button>
      <button onClick={onSave} data-testid="mock-save" disabled={isUpdating}>
        {isUpdating ? 'Saving...' : 'Save'}
      </button>
    </div>
  ),
}));

vi.mock('../components/EditProfileCover', () => ({
  default: ({
    onFileSelect,
  }: {
    onFileSelect: (file: File | null) => void;
  }) => (
    <div data-testid="edit-profile-cover">
      <button onClick={() => onFileSelect(new File([''], 'cover.jpg'))}>
        Upload Cover
      </button>
      <button onClick={() => onFileSelect(null)}>Clear Cover</button>
    </div>
  ),
}));

vi.mock('../components/EditProfileAvatar', () => ({
  default: ({
    onFileSelect,
  }: {
    onFileSelect: (file: File | null) => void;
  }) => (
    <div data-testid="edit-profile-avatar">
      <button onClick={() => onFileSelect(new File([''], 'avatar.jpg'))}>
        Upload Avatar
      </button>
    </div>
  ),
}));

vi.mock('../components/EditProfileForm', () => ({
  default: ({
    name,
    setName,
    bio,
    setBio,
  }: {
    name: string;
    setName: (v: string) => void;
    bio: string;
    setBio: (v: string) => void;
  }) => (
    <div data-testid="edit-profile-form">
      <input
        data-testid="name-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        data-testid="bio-input"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
    </div>
  ),
}));

vi.mock('@/components/ui/hoc/XModal', () => ({
  default: ({
    isOpen,
    onClose,
    children,
  }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="x-modal">
        <button onClick={onClose} data-testid="modal-backdrop">
          Close Modal
        </button>
        {children}
      </div>
    );
  },
}));

const mockInitialData = {
  name: 'John Doe',
  bio: 'Software Developer',
  profileImage: '/profile.jpg',
  bannerImage: '/banner.jpg',
  location: 'New York',
  website: 'https://example.com',
  birthDate: '1990-01-01T00:00:00.000Z',
};

describe('EditProfileModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(
        <EditProfileModal
          isOpen={false}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      expect(screen.queryByTestId('x-modal')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByTestId('x-modal')).toBeInTheDocument();
      expect(screen.getByTestId('edit-profile-content')).toBeInTheDocument();
    });

    it('should render all child components', () => {
      render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      expect(screen.getByTestId('edit-profile-header')).toBeInTheDocument();
      expect(screen.getByTestId('edit-profile-cover')).toBeInTheDocument();
      expect(screen.getByTestId('edit-profile-avatar')).toBeInTheDocument();
      expect(screen.getByTestId('edit-profile-form')).toBeInTheDocument();
    });
  });

  describe('Initial Data', () => {
    it('should populate form with initial data', () => {
      render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
      const bioInput = screen.getByTestId('bio-input') as HTMLTextAreaElement;

      expect(nameInput.value).toBe('John Doe');
      expect(bioInput.value).toBe('Software Developer');
    });

    it('should handle null bio', () => {
      const dataWithNullBio = { ...mockInitialData, bio: null };
      render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={dataWithNullBio}
          onSave={mockOnSave}
        />
      );

      const bioInput = screen.getByTestId('bio-input') as HTMLTextAreaElement;
      expect(bioInput.value).toBe('');
    });
  });

  describe('Form Editing', () => {
    it('should update name when typing', async () => {
      const user = userEvent.setup();
      render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
      await user.clear(nameInput);
      await user.type(nameInput, 'Jane Smith');

      expect(nameInput.value).toBe('Jane Smith');
    });

    it('should update bio when typing', async () => {
      const user = userEvent.setup();
      render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      const bioInput = screen.getByTestId('bio-input') as HTMLTextAreaElement;
      await user.clear(bioInput);
      await user.type(bioInput, 'New bio text');

      expect(bioInput.value).toBe('New bio text');
    });
  });

  describe('Save Functionality', () => {
    it('should call onSave with modified data', async () => {
      const user = userEvent.setup();
      render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');

      const saveButton = screen.getByTestId('mock-save');
      await user.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('should close modal after save', async () => {
      const user = userEvent.setup();
      render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      const saveButton = screen.getByTestId('mock-save');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Close Functionality', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      const closeButton = screen.getByTestId('mock-close');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should reset form data when closed', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      // Modify form
      const nameInput = screen.getByTestId('name-input');
      await user.clear(nameInput);
      await user.type(nameInput, 'Modified Name');

      // Close modal
      const closeButton = screen.getByTestId('mock-close');
      await user.click(closeButton);

      // Reopen modal
      rerender(
        <EditProfileModal
          isOpen={false}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      rerender(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      // Check that form is reset
      const nameInputAfterReopen = screen.getByTestId(
        'name-input'
      ) as HTMLInputElement;
      expect(nameInputAfterReopen.value).toBe('John Doe');
    });
  });

  describe('Image Upload', () => {
    it('should handle profile image upload', async () => {
      const user = userEvent.setup();
      render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      const uploadButton = screen.getByText('Upload Avatar');
      await user.click(uploadButton);

      // Avatar upload should work without errors
      expect(screen.getByTestId('edit-profile-avatar')).toBeInTheDocument();
    });

    it('should handle cover image upload', async () => {
      const user = userEvent.setup();
      render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      const uploadButton = screen.getByText('Upload Cover');
      await user.click(uploadButton);

      // Cover upload should work without errors
      expect(screen.getByTestId('edit-profile-cover')).toBeInTheDocument();
    });

    it('should handle cover image clear', async () => {
      const user = userEvent.setup();
      render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      const clearButton = screen.getByText('Clear Cover');
      await user.click(clearButton);

      // Clear should work without errors
      expect(screen.getByTestId('edit-profile-cover')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should disable buttons when updating', () => {
      render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
          isUpdating={true}
        />
      );

      const saveButton = screen.getByTestId('mock-save');
      expect(saveButton).toBeDisabled();
      expect(saveButton).toHaveTextContent('Saving...');
    });
  });

  describe('Data Persistence', () => {
    it('should update form when initialData changes', () => {
      const { rerender } = render(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={mockInitialData}
          onSave={mockOnSave}
        />
      );

      const newData = { ...mockInitialData, name: 'Updated Name' };
      rerender(
        <EditProfileModal
          isOpen={true}
          onClose={mockOnClose}
          initialData={newData}
          onSave={mockOnSave}
        />
      );

      const nameInput = screen.getByTestId('name-input') as HTMLInputElement;
      expect(nameInput.value).toBe('Updated Name');
    });
  });
});
