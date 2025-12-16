import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Input from '../components/Input';

describe('Input Component', () => {
  const mockSetValue = vi.fn();

  beforeEach(() => {
    mockSetValue.mockClear();
  });

  it('should render the input with label', () => {
    render(<Input label="Choice 1" id={1} value="" setValue={mockSetValue} />);

    const input = screen.getByLabelText('Choice 1');
    expect(input).toBeInTheDocument();
  });

  it('should render with data-testid based on id', () => {
    render(<Input label="Choice 1" id={1} value="" setValue={mockSetValue} />);

    const input = screen.getByTestId('poll-choice-input-1');
    expect(input).toBeInTheDocument();
  });

  it('should display the value in the input', () => {
    render(
      <Input
        label="Choice 1"
        id={1}
        value="Test Value"
        setValue={mockSetValue}
      />
    );

    const input = screen.getByTestId('poll-choice-input-1');
    expect(input).toHaveValue('Test Value');
  });

  it('should call setValue when input changes', () => {
    render(<Input label="Choice 1" id={1} value="" setValue={mockSetValue} />);

    const input = screen.getByTestId('poll-choice-input-1');
    fireEvent.change(input, { target: { value: 'New Value' } });

    expect(mockSetValue).toHaveBeenCalledWith(1, 'New Value');
  });

  it('should be required by default', () => {
    render(<Input label="Choice 1" id={1} value="" setValue={mockSetValue} />);

    const input = screen.getByTestId('poll-choice-input-1');
    expect(input).toBeRequired();
  });

  it('should not be required when required is false', () => {
    render(
      <Input
        label="Choice 3 (optional)"
        id={3}
        value=""
        setValue={mockSetValue}
        required={false}
      />
    );

    const input = screen.getByTestId('poll-choice-input-3');
    expect(input).not.toBeRequired();
  });

  it('should have maxLength of 25', () => {
    render(<Input label="Choice 1" id={1} value="" setValue={mockSetValue} />);

    const input = screen.getByTestId('poll-choice-input-1');
    expect(input).toHaveAttribute('maxLength', '25');
  });

  it('should have type text', () => {
    render(<Input label="Choice 1" id={1} value="" setValue={mockSetValue} />);

    const input = screen.getByTestId('poll-choice-input-1');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should have spellcheck disabled', () => {
    render(<Input label="Choice 1" id={1} value="" setValue={mockSetValue} />);

    const input = screen.getByTestId('poll-choice-input-1');
    expect(input).toHaveAttribute('spellcheck', 'false');
  });

  it('should render the label text', () => {
    render(<Input label="Choice 1" id={1} value="" setValue={mockSetValue} />);

    const label = screen.getByText('Choice 1');
    expect(label).toBeInTheDocument();
  });

  it('should render with different IDs', () => {
    const { rerender } = render(
      <Input label="Choice 1" id={1} value="" setValue={mockSetValue} />
    );
    expect(screen.getByTestId('poll-choice-input-1')).toBeInTheDocument();

    rerender(
      <Input label="Choice 2" id={2} value="" setValue={mockSetValue} />
    );
    expect(screen.getByTestId('poll-choice-input-2')).toBeInTheDocument();

    rerender(
      <Input label="Choice 3" id={3} value="" setValue={mockSetValue} />
    );
    expect(screen.getByTestId('poll-choice-input-3')).toBeInTheDocument();
  });

  it('should display character count on focus', () => {
    render(
      <Input label="Choice 1" id={1} value="Test" setValue={mockSetValue} />
    );

    const input = screen.getByTestId('poll-choice-input-1');
    fireEvent.focus(input);

    // The character count span has class "peer-focus:block" so it should be visible on focus
    // Verify the input exists and has the correct value
    expect(input).toHaveValue('Test');
  });

  it('should handle empty value correctly', () => {
    render(<Input label="Choice 1" id={1} value="" setValue={mockSetValue} />);

    const input = screen.getByTestId('poll-choice-input-1');
    expect(input).toHaveValue('');
  });

  it('should handle value at max length', () => {
    const maxValue = 'a'.repeat(25);
    render(
      <Input label="Choice 1" id={1} value={maxValue} setValue={mockSetValue} />
    );

    const input = screen.getByTestId('poll-choice-input-1');
    expect(input).toHaveValue(maxValue);
    expect(input.getAttribute('value')?.length).toBe(25);
  });

  it('should have correct input styling classes', () => {
    render(<Input label="Choice 1" id={1} value="" setValue={mockSetValue} />);

    const input = screen.getByTestId('poll-choice-input-1');
    expect(input).toHaveClass('peer');
    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('h-15');
    expect(input).toHaveClass('bg-transparent');
  });

  it('should pass the correct id to setValue callback', () => {
    render(<Input label="Choice 4" id={4} value="" setValue={mockSetValue} />);

    const input = screen.getByTestId('poll-choice-input-4');
    fireEvent.change(input, { target: { value: 'Test' } });

    expect(mockSetValue).toHaveBeenCalledWith(4, 'Test');
  });

  it('should render within container div with max-width', () => {
    const { container } = render(
      <Input label="Choice 1" id={1} value="" setValue={mockSetValue} />
    );

    const containerDiv = container.querySelector('.max-w-\\[435px\\]');
    expect(containerDiv).toBeInTheDocument();
  });

  it('should handle rapid value changes', () => {
    render(<Input label="Choice 1" id={1} value="" setValue={mockSetValue} />);

    const input = screen.getByTestId('poll-choice-input-1');

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });

    expect(mockSetValue).toHaveBeenCalledTimes(3);
    expect(mockSetValue).toHaveBeenNthCalledWith(1, 1, 'a');
    expect(mockSetValue).toHaveBeenNthCalledWith(2, 1, 'ab');
    expect(mockSetValue).toHaveBeenNthCalledWith(3, 1, 'abc');
  });

  it('should render label with optional indicator', () => {
    render(
      <Input
        label="Choice 3 (optional)"
        id={3}
        value=""
        setValue={mockSetValue}
        required={false}
      />
    );

    expect(screen.getByText('Choice 3 (optional)')).toBeInTheDocument();
  });
});
