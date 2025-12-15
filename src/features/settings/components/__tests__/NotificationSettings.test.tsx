import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotificationSettings from '../NotificationSettings';

describe('NotificationSettings', () => {
  it('should render notification settings component', () => {
    render(<NotificationSettings />);
    expect(screen.getByText('Notification Settings')).toBeInTheDocument();
  });

  it('should display the correct heading', () => {
    render(<NotificationSettings />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Notification Settings');
  });
});
