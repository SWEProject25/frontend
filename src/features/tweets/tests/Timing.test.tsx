import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Timing from '../components/Timing';

describe('Timing Component', () => {
  it('should render relative time for recent tweets', () => {
    const recentTime = new Date(Date.now() - 1000 * 60 * 5).toISOString(); // 5 minutes ago
    render(<Timing time={recentTime} />);

    expect(screen.getByText(/5m/)).toBeInTheDocument();
  });

  it('should render full date when full prop is true', () => {
    const time = '2024-01-15T12:30:00Z';
    render(<Timing time={time} full={true} />);

    // Use getAllByText since date appears in both main text and tooltip
    const dateElements = screen.getAllByText(/Jan 15, 2024/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('should render hours ago for tweets from hours ago', () => {
    const hoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(); // 3 hours ago
    render(<Timing time={hoursAgo} />);

    expect(screen.getByText(/3h/)).toBeInTheDocument();
  });

  it('should render date for old tweets', () => {
    const oldTime = '2023-01-01T12:30:00Z';
    render(<Timing time={oldTime} />);

    // Use getAllByText since date appears in both main text and tooltip
    const dateElements = screen.getAllByText(/Jan 1/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  // it('should not show hover tooltip when hover is false', () => {
  //   const time = new Date().toISOString();
  //   render(<Timing time={time} hover={false} />);

  //   const timingElement = screen.getByText(/\d+[mhs]/);
  //   expect(timingElement).not.toHaveAttribute('title');
  // });
});
