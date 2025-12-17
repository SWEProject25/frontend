import { describe, it, expect } from 'vitest';
import {
  cn,
  getLongestOptionText,
  getWidthClass,
  getSelectFieldWidthClass,
} from '../index';

describe('lib/utils', () => {
  describe('cn', () => {
    it('should join valid class names', () => {
      expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
    });

    it('should filter out falsy values', () => {
      expect(cn('class1', undefined, 'class2', null, 'class3', false)).toBe(
        'class1 class2 class3'
      );
    });

    it('should handle empty input', () => {
      expect(cn()).toBe('');
    });

    it('should handle all falsy values', () => {
      expect(cn(undefined, null, false, '')).toBe('');
    });

    it('should handle mixed truthy and falsy values', () => {
      expect(cn('btn', true && 'active', false && 'disabled')).toBe(
        'btn active'
      );
    });
  });

  describe('getLongestOptionText', () => {
    it('should return the longest option label', () => {
      const options = [
        { label: 'Short' },
        { label: 'Medium text' },
        { label: 'Very long option text' },
      ];
      expect(getLongestOptionText(options)).toBe('Very long option text');
    });

    it('should return fallback for empty array', () => {
      expect(getLongestOptionText([])).toBe('Select');
    });

    it('should return custom fallback for empty array', () => {
      expect(getLongestOptionText([], 'Choose')).toBe('Choose');
    });

    it('should handle single option', () => {
      expect(getLongestOptionText([{ label: 'Only one' }])).toBe('Only one');
    });

    it('should handle options with same length', () => {
      const options = [{ label: 'Test1' }, { label: 'Test2' }];
      expect(getLongestOptionText(options)).toBe('Test1');
    });
  });

  describe('getWidthClass', () => {
    it('should return w-full when fullWidth is true', () => {
      expect(getWidthClass(100, true)).toBe('w-full');
      expect(getWidthClass(5, true)).toBe('w-full');
    });

    it('should return w-32 for short text (≤8 chars)', () => {
      expect(getWidthClass(5)).toBe('w-32');
      expect(getWidthClass(8)).toBe('w-32');
    });

    it('should return w-40 for medium text (9-12 chars)', () => {
      expect(getWidthClass(9)).toBe('w-40');
      expect(getWidthClass(12)).toBe('w-40');
    });

    it('should return w-48 for longer text (13-16 chars)', () => {
      expect(getWidthClass(13)).toBe('w-48');
      expect(getWidthClass(16)).toBe('w-48');
    });

    it('should return w-56 for even longer text (17-20 chars)', () => {
      expect(getWidthClass(17)).toBe('w-56');
      expect(getWidthClass(20)).toBe('w-56');
    });

    it('should return w-64 for very long text (>20 chars)', () => {
      expect(getWidthClass(21)).toBe('w-64');
      expect(getWidthClass(100)).toBe('w-64');
    });
  });

  describe('getSelectFieldWidthClass', () => {
    it('should calculate width based on longest option', () => {
      const options = [{ label: 'Short' }, { label: 'Very long option' }];
      expect(getSelectFieldWidthClass(options)).toBe('w-48');
    });

    it('should use label if longer than options', () => {
      const options = [{ label: 'Short' }];
      expect(getSelectFieldWidthClass(options, 'Very long label text')).toBe(
        'w-56'
      );
    });

    it('should return w-full when fullWidth is true', () => {
      const options = [{ label: 'Test' }];
      expect(getSelectFieldWidthClass(options, undefined, true)).toBe('w-full');
    });

    it('should handle empty options with no label', () => {
      expect(getSelectFieldWidthClass([])).toBe('w-32');
    });

    it('should handle empty options with label', () => {
      expect(getSelectFieldWidthClass([], 'Label')).toBe('w-32');
    });

    it('should calculate max between option and label', () => {
      const options = [{ label: 'Test' }];
      const label = 'Longer label text'; // 17 chars -> w-56
      expect(getSelectFieldWidthClass(options, label)).toBe('w-56');
    });
  });
});
