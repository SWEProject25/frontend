import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GenericDropdown, { DropdownItemType } from '../Dropdown';

// Mock @heroui/react components
vi.mock('@heroui/react', () => ({
  Dropdown: ({ children, onOpenChange }: any) => (
    <div
      data-testid="dropdown"
      onClick={() => onOpenChange && onOpenChange(true)}
    >
      {children}
    </div>
  ),
  DropdownTrigger: ({ children }: any) => (
    <div data-testid="dropdown-trigger">{children}</div>
  ),
  DropdownMenu: ({ children, 'data-testid': testId }: any) => (
    <div data-testid={testId}>{children}</div>
  ),
  DropdownItem: ({ children, onClick, 'data-testid': testId }: any) => (
    <button onClick={onClick} data-testid={testId}>
      {children}
    </button>
  ),
}));

describe('GenericDropdown Component', () => {
  const mockOnOpened = vi.fn();
  const mockItemClick = vi.fn();

  const mockItems: DropdownItemType[] = [
    {
      key: 'edit',
      label: 'Edit',
      onClick: mockItemClick,
    },
    {
      key: 'delete',
      label: 'Delete',
      color: 'danger',
      onClick: mockItemClick,
    },
    {
      key: 'share',
      label: 'Share',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render trigger children', () => {
    render(
      <GenericDropdown items={mockItems} onOpened={mockOnOpened}>
        <button>Open Menu</button>
      </GenericDropdown>
    );

    expect(screen.getByText('Open Menu')).toBeInTheDocument();
  });

  it('should render all dropdown items', () => {
    render(
      <GenericDropdown items={mockItems} onOpened={mockOnOpened}>
        <button>Open Menu</button>
      </GenericDropdown>
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('should call item onClick when item is clicked', () => {
    render(
      <GenericDropdown items={mockItems} onOpened={mockOnOpened}>
        <button>Open Menu</button>
      </GenericDropdown>
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(mockItemClick).toHaveBeenCalled();
  });

  it('should use custom testId when provided', () => {
    render(
      <GenericDropdown
        items={mockItems}
        onOpened={mockOnOpened}
        testId="custom-dropdown"
      >
        <button>Open Menu</button>
      </GenericDropdown>
    );

    expect(screen.getByTestId('custom-dropdown-menu')).toBeInTheDocument();
  });

  it('should use default testId when not provided', () => {
    render(
      <GenericDropdown items={mockItems} onOpened={mockOnOpened}>
        <button>Open Menu</button>
      </GenericDropdown>
    );

    expect(screen.getAllByTestId('dropdown').length).toBeGreaterThan(0);
  });

  it('should render item test ids correctly', () => {
    render(
      <GenericDropdown
        items={mockItems}
        onOpened={mockOnOpened}
        testId="test-dropdown"
      >
        <button>Open Menu</button>
      </GenericDropdown>
    );

    expect(screen.getByTestId('test-dropdown-item-edit')).toBeInTheDocument();
    expect(screen.getByTestId('test-dropdown-item-delete')).toBeInTheDocument();
    expect(screen.getByTestId('test-dropdown-item-share')).toBeInTheDocument();
  });

  it('should handle items without onClick', () => {
    render(
      <GenericDropdown items={mockItems} onOpened={mockOnOpened}>
        <button>Open Menu</button>
      </GenericDropdown>
    );

    // Should not throw when clicking item without onClick
    expect(() => {
      fireEvent.click(screen.getByText('Share'));
    }).not.toThrow();
  });

  it('should apply custom menuClassName', () => {
    render(
      <GenericDropdown
        items={mockItems}
        onOpened={mockOnOpened}
        menuClassName="custom-menu-class"
      >
        <button>Open Menu</button>
      </GenericDropdown>
    );

    expect(screen.getByTestId('dropdown-menu')).toBeInTheDocument();
  });

  it('should apply custom triggerClassName', () => {
    const { container } = render(
      <GenericDropdown
        items={mockItems}
        onOpened={mockOnOpened}
        triggerClassName="custom-trigger-class"
      >
        <button>Open Menu</button>
      </GenericDropdown>
    );

    const spanElement = container.querySelector('span.custom-trigger-class');
    expect(spanElement).toBeDefined();
    expect(spanElement).not.toBeNull();
  });
});
