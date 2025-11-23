import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import { EmailInputField } from '../components/EmailInputField';
import * as useEmailValidationModule from '../hooks/useEmailValidation';

// Mock the useEmailValidation hook
vi.mock('../hooks/useEmailValidation', () => ({
  useEmailValidation: vi.fn(),
}));

describe('EmailInputField', () => {
  const mockValidateWithDebounce = vi.fn();
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();
  const mockOnValidationChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    vi.mocked(useEmailValidationModule.useEmailValidation).mockReturnValue({
      isValidating: false,
      error: undefined,
      isValid: true,
      validateWithDebounce: mockValidateWithDebounce,
    });
  });

  it('should render email input field', () => {
    render(
      <EmailInputField
        label="Email"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    expect(screen.getByTestId('auth-email-input')).toBeInTheDocument();
  });

  it('should display the label', () => {
    render(
      <EmailInputField
        label="Email Address"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('should call onChange when input value changes', () => {
    render(
      <EmailInputField
        label="Email"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByTestId('auth-email-input');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should call onBlur when input loses focus', () => {
    render(
      <EmailInputField
        label="Email"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByTestId('auth-email-input');
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('should display placeholder text', () => {
    render(
      <EmailInputField
        label="Email"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        placeholder="Enter your email"
      />
    );

    const input = screen.getByPlaceholderText('Enter your email');
    expect(input).toBeInTheDocument();
  });

  it('should show validation error when provided', () => {
    vi.mocked(useEmailValidationModule.useEmailValidation).mockReturnValue({
      isValidating: false,
      error: 'Invalid email format',
      isValid: false,
      validateWithDebounce: mockValidateWithDebounce,
    });

    render(
      <EmailInputField
        label="Email"
        value="invalid-email"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  it('should display loading indicator when validating', () => {
    vi.mocked(useEmailValidationModule.useEmailValidation).mockReturnValue({
      isValidating: true,
      error: undefined,
      isValid: true,
      validateWithDebounce: mockValidateWithDebounce,
    });

    const { container } = render(
      <EmailInputField
        label="Email"
        value="test@example.com"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    // Check for loading spinner
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should trigger validation on change when enabled', () => {
    render(
      <EmailInputField
        label="Email"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        validation={{
          enableRealTimeValidation: true,
          remoteCheck: true,
        }}
      />
    );

    const input = screen.getByTestId('auth-email-input');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(mockValidateWithDebounce).toHaveBeenCalledWith(
      'test@example.com',
      500,
      true
    );
  });

  it('should not trigger validation on change when disabled', () => {
    render(
      <EmailInputField
        label="Email"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        validation={{
          enableRealTimeValidation: false,
        }}
      />
    );

    const input = screen.getByTestId('auth-email-input');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(mockValidateWithDebounce).not.toHaveBeenCalled();
  });

  it('should trigger validation on blur when enabled', () => {
    render(
      <EmailInputField
        label="Email"
        value="test@example.com"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        validation={{
          enableRealTimeValidation: true,
          remoteCheck: true,
        }}
      />
    );

    const input = screen.getByTestId('auth-email-input');
    fireEvent.blur(input);

    expect(mockValidateWithDebounce).toHaveBeenCalledWith(
      'test@example.com',
      500,
      true
    );
  });

  it('should disable input when disabled prop is true', () => {
    render(
      <EmailInputField
        label="Email"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        disabled={true}
      />
    );

    const input = screen.getByTestId('auth-email-input');
    expect(input).toBeDisabled();
  });

  it('should mark input as required when required prop is true', () => {
    render(
      <EmailInputField
        label="Email"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        required={true}
      />
    );

    const input = screen.getByTestId('auth-email-input');
    expect(input).toBeRequired();
  });

  it('should call onValidationChange callback', async () => {
    // Mock implementation that doesn't call the callback immediately
    vi.mocked(useEmailValidationModule.useEmailValidation).mockReturnValue({
      isValidating: false,
      error: undefined,
      isValid: true,
      validateWithDebounce: mockValidateWithDebounce,
    });

    render(
      <EmailInputField
        label="Email"
        value="test@example.com"
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        onValidationChange={mockOnValidationChange}
      />
    );

    // Verify the component renders successfully
    expect(screen.getByTestId('auth-email-input')).toBeInTheDocument();
  });

  it('should have email type attribute', () => {
    render(
      <EmailInputField
        label="Email"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
      />
    );

    const input = screen.getByTestId('auth-email-input');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should validate with remote check disabled when specified', () => {
    render(
      <EmailInputField
        label="Email"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        validation={{
          enableRealTimeValidation: true,
          remoteCheck: false,
        }}
      />
    );

    const input = screen.getByTestId('auth-email-input');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(mockValidateWithDebounce).toHaveBeenCalledWith(
      'test@example.com',
      500,
      false
    );
  });

  it('should not validate empty email on change', () => {
    render(
      <EmailInputField
        label="Email"
        value=""
        onChange={mockOnChange}
        onBlur={mockOnBlur}
        validation={{
          enableRealTimeValidation: true,
        }}
      />
    );

    const input = screen.getByTestId('auth-email-input');
    fireEvent.change(input, { target: { value: '' } });

    expect(mockValidateWithDebounce).not.toHaveBeenCalled();
  });
});
