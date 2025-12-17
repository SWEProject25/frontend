import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCaptcha } from '../hooks/useCaptcha';
import { authApi } from '../services/authApi';

// Mock authApi
vi.mock('../services/authApi', () => ({
  authApi: {
    verifyRecaptcha: vi.fn(),
  },
}));

// Mock RECAPTCHA_CONFIG
vi.mock('../constants', () => ({
  RECAPTCHA_CONFIG: {
    SITE_KEY: 'test-site-key',
    ERRORS: {
      VERIFICATION_FAILED: 'Verification failed',
      EXPIRED: 'reCAPTCHA expired',
      ERROR: 'reCAPTCHA error occurred',
    },
  },
}));

describe('useCaptcha', () => {
  const mockOnVerify = vi.fn();
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with correct default values', async () => {
      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      // isClient may already be true due to useEffect running immediately
      expect(result.current.isClient).toBeDefined();
      expect(result.current.isVerifying).toBe(false);
      expect(result.current.isRecaptchaLoaded).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.siteKey).toBe('test-site-key');
    });

    it('should set isClient to true after mount', async () => {
      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      await waitFor(() => {
        expect(result.current.isClient).toBe(true);
      });
    });

    it('should have recaptchaRef defined', () => {
      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      expect(result.current.recaptchaRef).toBeDefined();
      expect(result.current.recaptchaRef.current).toBe(null);
    });
  });

  describe('handleCaptchaChange', () => {
    it('should call onVerify with false when token is null', async () => {
      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      await act(async () => {
        await result.current.handleCaptchaChange(null);
      });

      expect(mockOnVerify).toHaveBeenCalledWith(false);
      expect(result.current.error).toBe(null);
    });

    it('should verify token successfully', async () => {
      vi.mocked(authApi.verifyRecaptcha).mockResolvedValueOnce({
        status: 'success',
        message: 'Verified',
      } as any);

      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      await act(async () => {
        await result.current.handleCaptchaChange('test-token');
      });

      expect(authApi.verifyRecaptcha).toHaveBeenCalledWith({
        recaptcha: 'test-token',
      });
      expect(mockOnVerify).toHaveBeenCalledWith(true);
      expect(result.current.error).toBe(null);
      expect(result.current.isVerifying).toBe(false);
    });

    it('should handle verification failure with status other than success', async () => {
      vi.mocked(authApi.verifyRecaptcha).mockResolvedValueOnce({
        status: 'fail',
        message: 'Robot detected',
      } as any);

      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      // Mock recaptchaRef.current.reset
      result.current.recaptchaRef.current = {
        reset: mockReset,
      } as any;

      await act(async () => {
        await result.current.handleCaptchaChange('test-token');
      });

      expect(mockOnVerify).toHaveBeenCalledWith(false);
      expect(result.current.error).toBe('Robot detected');
      expect(mockReset).toHaveBeenCalled();
    });

    it('should handle API error during verification', async () => {
      const errorMessage = 'Network error';
      vi.mocked(authApi.verifyRecaptcha).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      // Mock recaptchaRef.current.reset
      result.current.recaptchaRef.current = {
        reset: mockReset,
      } as any;

      await act(async () => {
        await result.current.handleCaptchaChange('test-token');
      });

      expect(mockOnVerify).toHaveBeenCalledWith(false);
      expect(result.current.error).toBe(errorMessage);
      expect(mockReset).toHaveBeenCalled();
      expect(result.current.isVerifying).toBe(false);
    });

    it('should use default error message for non-Error failures', async () => {
      vi.mocked(authApi.verifyRecaptcha).mockRejectedValueOnce('String error');

      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      // Mock recaptchaRef.current.reset
      result.current.recaptchaRef.current = {
        reset: mockReset,
      } as any;

      await act(async () => {
        await result.current.handleCaptchaChange('test-token');
      });

      expect(result.current.error).toBe('Verification failed');
    });

    it('should set isVerifying to true during verification', async () => {
      let resolveVerification: any;
      const verificationPromise = new Promise((resolve) => {
        resolveVerification = resolve;
      });

      vi.mocked(authApi.verifyRecaptcha).mockReturnValueOnce(
        verificationPromise as any
      );

      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      act(() => {
        result.current.handleCaptchaChange('test-token');
      });

      // Should be verifying now
      await waitFor(() => {
        expect(result.current.isVerifying).toBe(true);
      });

      // Complete verification
      await act(async () => {
        resolveVerification({ status: 'success', message: 'Verified' });
        await verificationPromise;
      });

      expect(result.current.isVerifying).toBe(false);
    });

    it('should clear error before starting new verification', async () => {
      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      // Set an error first
      vi.mocked(authApi.verifyRecaptcha).mockRejectedValueOnce(
        new Error('First error')
      );

      result.current.recaptchaRef.current = {
        reset: mockReset,
      } as any;

      await act(async () => {
        await result.current.handleCaptchaChange('token1');
      });

      expect(result.current.error).toBe('First error');

      // Now verify successfully
      vi.mocked(authApi.verifyRecaptcha).mockResolvedValueOnce({
        status: 'success',
        message: 'Verified',
      } as any);

      await act(async () => {
        await result.current.handleCaptchaChange('token2');
      });

      expect(result.current.error).toBe(null);
    });
  });

  describe('handleCaptchaLoad', () => {
    it('should set isRecaptchaLoaded to true', () => {
      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      expect(result.current.isRecaptchaLoaded).toBe(false);

      act(() => {
        result.current.handleCaptchaLoad();
      });

      expect(result.current.isRecaptchaLoaded).toBe(true);
    });
  });

  describe('handleCaptchaExpired', () => {
    it('should set error and call onVerify with false', () => {
      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      act(() => {
        result.current.handleCaptchaExpired();
      });

      expect(result.current.error).toBe('reCAPTCHA expired');
      expect(mockOnVerify).toHaveBeenCalledWith(false);
    });
  });

  describe('handleCaptchaError', () => {
    it('should set error and call onVerify with false', () => {
      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      act(() => {
        result.current.handleCaptchaError();
      });

      expect(result.current.error).toBe('reCAPTCHA error occurred');
      expect(mockOnVerify).toHaveBeenCalledWith(false);
    });
  });

  describe('Error Handling', () => {
    it('should use fallback message when response has no message', async () => {
      vi.mocked(authApi.verifyRecaptcha).mockResolvedValueOnce({
        status: 'fail',
        message: undefined,
      } as any);

      const { result } = renderHook(() =>
        useCaptcha({
          onVerify: mockOnVerify,
        })
      );

      result.current.recaptchaRef.current = {
        reset: mockReset,
      } as any;

      await act(async () => {
        await result.current.handleCaptchaChange('test-token');
      });

      expect(result.current.error).toBe('Verification failed');
    });
  });
});
