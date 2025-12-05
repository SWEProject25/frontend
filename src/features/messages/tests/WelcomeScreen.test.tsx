import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '../../../test/test-utils';
import WelcomeScreen from '../components/WelcomeScreen';

describe('WelcomeScreen', () => {
  it('renders heading, description and button', () => {
    render(<WelcomeScreen />);

    // Heading
    expect(
      screen.getByRole('heading', { name: /select a message/i })
    ).toBeTruthy();

    // Description paragraph
    expect(
      screen.getByText(/choose from your existing conversations/i)
    ).toBeTruthy();

    // Button
    expect(screen.getByRole('button', { name: /new message/i })).toBeTruthy();
  });
});
