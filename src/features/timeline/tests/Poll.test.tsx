import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Poll from '../components/Poll';
import usePollStore from '../store/usePollStore';

// Mock Input component
vi.mock('./Input', () => ({
  default: ({
    label,
    id,
    value,
    setValue,
    required,
  }: {
    label: string;
    id: number;
    value: string;
    setValue: (id: number, value: string) => void;
    required?: boolean;
  }) => (
    <input
      data-testid={`poll-choice-input-${id}`}
      value={value}
      onChange={(e) => setValue(id, e.target.value)}
      placeholder={label}
      required={required}
    />
  ),
}));

// Mock TimeOptions component
vi.mock('./TimeOptions', () => ({
  default: ({
    type,
    option,
    setOption,
  }: {
    id: number;
    type: string;
    option: number;
    setOption: (id: number, value: number) => void;
  }) => (
    <select
      data-testid={`time-option-${type}`}
      value={option}
      onChange={(e) => setOption(0, Number(e.target.value))}
    >
      <option value={option}>{option}</option>
    </select>
  ),
}));

describe('Poll Component', () => {
  beforeEach(() => {
    // Reset the store before each test
    usePollStore.setState({
      choices: ['', '', '', ''],
      time: [1, 0, 0],
      shiftStartMinutes: 0,
      isOpen: false,
      buttonInputIndex: 2,
    });
  });

  it('should not render when isOpen is false', () => {
    usePollStore.setState({ isOpen: false });

    render(<Poll />);

    expect(screen.queryByTestId('poll-container')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    usePollStore.setState({ isOpen: true });

    render(<Poll />);

    expect(screen.getByTestId('poll-container')).toBeInTheDocument();
  });

  it('should render initial two choice inputs', () => {
    usePollStore.setState({ isOpen: true, buttonInputIndex: 2 });

    render(<Poll />);

    expect(screen.getByTestId('poll-choice-input-1')).toBeInTheDocument();
    expect(screen.getByTestId('poll-choice-input-2')).toBeInTheDocument();
    expect(screen.queryByTestId('poll-choice-input-3')).not.toBeInTheDocument();
    expect(screen.queryByTestId('poll-choice-input-4')).not.toBeInTheDocument();
  });

  it('should render three choice inputs when buttonInputIndex is 3', () => {
    usePollStore.setState({ isOpen: true, buttonInputIndex: 3 });

    render(<Poll />);

    expect(screen.getByTestId('poll-choice-input-1')).toBeInTheDocument();
    expect(screen.getByTestId('poll-choice-input-2')).toBeInTheDocument();
    expect(screen.getByTestId('poll-choice-input-3')).toBeInTheDocument();
    expect(screen.queryByTestId('poll-choice-input-4')).not.toBeInTheDocument();
  });

  it('should render all four choice inputs when buttonInputIndex is 4', () => {
    usePollStore.setState({ isOpen: true, buttonInputIndex: 4 });

    render(<Poll />);

    expect(screen.getByTestId('poll-choice-input-1')).toBeInTheDocument();
    expect(screen.getByTestId('poll-choice-input-2')).toBeInTheDocument();
    expect(screen.getByTestId('poll-choice-input-3')).toBeInTheDocument();
    expect(screen.getByTestId('poll-choice-input-4')).toBeInTheDocument();
  });

  it('should render add choice button for current buttonInputIndex', () => {
    usePollStore.setState({ isOpen: true, buttonInputIndex: 2 });

    render(<Poll />);

    expect(screen.getByTestId('poll-add-choice-3')).toBeInTheDocument();
  });

  it('should not render add choice button when buttonInputIndex is 4', () => {
    usePollStore.setState({ isOpen: true, buttonInputIndex: 4 });

    render(<Poll />);

    expect(screen.queryByTestId('poll-add-choice-5')).not.toBeInTheDocument();
  });

  it('should increment buttonInputIndex when add choice button is clicked', () => {
    usePollStore.setState({ isOpen: true, buttonInputIndex: 2 });

    render(<Poll />);

    const addButton = screen.getByTestId('poll-add-choice-3');
    fireEvent.click(addButton);

    expect(usePollStore.getState().buttonInputIndex).toBe(3);
  });

  it('should render time options', () => {
    usePollStore.setState({ isOpen: true });

    render(<Poll />);

    expect(screen.getByTestId('poll-time-options')).toBeInTheDocument();
    expect(screen.getByLabelText('Days')).toBeInTheDocument();
    expect(screen.getByLabelText('Hours')).toBeInTheDocument();
    expect(screen.getByLabelText('Minutes')).toBeInTheDocument();
  });

  it('should render poll length section', () => {
    usePollStore.setState({ isOpen: true });

    render(<Poll />);

    expect(screen.getByText('Poll length')).toBeInTheDocument();
  });

  it('should render remove poll button', () => {
    usePollStore.setState({ isOpen: true });

    render(<Poll />);

    expect(screen.getByTestId('poll-remove-button')).toBeInTheDocument();
    expect(screen.getByTestId('poll-remove-button')).toHaveTextContent(
      'Remove poll'
    );
  });

  it('should close poll when remove button is clicked', () => {
    usePollStore.setState({ isOpen: true });

    render(<Poll />);

    const removeButton = screen.getByTestId('poll-remove-button');
    fireEvent.click(removeButton);

    expect(usePollStore.getState().isOpen).toBe(false);
  });

  it('should have correct container styling', () => {
    usePollStore.setState({ isOpen: true });

    render(<Poll />);

    const container = screen.getByTestId('poll-container');
    expect(container).toHaveClass('w-[513px]');
    expect(container).toHaveClass('rounded-lg');
    expect(container).toHaveClass('bg-background');
    expect(container).toHaveClass('border');
    expect(container).toHaveClass('border-border');
  });

  it('should display choice values from store', () => {
    usePollStore.setState({
      isOpen: true,
      buttonInputIndex: 2,
      choices: ['Option A', 'Option B', '', ''],
    });

    render(<Poll />);

    expect(screen.getByTestId('poll-choice-input-1')).toHaveValue('Option A');
    expect(screen.getByTestId('poll-choice-input-2')).toHaveValue('Option B');
  });

  it('should update choice when input changes', () => {
    usePollStore.setState({ isOpen: true, buttonInputIndex: 2 });

    render(<Poll />);

    const input = screen.getByTestId('poll-choice-input-1');
    fireEvent.change(input, { target: { value: 'New Choice' } });

    expect(usePollStore.getState().choices[0]).toBe('New Choice');
  });

  it('should display time values from store', () => {
    usePollStore.setState({
      isOpen: true,
      time: [3, 12, 30],
    });

    render(<Poll />);

    expect(screen.getByLabelText('Days')).toHaveValue('3');
    expect(screen.getByLabelText('Hours')).toHaveValue('12');
    expect(screen.getByLabelText('Minutes')).toHaveValue('30');
  });

  it('should update time when time option changes', () => {
    usePollStore.setState({ isOpen: true, time: [1, 0, 0] });

    render(<Poll />);

    const daysSelect = screen.getByLabelText('Days');
    fireEvent.change(daysSelect, { target: { value: '5' } });

    expect(usePollStore.getState().time[0]).toBe(5);
  });

  it('should remove button have correct error styling', () => {
    usePollStore.setState({ isOpen: true });

    render(<Poll />);

    const removeButton = screen.getByTestId('poll-remove-button');
    expect(removeButton).toHaveClass('text-error');
    expect(removeButton).toHaveClass('border-t');
    expect(removeButton).toHaveClass('border-border');
  });
});
