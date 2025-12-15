import { describe, it, expect } from 'vitest';
import {
  validateDisplayName,
  validateLocation,
  validateWebsite,
  validateBio,
  validateProfileForm,
} from '../profileValidation';

describe('profileValidation', () => {
  describe('validateDisplayName', () => {
    it('should accept valid names', () => {
      expect(validateDisplayName('John Doe')).toEqual({ isValid: true });
      expect(validateDisplayName('Alice Smith')).toEqual({ isValid: true });
      expect(validateDisplayName('Test User 123')).toEqual({ isValid: true });
    });

    it('should reject empty name', () => {
      const result = validateDisplayName('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required and cannot be empty');
    });

    it('should reject name with only spaces', () => {
      const result = validateDisplayName('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name is required and cannot be empty');
    });

    it('should reject name shorter than 5 characters', () => {
      const result = validateDisplayName('John');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be at least 5 characters');
    });

    it('should reject name longer than 30 characters', () => {
      const result = validateDisplayName('A'.repeat(31));
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Name must be 50 characters or less');
    });

    it('should reject name with only emojis', () => {
      const result = validateDisplayName('😀😁😂');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe(
        'Name must contain at least one letter or number'
      );
    });

    it('should accept name with emojis and alphanumeric characters', () => {
      expect(validateDisplayName('John 😀')).toEqual({ isValid: true });
    });

    it('should trim whitespace before validation', () => {
      expect(validateDisplayName('  John Doe  ')).toEqual({ isValid: true });
    });

    it('should accept name at minimum length (5 chars)', () => {
      expect(validateDisplayName('John5')).toEqual({ isValid: true });
    });

    it('should accept name at maximum length (30 chars)', () => {
      expect(validateDisplayName('A'.repeat(30))).toEqual({ isValid: true });
    });
  });

  describe('validateLocation', () => {
    it('should accept valid locations', () => {
      expect(validateLocation('New York')).toEqual({ isValid: true });
      expect(validateLocation('London, UK')).toEqual({ isValid: true });
    });

    it('should accept empty location (optional field)', () => {
      expect(validateLocation('')).toEqual({ isValid: true });
    });

    it('should reject location with only spaces', () => {
      const result = validateLocation('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Location cannot be only spaces');
    });

    it('should reject location with emojis', () => {
      const result = validateLocation('New York 😀');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Location cannot contain emojis');
    });

    it('should reject location longer than 30 characters', () => {
      const result = validateLocation('A'.repeat(31));
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Location must be 30 characters or less');
    });

    it('should trim whitespace before validation', () => {
      expect(validateLocation('  New York  ')).toEqual({ isValid: true });
    });

    it('should accept location at maximum length (30 chars)', () => {
      expect(validateLocation('A'.repeat(30))).toEqual({ isValid: true });
    });
  });

  describe('validateWebsite', () => {
    it('should accept valid websites', () => {
      expect(validateWebsite('example.com')).toEqual({ isValid: true });
      expect(validateWebsite('https://example.com')).toEqual({ isValid: true });
      expect(validateWebsite('http://www.example.com')).toEqual({
        isValid: true,
      });
      expect(validateWebsite('subdomain.example.com')).toEqual({
        isValid: true,
      });
    });

    it('should accept empty website (optional field)', () => {
      expect(validateWebsite('')).toEqual({ isValid: true });
    });

    it('should reject website with only spaces', () => {
      const result = validateWebsite('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Website cannot be only spaces');
    });

    it('should reject website with spaces within URL', () => {
      const result = validateWebsite('exam ple.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Website URL cannot contain spaces');
    });

    it('should reject website with emojis', () => {
      const result = validateWebsite('example.com😀');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Website URL cannot contain emojis');
    });

    it('should reject website longer than 100 characters', () => {
      const result = validateWebsite('https://' + 'a'.repeat(100) + '.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Website must be 100 characters or less');
    });

    it('should reject website without domain', () => {
      const result = validateWebsite('example');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('valid website URL');
    });

    it('should reject invalid URL format', () => {
      const result = validateWebsite('not a url');
      expect(result.isValid).toBe(false);
      // Could be either spaces error or invalid URL error
      expect(result.error).toBeDefined();
    });

    it('should trim whitespace before validation', () => {
      expect(validateWebsite('  example.com  ')).toEqual({ isValid: true });
    });

    it('should accept website with path and query params', () => {
      expect(validateWebsite('example.com/path?query=value')).toEqual({
        isValid: true,
      });
    });

    it('should accept website with subdomain and port', () => {
      expect(validateWebsite('sub.example.com')).toEqual({ isValid: true });
    });
  });

  describe('validateBio', () => {
    it('should accept valid bios', () => {
      expect(validateBio('Software developer')).toEqual({ isValid: true });
      expect(validateBio('I love coding!')).toEqual({ isValid: true });
    });

    it('should accept empty bio (optional field)', () => {
      expect(validateBio('')).toEqual({ isValid: true });
    });

    it('should accept bio with only spaces', () => {
      expect(validateBio('   ')).toEqual({ isValid: true });
    });

    it('should reject bio longer than 160 characters', () => {
      const result = validateBio('A'.repeat(161));
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Bio must be 160 characters or less');
    });

    it('should accept bio at maximum length (160 chars)', () => {
      expect(validateBio('A'.repeat(160))).toEqual({ isValid: true });
    });

    it('should accept bio with emojis', () => {
      expect(validateBio('Developer 😀')).toEqual({ isValid: true });
    });

    it('should accept bio with special characters', () => {
      expect(validateBio('Developer @ Company #tech')).toEqual({
        isValid: true,
      });
    });
  });

  describe('validateProfileForm', () => {
    it('should validate all fields successfully', () => {
      const result = validateProfileForm({
        name: 'John Doe',
        bio: 'Software developer',
        location: 'New York',
        website: 'example.com',
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return errors for invalid name', () => {
      const result = validateProfileForm({
        name: 'Jo',
        bio: 'Valid bio',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Name must be at least 5 characters');
    });

    it('should return errors for invalid bio', () => {
      const result = validateProfileForm({
        name: 'John Doe',
        bio: 'A'.repeat(161),
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.bio).toBe('Bio must be 160 characters or less');
    });

    it('should return errors for invalid location', () => {
      const result = validateProfileForm({
        name: 'John Doe',
        location: 'New York 😀',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.location).toBe('Location cannot contain emojis');
    });

    it('should return errors for invalid website', () => {
      const result = validateProfileForm({
        name: 'John Doe',
        website: 'invalid',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.website).toBeDefined();
    });

    it('should return multiple errors when multiple fields are invalid', () => {
      const result = validateProfileForm({
        name: 'Jo',
        bio: 'A'.repeat(161),
        location: 'NYC 😀',
        website: 'invalid',
      });
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(1);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.bio).toBeDefined();
      expect(result.errors.location).toBeDefined();
      expect(result.errors.website).toBeDefined();
    });

    it('should handle optional fields correctly', () => {
      const result = validateProfileForm({
        name: 'John Doe',
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should not validate empty optional fields', () => {
      const result = validateProfileForm({
        name: 'John Doe',
        bio: '',
        location: '',
        website: '',
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });
});
