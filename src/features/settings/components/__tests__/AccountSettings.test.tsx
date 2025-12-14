import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AccountSettings from '../AccountSettings';

describe('AccountSettings', () => {
  it('should render account settings component', () => {
    render(<AccountSettings />);
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
  });

  it('should display the correct heading', () => {
    render(<AccountSettings />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Account Settings');
  });
});
