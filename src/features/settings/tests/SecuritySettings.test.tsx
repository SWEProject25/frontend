import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SecuritySettings from '../components/SecuritySettings';

describe('SecuritySettings', () => {
  it('should render security settings component', () => {
    render(<SecuritySettings />);
    expect(screen.getByText('Security and Account Access')).toBeInTheDocument();
  });

  it('should display the correct heading', () => {
    render(<SecuritySettings />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Security and Account Access');
  });
});
