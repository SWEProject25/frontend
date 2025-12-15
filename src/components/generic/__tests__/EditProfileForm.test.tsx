import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EditProfileForm from '../components/EditProfileForm';

vi.mock('@/components/ui/input/InputField', () => ({
  InputField: ({
    label,
    value,
    onChange,
    maxLength,
    showCharCount,
    error,
    type,
    'data-testid': testId,
  }: any) => (
    <div data-testid={testId}>
      <label>{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          data-testid={`${testId}-field`}
        />
      ) : (
        <input
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          data-testid={`${testId}-field`}
        />
      )}
      {showCharCount && (
        <span data-testid={`${testId}-char-count`}>
          {value.length}/{maxLength}
        </span>
      )}
      {error && <span data-testid={`${testId}-error`}>{error}</span>}
    </div>
  ),
}));

vi.mock('@/components/ui/DatePicker', () => ({
  default: ({
    value,
    onChange,
    idPrefix,
    fullWidth,
    'data-testid': testId,
  }: any) => (
    <div
      data-testid={testId}
      data-id-prefix={idPrefix}
      data-full-width={fullWidth}
    >
      <button
        data-testid={`${testId}-button`}
        onClick={() =>
          onChange({
            day: 15,
            month: 6,
            year: 1990,
          })
        }
      >
        Select Date
      </button>
      {value && (
        <span data-testid={`${testId}-value`}>
          {value.month}/{value.day}/{value.year}
        </span>
      )}
    </div>
  ),
}));

