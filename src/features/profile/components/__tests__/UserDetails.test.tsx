import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import UserDetails from '../UserDetails';

// Mock the date formatting utility
vi.mock('@/utils', () => ({
  formatDate: (date: string, format: string) => {
    if (format === 'month-year') {
      return 'January 2020';
    }
    return date;
  },
}));

describe('UserDetails', () => {
  const defaultProps = {
    joinDate: '2020-01-15T00:00:00.000Z',
    location: 'New York, USA',
    website: 'https://example.com',
  };

  it('should render user details container', () => {
    render(<UserDetails {...defaultProps} />);

    const container = screen.getByTestId('profile-user-details');
    expect(container).toBeInTheDocument();
  });

  describe('Location', () => {
    it('should render location when provided', () => {
      render(<UserDetails {...defaultProps} />);

      const location = screen.getByTestId('profile-location');
      expect(location).toBeInTheDocument();
      expect(location).toHaveTextContent('New York, USA');
    });

    it('should not render location when null', () => {
      render(<UserDetails {...defaultProps} location={null} />);

      const location = screen.queryByTestId('profile-location');
      expect(location).not.toBeInTheDocument();
    });

    it('should not render location when empty string', () => {
      render(<UserDetails {...defaultProps} location="" />);

      const location = screen.queryByTestId('profile-location');
      expect(location).not.toBeInTheDocument();
    });

    it('should render location icon', () => {
      render(<UserDetails {...defaultProps} />);

      const location = screen.getByTestId('profile-location');
      const icon = location.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Website', () => {
    it('should render website link when provided', () => {
      render(<UserDetails {...defaultProps} />);

      const websiteContainer = screen.getByTestId('profile-website');
      const websiteLink = screen.getByTestId('profile-website-link');

      expect(websiteContainer).toBeInTheDocument();
      expect(websiteLink).toBeInTheDocument();
      expect(websiteLink).toHaveTextContent('https://example.com');
    });

    it('should not render website when null', () => {
      render(<UserDetails {...defaultProps} website={null} />);

      const website = screen.queryByTestId('profile-website');
      expect(website).not.toBeInTheDocument();
    });

    it('should not render website when empty string', () => {
      render(<UserDetails {...defaultProps} website="" />);

      const website = screen.queryByTestId('profile-website');
      expect(website).not.toBeInTheDocument();
    });

    it('should add https:// protocol to website without protocol', () => {
      render(<UserDetails {...defaultProps} website="example.com" />);

      const websiteLink = screen.getByTestId(
        'profile-website-link'
      ) as HTMLAnchorElement;
      expect(websiteLink.href).toBe('https://example.com/');
    });

    it('should preserve https protocol', () => {
      render(<UserDetails {...defaultProps} website="https://mysite.com" />);

      const websiteLink = screen.getByTestId(
        'profile-website-link'
      ) as HTMLAnchorElement;
      expect(websiteLink.href).toBe('https://mysite.com/');
    });

    it('should preserve http protocol', () => {
      render(<UserDetails {...defaultProps} website="http://mysite.com" />);

      const websiteLink = screen.getByTestId(
        'profile-website-link'
      ) as HTMLAnchorElement;
      expect(websiteLink.href).toBe('http://mysite.com/');
    });

    it('should open website in new tab', () => {
      render(<UserDetails {...defaultProps} />);

      const websiteLink = screen.getByTestId('profile-website-link');
      expect(websiteLink).toHaveAttribute('target', '_blank');
      expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should have primary color and hover effect', () => {
      render(<UserDetails {...defaultProps} />);

      const websiteLink = screen.getByTestId('profile-website-link');
      expect(websiteLink).toHaveClass('text-primary', 'hover:underline');
    });

    it('should handle website with whitespace', () => {
      render(
        <UserDetails {...defaultProps} website="  https://example.com  " />
      );

      const websiteLink = screen.getByTestId(
        'profile-website-link'
      ) as HTMLAnchorElement;
      expect(websiteLink.href).toBe('https://example.com/');
    });
  });

  describe('Join Date', () => {
    it('should always render join date', () => {
      render(<UserDetails {...defaultProps} />);

      const joinDate = screen.getByTestId('profile-join-date');
      expect(joinDate).toBeInTheDocument();
    });

    it('should format join date correctly', () => {
      render(<UserDetails {...defaultProps} />);

      const joinDate = screen.getByTestId('profile-join-date');
      expect(joinDate).toHaveTextContent('Joined January 2020');
    });

    it('should render join date icon', () => {
      render(<UserDetails {...defaultProps} />);
      const joinDate = screen.getByTestId('profile-join-date');
      const icon = joinDate.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct container classes', () => {
      render(<UserDetails {...defaultProps} />);

      const container = screen.getByTestId('profile-user-details');
      expect(container).toHaveClass(
        'flex',
        'flex-row',
        'items-center',
        'gap-2',
        'sm:gap-3',
        'flex-wrap'
      );
    });

    it('should render all details when all props provided', () => {
      render(<UserDetails {...defaultProps} />);

      expect(screen.getByTestId('profile-location')).toBeInTheDocument();
      expect(screen.getByTestId('profile-website')).toBeInTheDocument();
      expect(screen.getByTestId('profile-join-date')).toBeInTheDocument();
    });

    it('should render only join date when location and website are null', () => {
      render(
        <UserDetails
          joinDate={defaultProps.joinDate}
          location={null}
          website={null}
        />
      );

      expect(screen.queryByTestId('profile-location')).not.toBeInTheDocument();
      expect(screen.queryByTestId('profile-website')).not.toBeInTheDocument();
      expect(screen.getByTestId('profile-join-date')).toBeInTheDocument();
    });
  });

  describe('Text Styling', () => {
    it('should have correct text styling for location', () => {
      render(<UserDetails {...defaultProps} />);

      const location = screen.getByTestId('profile-location');
      const locationText = location.querySelector('span');
      expect(locationText).toHaveClass(
        'font-inter',
        'text-sm',
        'sm:text-base',
        'text-text-placeholder'
      );
    });

    it('should have correct text styling for join date', () => {
      render(<UserDetails {...defaultProps} />);

      const joinDate = screen.getByTestId('profile-join-date');
      const joinDateText = joinDate.querySelector('span');
      expect(joinDateText).toHaveClass(
        'font-inter',
        'text-sm',
        'sm:text-base',
        'text-text-placeholder'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle different date formats', () => {
      render(
        <UserDetails {...defaultProps} joinDate="2023-12-31T23:59:59.000Z" />
      );

      const joinDate = screen.getByTestId('profile-join-date');
      expect(joinDate).toBeInTheDocument();
    });

    it('should handle very long location names', () => {
      const longLocation =
        'San Francisco Bay Area, California, United States of America';
      render(<UserDetails {...defaultProps} location={longLocation} />);

      const location = screen.getByTestId('profile-location');
      expect(location).toHaveTextContent(longLocation);
    });

    it('should handle very long website URLs', () => {
      const longUrl =
        'https://example.com/very/long/path/to/some/resource/that/might/wrap';
      render(<UserDetails {...defaultProps} website={longUrl} />);

      const websiteLink = screen.getByTestId('profile-website-link');
      // URL should be truncated to 20 characters with "..."
      expect(websiteLink).toHaveTextContent('https://example.com/...');
      // But href should have the full URL
      expect(websiteLink).toHaveAttribute('href', longUrl);
    });

    it('should handle website with subdomain', () => {
      render(<UserDetails {...defaultProps} website="blog.example.com" />);

      const websiteLink = screen.getByTestId(
        'profile-website-link'
      ) as HTMLAnchorElement;
      expect(websiteLink.href).toBe('https://blog.example.com/');
    });
  });
});
