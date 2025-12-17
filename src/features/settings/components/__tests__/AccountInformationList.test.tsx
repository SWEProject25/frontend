import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AccountInformationList from '../AccountInformationList';

describe('AccountInformationList', () => {
  it('should render the component', () => {
    render(<AccountInformationList />);

    expect(screen.getByTestId('account-information-list')).toBeInTheDocument();
    expect(screen.getByText('Account Information List')).toBeInTheDocument();
  });
});