describe('EditProfileForm Component', () => {
  const defaultProps = {
    name: '',
    setName: vi.fn(),
    bio: '',
    setBio: vi.fn(),
    location: '',
    setLocation: vi.fn(),
    website: '',
    setWebsite: vi.fn(),
    birth: undefined,
    setBirth: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the form container', () => {
      render(<EditProfileForm {...defaultProps} />);

      const form = screen.getByTestId('edit-profile-form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveClass('mt-20', 'space-y-6', 'mx-2');
    });

    it('should render name input field', () => {
      render(<EditProfileForm {...defaultProps} />);

      const nameInput = screen.getByTestId('edit-profile-name-input');
      expect(nameInput).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should render bio input field', () => {
      render(<EditProfileForm {...defaultProps} />);

      const bioInput = screen.getByTestId('edit-profile-bio-input');
      expect(bioInput).toBeInTheDocument();
      expect(screen.getByText('Bio')).toBeInTheDocument();
    });

    it('should render location input field', () => {
      render(<EditProfileForm {...defaultProps} />);

      const locationInput = screen.getByTestId('edit-profile-location-input');
      expect(locationInput).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
    });

    it('should render website input field', () => {
      render(<EditProfileForm {...defaultProps} />);

      const websiteInput = screen.getByTestId('edit-profile-website-input');
      expect(websiteInput).toBeInTheDocument();
      expect(screen.getByText('Website')).toBeInTheDocument();
    });

    it('should render birthdate picker', () => {
      render(<EditProfileForm {...defaultProps} />);

      const birthdate = screen.getByTestId('edit-profile-birthdate');
      expect(birthdate).toBeInTheDocument();
      expect(screen.getByText('Date of birth')).toBeInTheDocument();
    });

    it('should render all fields with initial values', () => {
      const props = {
        ...defaultProps,
        name: 'John Doe',
        bio: 'Software Developer',
        location: 'New York',
        website: 'https://example.com',
        birth: { day: '15', month: '6', year: '1990' },
      };

      render(<EditProfileForm {...props} />);

      const nameField = screen.getByTestId('edit-profile-name-input-field');
      expect(nameField).toHaveValue('John Doe');

      const bioField = screen.getByTestId('edit-profile-bio-input-field');
      expect(bioField).toHaveValue('Software Developer');

      const locationField = screen.getByTestId(
        'edit-profile-location-input-field'
      );
      expect(locationField).toHaveValue('New York');

      const websiteField = screen.getByTestId(
        'edit-profile-website-input-field'
      );
      expect(websiteField).toHaveValue('https://example.com');

      const birthValue = screen.getByTestId(
        'edit-profile-birthdate-picker-value'
      );
      expect(birthValue).toHaveTextContent('6/15/1990');
    });
  });

  describe('Input Changes', () => {
    it('should call setName when name input changes', () => {
      render(<EditProfileForm {...defaultProps} />);

      const nameField = screen.getByTestId('edit-profile-name-input-field');
      fireEvent.change(nameField, { target: { value: 'Jane Doe' } });

      expect(defaultProps.setName).toHaveBeenCalledWith('Jane Doe');
    });

    it('should call setBio when bio input changes', () => {
      render(<EditProfileForm {...defaultProps} />);

      const bioField = screen.getByTestId('edit-profile-bio-input-field');
      fireEvent.change(bioField, { target: { value: 'New bio' } });

      expect(defaultProps.setBio).toHaveBeenCalledWith('New bio');
    });

    it('should call setLocation when location input changes', () => {
      render(<EditProfileForm {...defaultProps} />);

      const locationField = screen.getByTestId(
        'edit-profile-location-input-field'
      );
      fireEvent.change(locationField, { target: { value: 'San Francisco' } });

      expect(defaultProps.setLocation).toHaveBeenCalledWith('San Francisco');
    });

    it('should call setWebsite when website input changes', () => {
      render(<EditProfileForm {...defaultProps} />);

      const websiteField = screen.getByTestId(
        'edit-profile-website-input-field'
      );
      fireEvent.change(websiteField, {
        target: { value: 'https://newsite.com' },
      });

      expect(defaultProps.setWebsite).toHaveBeenCalledWith(
        'https://newsite.com'
      );
    });

    it('should call setBirth when date is selected', () => {
      render(<EditProfileForm {...defaultProps} />);

      const dateButton = screen.getByTestId(
        'edit-profile-birthdate-picker-button'
      );
      fireEvent.click(dateButton);

      expect(defaultProps.setBirth).toHaveBeenCalledWith({
        day: 15,
        month: 6,
        year: 1990,
      });
    });
  });

  describe('Field Validation', () => {
    it('should display character counts for all fields', () => {
      render(<EditProfileForm {...defaultProps} name="Test" />);

      expect(
        screen.getByTestId('edit-profile-name-input-char-count')
      ).toHaveTextContent('4/30');
    });

    it('should enforce maxLength on name field (30 chars)', () => {
      render(<EditProfileForm {...defaultProps} />);

      const nameField = screen.getByTestId('edit-profile-name-input-field');
      expect(nameField).toHaveAttribute('maxLength', '30');
    });

    it('should enforce maxLength on bio field (160 chars)', () => {
      render(<EditProfileForm {...defaultProps} />);

      const bioField = screen.getByTestId('edit-profile-bio-input-field');
      expect(bioField).toHaveAttribute('maxLength', '160');
    });

    it('should enforce maxLength on location field (30 chars)', () => {
      render(<EditProfileForm {...defaultProps} />);

      const locationField = screen.getByTestId(
        'edit-profile-location-input-field'
      );
      expect(locationField).toHaveAttribute('maxLength', '30');
    });

    it('should enforce maxLength on website field (100 chars)', () => {
      render(<EditProfileForm {...defaultProps} />);

      const websiteField = screen.getByTestId(
        'edit-profile-website-input-field'
      );
      expect(websiteField).toHaveAttribute('maxLength', '100');
    });
  });

  describe('Error Display', () => {
    it('should display name error when provided', () => {
      const errors = { name: 'Name is required' };
      render(<EditProfileForm {...defaultProps} errors={errors} />);

      const errorMessage = screen.getByTestId('edit-profile-name-input-error');
      expect(errorMessage).toHaveTextContent('Name is required');
    });

    it('should display bio error when provided', () => {
      const errors = { bio: 'Bio is too long' };
      render(<EditProfileForm {...defaultProps} errors={errors} />);

      const errorMessage = screen.getByTestId('edit-profile-bio-input-error');
      expect(errorMessage).toHaveTextContent('Bio is too long');
    });

    it('should display location error when provided', () => {
      const errors = { location: 'Invalid location' };
      render(<EditProfileForm {...defaultProps} errors={errors} />);

      const errorMessage = screen.getByTestId(
        'edit-profile-location-input-error'
      );
      expect(errorMessage).toHaveTextContent('Invalid location');
    });

    it('should display website error when provided', () => {
      const errors = { website: 'Invalid URL' };
      render(<EditProfileForm {...defaultProps} errors={errors} />);

      const errorMessage = screen.getByTestId(
        'edit-profile-website-input-error'
      );
      expect(errorMessage).toHaveTextContent('Invalid URL');
    });

    it('should display multiple errors simultaneously', () => {
      const errors = {
        name: 'Name error',
        bio: 'Bio error',
        location: 'Location error',
        website: 'Website error',
      };
      render(<EditProfileForm {...defaultProps} errors={errors} />);

      expect(
        screen.getByTestId('edit-profile-name-input-error')
      ).toHaveTextContent('Name error');
      expect(
        screen.getByTestId('edit-profile-bio-input-error')
      ).toHaveTextContent('Bio error');
      expect(
        screen.getByTestId('edit-profile-location-input-error')
      ).toHaveTextContent('Location error');
      expect(
        screen.getByTestId('edit-profile-website-input-error')
      ).toHaveTextContent('Website error');
    });
  });

  describe('DatePicker Configuration', () => {
    it('should configure DatePicker with correct props', () => {
      render(<EditProfileForm {...defaultProps} />);

      const datePicker = screen.getByTestId('edit-profile-birthdate-picker');
      expect(datePicker).toHaveAttribute('data-id-prefix', 'edit-birth');
      expect(datePicker).toHaveAttribute('data-full-width', 'true');
    });

    it('should pass undefined birth value correctly', () => {
      render(<EditProfileForm {...defaultProps} birth={undefined} />);

      const birthValue = screen.queryByTestId(
        'edit-profile-birthdate-picker-value'
      );
      expect(birthValue).not.toBeInTheDocument();
    });

    it('should display selected birth date', () => {
      const birth = { day: '25', month: '12', year: '1995' };
      render(<EditProfileForm {...defaultProps} birth={birth} />);

      const birthValue = screen.getByTestId(
        'edit-profile-birthdate-picker-value'
      );
      expect(birthValue).toHaveTextContent('12/25/1995');
    });
  });

  describe('Empty Errors Object', () => {
    it('should not display errors when errors object is empty', () => {
      render(<EditProfileForm {...defaultProps} errors={{}} />);

      expect(
        screen.queryByTestId('edit-profile-name-input-error')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('edit-profile-bio-input-error')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('edit-profile-location-input-error')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('edit-profile-website-input-error')
      ).not.toBeInTheDocument();
    });

    it('should not display errors when errors prop is undefined', () => {
      render(<EditProfileForm {...defaultProps} />);

      expect(
        screen.queryByTestId('edit-profile-name-input-error')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('edit-profile-bio-input-error')
      ).not.toBeInTheDocument();
    });
  });
});
