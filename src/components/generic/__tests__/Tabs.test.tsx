import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from '../Tabs';

vi.mock('@/components/ui/Tab', () => ({
  default: ({
    text,
    selected,
    onClick,
    'data-testid': testId,
  }: {
    text: string;
    selected: boolean;
    onClick: () => void;
    'data-testid'?: string;
  }) => (
    <button
      onClick={onClick}
      data-testid={testId}
      className={selected ? 'selected' : ''}
    >
      {text}
    </button>
  ),
}));

describe('Tabs Component', () => {
  const mockTabs = [
    { title: 'Tab 1', value: 'tab1' },
    { title: 'Tab 2', value: 'tab2' },
    { title: 'Tab 3', value: 'tab3' },
  ];

  const mockOnClick = vi.fn();

  it('should render all tabs', () => {
    render(
      <Tabs
        tabs={mockTabs}
        selectedValue="tab1"
        onClick={mockOnClick}
        height="h-12"
      />
    );

    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('should call onClick with correct value when tab is clicked', () => {
    render(
      <Tabs
        tabs={mockTabs}
        selectedValue="tab1"
        onClick={mockOnClick}
        height="h-12"
      />
    );

    fireEvent.click(screen.getByText('Tab 2'));
    expect(mockOnClick).toHaveBeenCalledWith('tab2');
  });

  it('should mark the selected tab', () => {
    render(
      <Tabs
        tabs={mockTabs}
        selectedValue="tab2"
        onClick={mockOnClick}
        height="h-12"
      />
    );

    const tab2Button = screen.getByText('Tab 2');
    expect(tab2Button).toHaveClass('selected');
  });

  it('should apply custom height class', () => {
    const { container } = render(
      <Tabs
        tabs={mockTabs}
        selectedValue="tab1"
        onClick={mockOnClick}
        height="h-20"
      />
    );

    const tabsContainer = container.firstChild as HTMLElement;
    expect(tabsContainer).toHaveClass('h-20');
  });

  it('should have border bottom', () => {
    const { container } = render(
      <Tabs
        tabs={mockTabs}
        selectedValue="tab1"
        onClick={mockOnClick}
        height="h-12"
      />
    );

    const tabsContainer = container.firstChild as HTMLElement;
    expect(tabsContainer).toHaveClass('border-b', 'border-border');
  });

  it('should render with data-testid when provided', () => {
    render(
      <Tabs
        tabs={mockTabs}
        selectedValue="tab1"
        onClick={mockOnClick}
        height="h-12"
        data-testid="custom-tabs"
      />
    );

    expect(screen.getByTestId('custom-tabs')).toBeInTheDocument();
  });

  it('should pass data-testid to individual tabs', () => {
    render(
      <Tabs
        tabs={mockTabs}
        selectedValue="tab1"
        onClick={mockOnClick}
        height="h-12"
        data-testid="custom-tabs"
      />
    );

    expect(screen.getByTestId('custom-tabs-tab-tab1')).toBeInTheDocument();
    expect(screen.getByTestId('custom-tabs-tab-tab2')).toBeInTheDocument();
  });

  it('should support numeric selectedValue', () => {
    render(
      <Tabs
        tabs={mockTabs}
        selectedValue={1}
        onClick={mockOnClick}
        height="h-12"
      />
    );

    // None should be selected since numeric 1 doesn't match string values
    const allButtons = screen.getAllByRole('button');
    allButtons.forEach((button) => {
      expect(button).not.toHaveClass('selected');
    });
  });
});
