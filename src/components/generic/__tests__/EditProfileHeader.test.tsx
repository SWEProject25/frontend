import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import EditProfileHeader from '../components/EditProfileHeader';

describe('EditProfileHeader', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render header container', () => {
    render(
      <EditProfileHeader
        onClose={mockOnClose}
        onSave={mockOnSave}
        isUpdating={false}
      />
    );

    const header = screen.getByTestId('edit-profile-header');
    expect(header).toBeInTheDocument();
  });

  it('should display "Edit profile" title', () => {
    render(
      <EditProfileHeader
        onClose={mockOnClose}
        onSave={mockOnSave}
        isUpdating={false}
      />
    );

    expect(screen.getByText('Edit profile')).toBeInTheDocument();
  });

  describe('Close Button', () => {
    it('should render close button', () => {
      render(
        <EditProfileHeader
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={false}
        />
      );

      const closeButton = screen.getByTestId('edit-profile-close-button');
      expect(closeButton).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <EditProfileHeader
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={false}
        />
      );

      const closeButton = screen.getByTestId('edit-profile-close-button');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should disable close button when updating', () => {
      render(
        <EditProfileHeader
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={true}
        />
      );

      const closeButton = screen.getByTestId('edit-profile-close-button');
      expect(closeButton).toBeDisabled();
    });

    it('should have aria-label for accessibility', () => {
      render(
        <EditProfileHeader
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={false}
        />
      );

      const closeButton = screen.getByTestId('edit-profile-close-button');
      expect(closeButton).toHaveAttribute('aria-label', 'Close modal');
    });
  });

  describe('Save Button', () => {
    it('should render save button', () => {
      render(
        <EditProfileHeader
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={false}
        />
      );

      const saveButton = screen.getByTestId('edit-profile-save-button');
      expect(saveButton).toBeInTheDocument();
    });

    it('should display "Save" text when not updating', () => {
      render(
        <EditProfileHeader
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={false}
        />
      );

      const saveButton = screen.getByTestId('edit-profile-save-button');
      expect(saveButton).toHaveTextContent('Save');
    });

    it('should display "Saving..." text when updating', () => {
      render(
        <EditProfileHeader
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={true}
        />
      );

      const saveButton = screen.getByTestId('edit-profile-save-button');
      expect(saveButton).toHaveTextContent('Saving...');
    });

    it('should call onSave when save button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <EditProfileHeader
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={false}
        />
      );

      const saveButton = screen.getByTestId('edit-profile-save-button');
      await user.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it('should disable save button when updating', () => {
      render(
        <EditProfileHeader
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={true}
        />
      );

      const saveButton = screen.getByTestId('edit-profile-save-button');
      expect(saveButton).toBeDisabled();
    });

    it('should not call onSave when disabled', async () => {
      const user = userEvent.setup();
      render(
        <EditProfileHeader
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={true}
        />
      );

      const saveButton = screen.getByTestId('edit-profile-save-button');
      await user.click(saveButton);

      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('should have sticky header with backdrop blur', () => {
      render(
        <EditProfileHeader
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={false}
        />
      );

      const header = screen.getByTestId('edit-profile-header');
      expect(header).toHaveClass(
        'sticky',
        'top-0',
        'z-40',
        'backdrop-blur-sm',
        'bg-black/80'
      );
    });
  });
});
