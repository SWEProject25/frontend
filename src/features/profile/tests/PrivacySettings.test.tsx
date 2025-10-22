import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PrivacySettings from '../components/PrivacySettings';

describe('PrivacySettings', () => {
  it('should render privacy settings component', () => {
    render(<PrivacySettings />);
    expect(screen.getByText('Privacy and Safety')).toBeInTheDocument();
  });

  it('should display the correct heading', () => {
    render(<PrivacySettings />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Privacy and Safety');
  });
});
