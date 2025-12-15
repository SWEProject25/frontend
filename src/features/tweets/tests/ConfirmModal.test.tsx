import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '@/components/ui/hoc/ConfirmModal';

describe('ConfirmModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal when isOpen is true', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Confirm Action"
        message="Are you sure?"
        confirmText="Yes"
        cancelText="No"
      />
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    render(
      <ConfirmModal
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Confirm Action"
        message="Are you sure?"
        confirmText="Yes"
        cancelText="No"
      />
    );

    expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
  });

  it('should call onConfirm when confirm button clicked', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={onConfirm}
        title="Confirm Action"
        message="Are you sure?"
        confirmText="Yes"
        cancelText="No"
      />
    );

    const confirmButton = screen.getByText('Yes');
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when cancel button clicked', () => {
    const onClose = vi.fn();
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onClose}
        onConfirm={() => {}}
        title="Confirm Action"
        message="Are you sure?"
        confirmText="Yes"
        cancelText="No"
      />
    );

    const cancelButton = screen.getByText('No');
    fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons when isLoading is true', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Confirm Action"
        message="Are you sure?"
        confirmText="Yes"
        cancelText="No"
        isLoading={true}
      />
    );

    // When loading, the confirm button shows "Processing..." instead of "Yes"
    const confirmButton = screen.getByText('Processing...');
    const cancelButton = screen.getByText('No');

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('should apply custom button class', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Confirm Action"
        message="Are you sure?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-500"
      />
    );

    const confirmButton = screen.getByText('Delete');
    expect(confirmButton).toHaveClass('bg-red-500');
  });
});
