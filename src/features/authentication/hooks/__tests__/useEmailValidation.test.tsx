import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useEmailValidation } from '../useEmailValidation';
import { AUTH_API_CONFIG, AUTH_ENDPOINTS } from '../../constants/api';

const API_BASE_URL = AUTH_API_CONFIG.BASE_URL;

describe('useEmailValidation', () => {
  let fetchMock: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock fetch globally
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  describe('initial state', () => {
    it('should return correct initial state', () => {
      const { result } = renderHook(() => useEmailValidation());

      expect(result.current.isValidating).toBe(false);
      expect(result.current.error).toBeUndefined();
      expect(result.current.isValid).toBe(true);
      expect(typeof result.current.validateWithDebounce).toBe('function');
    });
  });

  describe('validateWithDebounce', () => {
    it('should debounce validation calls', async () => {
      const { result } = renderHook(() => useEmailValidation());

      fetchMock.mockResolvedValue({ ok: true, status: 200 });

      // Make multiple rapid calls - only last should execute
      result.current.validateWithDebounce('test1@example.com', 50);
      result.current.validateWithDebounce('test2@example.com', 50);
      result.current.validateWithDebounce('test3@example.com', 50);

      // Wait for debounce to complete
      await waitFor(
        () => {
          expect(fetchMock).toHaveBeenCalledTimes(1);
          expect(fetchMock).toHaveBeenCalledWith(
            `${API_BASE_URL}${AUTH_ENDPOINTS.CHECK_EMAIL}`,
            expect.objectContaining({
              body: JSON.stringify({ email: 'test3@example.com' }),
            })
          );
        },
        { timeout: 1000 }
      );
    });

    it('should validate successfully via API', async () => {
      const onValidationChange = vi.fn();
      const { result } = renderHook(() =>
        useEmailValidation({ onValidationChange })
      );

      fetchMock.mockResolvedValue({ ok: true, status: 200 });

      result.current.validateWithDebounce('valid@example.com', 50);

      await waitFor(
        () => {
          expect(result.current.isValid).toBe(true);
          expect(result.current.error).toBeUndefined();
          expect(result.current.isValidating).toBe(false);
          expect(onValidationChange).toHaveBeenCalledWith(true);
        },
        { timeout: 1000 }
      );
    });

    it('should handle email already taken (409)', async () => {
      const onValidationChange = vi.fn();
      const { result } = renderHook(() =>
        useEmailValidation({ onValidationChange })
      );

      fetchMock.mockResolvedValue({ ok: false, status: 409 });

      result.current.validateWithDebounce('taken@example.com', 50);

      await waitFor(
        () => {
          expect(result.current.isValid).toBe(false);
          expect(result.current.error).toBe('Email has already been taken.');
          expect(onValidationChange).toHaveBeenCalledWith(
            false,
            'Email has already been taken.'
          );
        },
        { timeout: 1000 }
      );
    });

    it('should handle backend validation error (400)', async () => {
      const { result } = renderHook(() => useEmailValidation());

      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: ['email must be an email'] }),
      });

      result.current.validateWithDebounce('invalid@', 50);

      await waitFor(
        () => {
          expect(result.current.isValid).toBe(false);
          expect(result.current.error).toBe('Please enter a valid email.');
        },
        { timeout: 1000 }
      );
    });

    it('should handle network errors gracefully', async () => {
      const onValidationChange = vi.fn();
      const { result } = renderHook(() =>
        useEmailValidation({ onValidationChange })
      );

      fetchMock.mockRejectedValue(new Error('Network error'));

      result.current.validateWithDebounce('test@example.com', 50);

      await waitFor(
        () => {
          expect(result.current.isValid).toBe(true);
          expect(result.current.error).toBeUndefined();
          expect(onValidationChange).toHaveBeenCalledWith(true);
        },
        { timeout: 1000 }
      );
    });

    it('should handle server errors gracefully (500)', async () => {
      const { result } = renderHook(() => useEmailValidation());

      fetchMock.mockResolvedValue({ ok: false, status: 500 });

      result.current.validateWithDebounce('test@example.com', 50);

      await waitFor(
        () => {
          expect(result.current.isValid).toBe(true);
          expect(result.current.error).toBeUndefined();
        },
        { timeout: 1000 }
      );
    });

    it('should reject invalid email format', async () => {
      const onValidationChange = vi.fn();
      const { result } = renderHook(() =>
        useEmailValidation({ onValidationChange })
      );

      result.current.validateWithDebounce('invalid-email', 50);

      await waitFor(
        () => {
          expect(result.current.isValid).toBe(false);
          expect(result.current.error).toBe('Please enter a valid email.');
          expect(onValidationChange).toHaveBeenCalledWith(
            false,
            'Please enter a valid email.'
          );
        },
        { timeout: 1000 }
      );
    });

    it('should reject email with non-ASCII characters', async () => {
      const { result } = renderHook(() => useEmailValidation());

      result.current.validateWithDebounce('tëst@example.com', 50);

      await waitFor(
        () => {
          expect(result.current.isValid).toBe(false);
          expect(result.current.error).toContain('ASCII characters');
        },
        { timeout: 1000 }
      );
    });

    it('should handle empty email', async () => {
      const onValidationChange = vi.fn();
      const { result } = renderHook(() =>
        useEmailValidation({ onValidationChange })
      );

      result.current.validateWithDebounce('', 50);

      await waitFor(
        () => {
          expect(result.current.isValid).toBe(true);
          expect(result.current.error).toBeUndefined();
          expect(onValidationChange).toHaveBeenCalledWith(true);
        },
        { timeout: 1000 }
      );
    });

    it('should not make API call when remote is false', async () => {
      const { result } = renderHook(() => useEmailValidation());

      result.current.validateWithDebounce('test@example.com', 50, false);

      await waitFor(
        () => {
          expect(fetchMock).not.toHaveBeenCalled();
          expect(result.current.isValid).toBe(true);
        },
        { timeout: 1000 }
      );
    });

    it('should normalize email before checking', async () => {
      const { result } = renderHook(() => useEmailValidation());

      fetchMock.mockResolvedValue({ ok: true, status: 200 });

      result.current.validateWithDebounce('Test@Example.COM', 50);

      await waitFor(
        () => {
          expect(fetchMock).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
              body: JSON.stringify({ email: 'test@example.com' }),
            })
          );
        },
        { timeout: 1000 }
      );
    });

    it('should handle email with spaces', async () => {
      const { result } = renderHook(() => useEmailValidation());

      fetchMock.mockResolvedValue({ ok: true, status: 200 });

      result.current.validateWithDebounce(' test@example.com ', 50);

      await waitFor(
        () => {
          expect(fetchMock).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
              body: JSON.stringify({ email: 'test@example.com' }),
            })
          );
        },
        { timeout: 1000 }
      );
    });
  });

  describe('cleanup', () => {
    it('should cleanup timer on unmount', () => {
      const { result, unmount } = renderHook(() => useEmailValidation());

      fetchMock.mockResolvedValue({ ok: true, status: 200 });

      result.current.validateWithDebounce('test@example.com', 1000);

      // Unmount before timer fires
      unmount();

      // Wait a bit to ensure timer would have fired
      return new Promise((resolve) =>
        setTimeout(() => {
          // Should not have called fetch after unmount
          expect(fetchMock).not.toHaveBeenCalled();
          resolve(undefined);
        }, 1100)
      );
    });
  });

  describe('onValidationChange callback', () => {
    it('should not call callback if not provided', async () => {
      const { result } = renderHook(() => useEmailValidation());

      fetchMock.mockResolvedValue({ ok: true, status: 200 });

      result.current.validateWithDebounce('test@example.com', 50);

      await waitFor(
        () => {
          expect(result.current.isValid).toBe(true);
        },
        { timeout: 1000 }
      );
    });

    it('should call callback with validation results', async () => {
      const onValidationChange = vi.fn();
      const { result } = renderHook(() =>
        useEmailValidation({ onValidationChange })
      );

      fetchMock.mockResolvedValue({ ok: false, status: 409 });

      result.current.validateWithDebounce('taken@example.com', 50);

      await waitFor(
        () => {
          expect(onValidationChange).toHaveBeenCalledWith(
            false,
            'Email has already been taken.'
          );
        },
        { timeout: 1000 }
      );
    });
  });
});
