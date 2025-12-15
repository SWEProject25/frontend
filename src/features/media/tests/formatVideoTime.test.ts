import { describe, it, expect } from 'vitest';
import { formatVideoTime } from '../utils/formatVideoTime';

describe('formatVideoTime', () => {
  it('should format 0 seconds correctly', () => {
    expect(formatVideoTime(0)).toBe('0:00');
  });

  it('should format seconds under a minute', () => {
    expect(formatVideoTime(30)).toBe('0:30');
  });

  it('should format exactly 1 minute', () => {
    expect(formatVideoTime(60)).toBe('1:00');
  });

  it('should format minutes and seconds', () => {
    expect(formatVideoTime(90)).toBe('1:30');
  });

  it('should pad single digit seconds with zero', () => {
    expect(formatVideoTime(65)).toBe('1:05');
  });

  it('should handle multiple minutes', () => {
    expect(formatVideoTime(180)).toBe('3:00');
  });

  it('should handle complex time', () => {
    expect(formatVideoTime(125)).toBe('2:05');
  });

  it('should handle large durations', () => {
    expect(formatVideoTime(3600)).toBe('60:00');
  });

  it('should floor decimal seconds', () => {
    expect(formatVideoTime(30.7)).toBe('0:30');
  });

  it('should floor decimal minutes', () => {
    expect(formatVideoTime(90.5)).toBe('1:30');
  });

  it('should handle 59 seconds', () => {
    expect(formatVideoTime(59)).toBe('0:59');
  });

  it('should handle 61 seconds', () => {
    expect(formatVideoTime(61)).toBe('1:01');
  });

  it('should handle very small decimal', () => {
    expect(formatVideoTime(0.1)).toBe('0:00');
  });

  it('should handle 10 minutes', () => {
    expect(formatVideoTime(600)).toBe('10:00');
  });

  it('should format edge case of 9 seconds', () => {
    expect(formatVideoTime(9)).toBe('0:09');
  });

  it('should format edge case of 10 seconds', () => {
    expect(formatVideoTime(10)).toBe('0:10');
  });

  it('should handle duration just under 2 minutes', () => {
    expect(formatVideoTime(119)).toBe('1:59');
  });

  it('should handle large hour-length durations', () => {
    expect(formatVideoTime(7200)).toBe('120:00');
  });
});
