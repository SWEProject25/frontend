import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import TimeOptions from '../components/TimeOptions';

describe('TimeOptions Component', () => {
  const mockSetOption = vi.fn();

  beforeEach(() => {
    mockSetOption.mockClear();
  });

  it('should render the select element', () => {
    render(
      <TimeOptions id={1} type="Days" option={1} setOption={mockSetOption} />
    );

    const select = screen.getByLabelText('Days');
    expect(select).toBeInTheDocument();
  });

  it('should display the label', () => {
    render(
      <TimeOptions id={1} type="Days" option={1} setOption={mockSetOption} />
    );

    expect(screen.getByText('Days')).toBeInTheDocument();
  });

  it('should render correct options for Days (0-7)', () => {
    render(
      <TimeOptions id={1} type="Days" option={1} setOption={mockSetOption} />
    );

    const select = screen.getByLabelText('Days');
    const options = select.querySelectorAll('option');

    expect(options.length).toBe(8); // 0-7 = 8 options
    expect(options[0]).toHaveValue('0');
    expect(options[7]).toHaveValue('7');
  });

  it('should render correct options for Hours (0-23)', () => {
    render(
      <TimeOptions id={2} type="Hours" option={0} setOption={mockSetOption} />
    );

    const select = screen.getByLabelText('Hours');
    const options = select.querySelectorAll('option');

    expect(options.length).toBe(24); // 0-23 = 24 options
    expect(options[0]).toHaveValue('0');
    expect(options[23]).toHaveValue('23');
  });

  it('should render correct options for Minutes (0-59)', () => {
    render(
      <TimeOptions id={3} type="Minutes" option={0} setOption={mockSetOption} />
    );

    const select = screen.getByLabelText('Minutes');
    const options = select.querySelectorAll('option');

    expect(options.length).toBe(60); // 0-59 = 60 options
    expect(options[0]).toHaveValue('0');
    expect(options[59]).toHaveValue('59');
  });

  it('should render options starting from shiftStart for Minutes', () => {
    render(
      <TimeOptions
        id={3}
        type="Minutes"
        option={5}
        setOption={mockSetOption}
        shiftStart={5}
      />
    );

    const select = screen.getByLabelText('Minutes');
    const options = select.querySelectorAll('option');

    expect(options.length).toBe(55); // 5-59 = 55 options
    expect(options[0]).toHaveValue('5');
    expect(options[54]).toHaveValue('59');
  });

  it('should have the correct value selected', () => {
    render(
      <TimeOptions id={1} type="Days" option={3} setOption={mockSetOption} />
    );

    const select = screen.getByLabelText('Days');
    expect(select).toHaveValue('3');
  });

  it('should call setOption when selection changes', () => {
    render(
      <TimeOptions id={1} type="Days" option={1} setOption={mockSetOption} />
    );

    const select = screen.getByLabelText('Days');
    fireEvent.change(select, { target: { value: '5' } });

    expect(mockSetOption).toHaveBeenCalledWith(1, 5);
  });

  it('should pass the correct id to setOption', () => {
    render(
      <TimeOptions id={2} type="Hours" option={0} setOption={mockSetOption} />
    );

    const select = screen.getByLabelText('Hours');
    fireEvent.change(select, { target: { value: '12' } });

    expect(mockSetOption).toHaveBeenCalledWith(2, 12);
  });

  it('should have correct styling classes', () => {
    render(
      <TimeOptions id={1} type="Days" option={1} setOption={mockSetOption} />
    );

    const select = screen.getByLabelText('Days');
    expect(select).toHaveClass('appearance-none');
    expect(select).toHaveClass('peer');
    expect(select).toHaveClass('w-full');
    expect(select).toHaveClass('h-15');
    expect(select).toHaveClass('bg-transparent');
  });

  it('should not apply shiftStart for non-Minutes types', () => {
    render(
      <TimeOptions
        id={1}
        type="Days"
        option={1}
        setOption={mockSetOption}
        shiftStart={5}
      />
    );

    const select = screen.getByLabelText('Days');
    const options = select.querySelectorAll('option');

    // Days should still be 0-7, ignoring shiftStart
    expect(options.length).toBe(8);
    expect(options[0]).toHaveValue('0');
  });

  it('should not apply shiftStart for Hours', () => {
    render(
      <TimeOptions
        id={2}
        type="Hours"
        option={0}
        setOption={mockSetOption}
        shiftStart={5}
      />
    );

    const select = screen.getByLabelText('Hours');
    const options = select.querySelectorAll('option');

    // Hours should still be 0-23, ignoring shiftStart
    expect(options.length).toBe(24);
    expect(options[0]).toHaveValue('0');
  });

  it('should default shiftStart to 0', () => {
    render(
      <TimeOptions id={3} type="Minutes" option={0} setOption={mockSetOption} />
    );

    const select = screen.getByLabelText('Minutes');
    const options = select.querySelectorAll('option');

    expect(options.length).toBe(60);
    expect(options[0]).toHaveValue('0');
  });

  it('should render container with max-width', () => {
    const { container } = render(
      <TimeOptions id={1} type="Days" option={1} setOption={mockSetOption} />
    );

    const containerDiv = container.querySelector('.max-w-\\[150px\\]');
    expect(containerDiv).toBeInTheDocument();
  });

  it('should render dropdown arrow icon', () => {
    const { container } = render(
      <TimeOptions id={1} type="Days" option={1} setOption={mockSetOption} />
    );

    const svgIcon = container.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });

  it('should handle selection of edge values - 0', () => {
    render(
      <TimeOptions id={1} type="Days" option={0} setOption={mockSetOption} />
    );

    const select = screen.getByLabelText('Days');
    expect(select).toHaveValue('0');

    fireEvent.change(select, { target: { value: '0' } });
    expect(mockSetOption).toHaveBeenCalledWith(1, 0);
  });

  it('should handle selection of edge values - max Days', () => {
    render(
      <TimeOptions id={1} type="Days" option={7} setOption={mockSetOption} />
    );

    const select = screen.getByLabelText('Days');
    expect(select).toHaveValue('7');

    fireEvent.change(select, { target: { value: '7' } });
    expect(mockSetOption).toHaveBeenCalledWith(1, 7);
  });

  it('should handle selection of edge values - max Hours', () => {
    render(
      <TimeOptions id={2} type="Hours" option={23} setOption={mockSetOption} />
    );

    const select = screen.getByLabelText('Hours');
    expect(select).toHaveValue('23');

    fireEvent.change(select, { target: { value: '23' } });
    expect(mockSetOption).toHaveBeenCalledWith(2, 23);
  });

  it('should handle selection of edge values - max Minutes', () => {
    render(
      <TimeOptions
        id={3}
        type="Minutes"
        option={59}
        setOption={mockSetOption}
      />
    );

    const select = screen.getByLabelText('Minutes');
    expect(select).toHaveValue('59');

    fireEvent.change(select, { target: { value: '59' } });
    expect(mockSetOption).toHaveBeenCalledWith(3, 59);
  });

  it('should render options with correct background class', () => {
    render(
      <TimeOptions id={1} type="Days" option={1} setOption={mockSetOption} />
    );

    const select = screen.getByLabelText('Days');
    const options = select.querySelectorAll('option');

    options.forEach((option) => {
      expect(option).toHaveClass('bg-background');
    });
  });
});
