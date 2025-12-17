import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import DateOfBirthModal from './DateOfBirthModal';
import { useUpdateDateOfBirth } from '../hooks/useOnboarding';

// Mock the useUpdateDateOfBirth hook
vi.mock('../hooks/useOnboarding', () => ({
  useUpdateDateOfBirth: vi.fn(),
}));

// Mock the XModal component
vi.mock('@/components/ui/hoc/XModal', () => ({
  default: ({
    children,
    isOpen,
  }: {
    children: React.ReactNode;
    isOpen: boolean;
  }) => (isOpen ? <div data-testid="x-modal">{children}</div> : null),
}));

// Mock the DatePicker component
vi.mock('@/components/ui/DatePicker', () => ({
  DatePicker: ({
    value,
    onChange,
  }: {
    value: any;
    onChange: (value: any) => void;
  }) => (
    <div data-testid="date-picker">
      <input
        data-testid="month-input"
        placeholder="Month"
        onChange={(e) =>
          onChange({
            ...value,
            month: e.target.value,
          })
        }
      />
      <input
        data-testid="day-input"
        placeholder="Day"
        onChange={(e) =>
          onChange({
            ...value,
            day: e.target.value,
          })
        }
      />
      <input
        data-testid="year-input"
        placeholder="Year"
        onChange={(e) =>
          onChange({
            ...value,
            year: e.target.value,
          })
        }
      />
    </div>
  ),
}));

// Mock the AuthButton component
vi.mock('@/components/ui/AuthButton', () => ({
  AuthButton: ({
    children,
    onClick,
    disabled,
    loading,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    loading: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="submit-button"
      data-loading={loading}
    >
      {children}
    </button>
  ),
}));

// Mock the datePickerValueToISOString utility
vi.mock('@/utils', () => ({
  datePickerValueToISOString: vi.fn((value) => {
    if (value?.month && value?.day && value?.year) {
      return `${value.year}-${value.month.padStart(2, '0')}-${value.day.padStart(2, '0')}`;
    }
    return null;
  }),
}));

describe('DateOfBirthModal', () => {
  const mockMutateAsync = vi.fn();
  const mockOnClose = vi.fn();
  const mockOnComplete = vi.fn();

  const defaultMockUpdateDateOfBirth = {
    mutateAsync: mockMutateAsync,
    isPending: false,
    isError: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useUpdateDateOfBirth as any).mockReturnValue(defaultMockUpdateDateOfBirth);
  });

  describe('Rendering', () => {
    it('should render the modal when isOpen is true', () => {
      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByTestId('x-modal')).toBeInTheDocument();
      expect(screen.getByText("What's your birth date?")).toBeInTheDocument();
      expect(screen.getByText("This won't be public.")).toBeInTheDocument();
    });

    it('should not render the modal when isOpen is false', () => {
      render(
        <DateOfBirthModal
          isOpen={false}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.queryByTestId('x-modal')).not.toBeInTheDocument();
    });

    it('should render the date picker', () => {
      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    });

    it('should render the submit button', () => {
      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should disable submit button when no date is selected', () => {
      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when only month is selected', async () => {
      const user = userEvent.setup();
      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const monthInput = screen.getByTestId('month-input');
      await user.type(monthInput, '05');

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when only month and day are selected', async () => {
      const user = userEvent.setup();
      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const monthInput = screen.getByTestId('month-input');
      const dayInput = screen.getByTestId('day-input');

      await user.type(monthInput, '05');
      await user.type(dayInput, '15');

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when all date fields are filled', async () => {
      const user = userEvent.setup();
      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const monthInput = screen.getByTestId('month-input');
      const dayInput = screen.getByTestId('day-input');
      const yearInput = screen.getByTestId('year-input');

      await user.type(monthInput, '05');
      await user.type(dayInput, '15');
      await user.type(yearInput, '1990');

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).not.toBeDisabled();
    });

    it('should disable submit button during submission', () => {
      (useUpdateDateOfBirth as any).mockReturnValue({
        ...defaultMockUpdateDateOfBirth,
        isPending: true,
      });

      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Form Submission', () => {
    it('should call mutateAsync with correct date format on submit', async () => {
      const user = userEvent.setup();
      mockMutateAsync.mockResolvedValueOnce({});

      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const monthInput = screen.getByTestId('month-input');
      const dayInput = screen.getByTestId('day-input');
      const yearInput = screen.getByTestId('year-input');

      await user.type(monthInput, '05');
      await user.type(dayInput, '15');
      await user.type(yearInput, '1990');

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          dateOfBirth: '1990-05-15',
        });
      });
    });

    it('should call onComplete after successful submission', async () => {
      const user = userEvent.setup();
      mockMutateAsync.mockResolvedValueOnce({});

      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const monthInput = screen.getByTestId('month-input');
      const dayInput = screen.getByTestId('day-input');
      const yearInput = screen.getByTestId('year-input');

      await user.type(monthInput, '12');
      await user.type(dayInput, '25');
      await user.type(yearInput, '1995');

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      });
    });

    it('should not submit when date is incomplete', async () => {
      const user = userEvent.setup();

      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const monthInput = screen.getByTestId('month-input');
      await user.type(monthInput, '05');

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeDisabled();
      await user.click(submitButton);

      expect(mockMutateAsync).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message on submission failure', () => {
      (useUpdateDateOfBirth as any).mockReturnValue({
        ...defaultMockUpdateDateOfBirth,
        isError: true,
        error: { message: 'Failed to update date of birth' },
      });

      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(
        screen.getByText('Failed to update date of birth')
      ).toBeInTheDocument();
    });

    it('should display generic error message when error message is not provided', () => {
      (useUpdateDateOfBirth as any).mockReturnValue({
        ...defaultMockUpdateDateOfBirth,
        isError: true,
        error: {},
      });

      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      expect(
        screen.getByText('Failed to update date of birth')
      ).toBeInTheDocument();
    });

    it('should handle submission error and not call onComplete', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockMutateAsync.mockRejectedValueOnce(new Error('Network error'));

      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const monthInput = screen.getByTestId('month-input');
      const dayInput = screen.getByTestId('day-input');
      const yearInput = screen.getByTestId('year-input');

      await user.type(monthInput, '05');
      await user.type(dayInput, '15');
      await user.type(yearInput, '1990');

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to update date of birth:',
          expect.any(Error)
        );
      });

      expect(mockOnComplete).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('User Interactions', () => {
    it('should update date state when user types in date fields', async () => {
      const user = userEvent.setup();
      mockMutateAsync.mockResolvedValueOnce({});

      render(
        <DateOfBirthModal
          isOpen={true}
          onClose={mockOnClose}
          onComplete={mockOnComplete}
        />
      );

      const monthInput = screen.getByTestId('month-input');
      const dayInput = screen.getByTestId('day-input');
      const yearInput = screen.getByTestId('year-input');

      await user.type(monthInput, '03');
      await user.type(dayInput, '20');
      await user.type(yearInput, '2000');

      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).not.toBeDisabled();

      await user.click(submitButton);

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          dateOfBirth: '2000-03-20',
        });
      });
    });
  });
});
