import { describe, it, expect } from 'vitest';
import { getOTPInputClassName } from '../otpStyleUtils';

describe('otpStyleUtils', () => {
  describe('getOTPInputClassName', () => {
    const baseClasses =
      'text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200';

    it('should return base classes with error state', () => {
      const result = getOTPInputClassName('w-12 h-12', true, false);

      expect(result).toContain('w-12 h-12');
      expect(result).toContain(baseClasses);
      expect(result).toContain('border-error');
      expect(result).toContain('bg-error/10');
      expect(result).toContain('text-error');
      expect(result).toContain('focus:ring-error');
      expect(result).toContain('focus:border-error');
    });

    it('should return base classes with value state (no error)', () => {
      const result = getOTPInputClassName('w-12 h-12', false, true);

      expect(result).toContain('w-12 h-12');
      expect(result).toContain(baseClasses);
      expect(result).toContain('border-primary');
      expect(result).toContain('bg-primary/10');
      expect(result).toContain('text-primary');
      expect(result).toContain('focus:ring-primary');
    });

    it('should return base classes with default state (no error, no value)', () => {
      const result = getOTPInputClassName('w-12 h-12', false, false);

      expect(result).toContain('w-12 h-12');
      expect(result).toContain(baseClasses);
      expect(result).toContain('border-border');
      expect(result).toContain('bg-background');
      expect(result).toContain('text-foreground');
      expect(result).toContain('focus:ring-primary');
    });

    it('should prioritize error state over value state', () => {
      const result = getOTPInputClassName('w-12 h-12', true, true);

      expect(result).toContain('border-error');
      expect(result).not.toContain('border-primary');
    });

    it('should handle different size classes', () => {
      const sizes = ['w-10 h-10', 'w-12 h-12', 'w-14 h-14', 'w-16 h-16'];

      sizes.forEach((size) => {
        const result = getOTPInputClassName(size, false, false);
        expect(result).toContain(size);
      });
    });

    it('should include all base classes', () => {
      const result = getOTPInputClassName('w-12 h-12', false, false);

      expect(result).toContain('text-center');
      expect(result).toContain('text-2xl');
      expect(result).toContain('font-bold');
      expect(result).toContain('border-2');
      expect(result).toContain('rounded-lg');
      expect(result).toContain('focus:outline-none');
      expect(result).toContain('focus:ring-2');
      expect(result).toContain('transition-all');
      expect(result).toContain('duration-200');
    });

    it('should handle empty size string', () => {
      const result = getOTPInputClassName('', false, false);

      expect(result).toContain(baseClasses);
      expect(result).toContain('border-border');
    });

    it('should handle complex size classes', () => {
      const complexSize = 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16';
      const result = getOTPInputClassName(complexSize, false, false);

      expect(result).toContain(complexSize);
      expect(result).toContain(baseClasses);
    });

    describe('state combinations', () => {
      const testCases = [
        {
          hasError: false,
          hasValue: false,
          expectedClasses: [
            'border-border',
            'bg-background',
            'text-foreground',
          ],
          notExpectedClasses: ['border-error', 'border-primary'],
          description: 'default state',
        },
        {
          hasError: false,
          hasValue: true,
          expectedClasses: ['border-primary', 'bg-primary/10', 'text-primary'],
          notExpectedClasses: ['border-error', 'border-border'],
          description: 'filled state',
        },
        {
          hasError: true,
          hasValue: false,
          expectedClasses: [
            'border-error',
            'bg-error/10',
            'text-error',
            'focus:ring-error',
            'focus:border-error',
          ],
          notExpectedClasses: ['border-primary', 'border-border'],
          description: 'error state',
        },
        {
          hasError: true,
          hasValue: true,
          expectedClasses: ['border-error', 'bg-error/10', 'text-error'],
          notExpectedClasses: ['border-primary', 'border-border'],
          description: 'error takes precedence over filled',
        },
      ];

      testCases.forEach(
        ({
          hasError,
          hasValue,
          expectedClasses,
          notExpectedClasses,
          description,
        }) => {
          it(`should have correct classes for ${description}`, () => {
            const result = getOTPInputClassName(
              'w-12 h-12',
              hasError,
              hasValue
            );

            expectedClasses.forEach((cls) => {
              expect(result).toContain(cls);
            });

            notExpectedClasses.forEach((cls) => {
              expect(result).not.toContain(cls);
            });
          });
        }
      );
    });

    describe('class string format', () => {
      it('should return a single space-separated string', () => {
        const result = getOTPInputClassName('w-12 h-12', false, false);

        expect(typeof result).toBe('string');
        expect(result.includes('  ')).toBe(false); // No double spaces
      });

      it('should have consistent ordering', () => {
        const result1 = getOTPInputClassName('w-12 h-12', false, false);
        const result2 = getOTPInputClassName('w-12 h-12', false, false);

        expect(result1).toBe(result2);
      });

      it('should produce different strings for different states', () => {
        const defaultState = getOTPInputClassName('w-12 h-12', false, false);
        const errorState = getOTPInputClassName('w-12 h-12', true, false);
        const filledState = getOTPInputClassName('w-12 h-12', false, true);

        expect(defaultState).not.toBe(errorState);
        expect(defaultState).not.toBe(filledState);
        expect(errorState).not.toBe(filledState);
      });
    });

    describe('edge cases', () => {
      it('should handle truthy/falsy values correctly', () => {
        const result1 = getOTPInputClassName('w-12', false, false);
        const result2 = getOTPInputClassName('w-12', false, true);

        expect(result1).toContain('border-border');
        expect(result2).toContain('border-primary');
      });

      it('should maintain all spacing and formatting', () => {
        const result = getOTPInputClassName('w-12 h-12', false, false);
        const classes = result.split(' ');

        expect(classes.length).toBeGreaterThan(10); // Should have many classes
        expect(classes.every((cls) => cls.length > 0)).toBe(true); // No empty strings
      });
    });
  });
});
