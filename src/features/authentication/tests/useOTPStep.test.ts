import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useOTPStep } from '../hooks/useOTPStep';
import { useAuth } from '../hooks/useAuth';

// Mock useAuth hook
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('useOTPStep', () => {
  const mockSendOTP = vi.fn();
  const mockResendOTP = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      sendOTP: mockSendOTP,
      resendOTP: mockResendOTP,
    } as any);
  });

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useOTPStep(''));

      expect(result.current.isOTPSent).toBe(false);
      expect(result.current.isSendingOTP).toBe(false);
    });

    it('should auto-send OTP when email is provided', async () => {
      mockSendOTP.mockResolvedValueOnce({});

      const { result } = renderHook(() => useOTPStep('test@example.com'));

      await waitFor(() => {
        expect(mockSendOTP).toHaveBeenCalledWith({
          email: 'test@example.com',
        });
      });

      await waitFor(() => {
        expect(result.current.isOTPSent).toBe(true);
      });
    });

    it('should not send OTP when email is empty', () => {
      renderHook(() => useOTPStep(''));

      expect(mockSendOTP).not.toHaveBeenCalled();
    });
  });

  describe('Auto-send OTP', () => {
    it('should send OTP only once on mount', async () => {
      mockSendOTP.mockResolvedValueOnce({});

      const { rerender } = renderHook(() => useOTPStep('test@example.com'));

      await waitFor(() => {
        expect(mockSendOTP).toHaveBeenCalledTimes(1);
      });

      // Rerender should not trigger another send
      rerender();

      expect(mockSendOTP).toHaveBeenCalledTimes(1);
    });

    it('should set isSendingOTP to true while sending', async () => {
      let resolveOTP: any;
      const otpPromise = new Promise((resolve) => {
        resolveOTP = resolve;
      });

      mockSendOTP.mockReturnValueOnce(otpPromise);

      const { result } = renderHook(() => useOTPStep('test@example.com'));

      await waitFor(() => {
        expect(result.current.isSendingOTP).toBe(true);
      });

      await act(async () => {
        resolveOTP({});
        await otpPromise;
      });

      await waitFor(() => {
        expect(result.current.isSendingOTP).toBe(false);
      });
    });

    it('should set isOTPSent to true after successful send', async () => {
      mockSendOTP.mockResolvedValueOnce({});

      const { result } = renderHook(() => useOTPStep('test@example.com'));

      await waitFor(() => {
        expect(result.current.isOTPSent).toBe(true);
      });
    });

    it('should handle send OTP error', async () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mockSendOTP.mockRejectedValueOnce(new Error('Failed to send OTP'));

      const { result } = renderHook(() => useOTPStep('test@example.com'));

      await waitFor(
        () => {
          expect(result.current.isSendingOTP).toBe(false);
        },
        { timeout: 1000 }
      );

      expect(result.current.isOTPSent).toBe(false);
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to send OTP:',
        expect.any(Error)
      );

      consoleError.mockRestore();
    });
  });

  describe('retrySendOTP', () => {
    it('should resend OTP when called', async () => {
      mockSendOTP.mockResolvedValueOnce({});
      mockResendOTP.mockResolvedValueOnce({});

      const { result } = renderHook(() => useOTPStep('test@example.com'));

      await waitFor(() => {
        expect(result.current.isOTPSent).toBe(true);
      });

      act(() => {
        result.current.retrySendOTP();
      });

      await waitFor(() => {
        expect(mockResendOTP).toHaveBeenCalledWith({
          email: 'test@example.com',
        });
      });
    });

    it('should set isSendingOTP to true while resending', async () => {
      mockSendOTP.mockResolvedValueOnce({});

      let resolveResend: any;
      const resendPromise = new Promise((resolve) => {
        resolveResend = resolve;
      });

      mockResendOTP.mockReturnValueOnce(resendPromise);

      const { result } = renderHook(() => useOTPStep('test@example.com'));

      await waitFor(() => {
        expect(result.current.isOTPSent).toBe(true);
      });

      act(() => {
        result.current.retrySendOTP();
      });

      await waitFor(() => {
        expect(result.current.isSendingOTP).toBe(true);
      });

      await act(async () => {
        resolveResend({});
        await resendPromise;
      });

      await waitFor(() => {
        expect(result.current.isSendingOTP).toBe(false);
      });
    });

    it('should set isOTPSent to true after successful resend', async () => {
      mockSendOTP.mockResolvedValueOnce({});
      mockResendOTP.mockResolvedValueOnce({});

      const { result } = renderHook(() => useOTPStep('test@example.com'));

      await waitFor(() => {
        expect(result.current.isOTPSent).toBe(true);
      });

      await act(async () => {
        await result.current.retrySendOTP();
      });

      await waitFor(() => {
        expect(result.current.isOTPSent).toBe(true);
      });
    });

    it('should handle resend OTP error', async () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockSendOTP.mockResolvedValueOnce({});
      mockResendOTP.mockRejectedValueOnce(new Error('Failed to resend OTP'));

      const { result } = renderHook(() => useOTPStep('test@example.com'));

      await waitFor(() => {
        expect(result.current.isOTPSent).toBe(true);
      });

      await act(async () => {
        await result.current.retrySendOTP();
      });

      await waitFor(() => {
        expect(result.current.isSendingOTP).toBe(false);
      });

      // Error should be logged
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to resend OTP:',
        expect.any(Error)
      );
      consoleError.mockRestore();
    });
  });

  describe('Email changes', () => {
    it('should not re-send OTP when email changes', async () => {
      mockSendOTP.mockResolvedValueOnce({});

      const { rerender } = renderHook(({ email }) => useOTPStep(email), {
        initialProps: { email: 'test@example.com' },
      });

      await waitFor(() => {
        expect(mockSendOTP).toHaveBeenCalledTimes(1);
      });

      rerender({ email: 'newemail@example.com' });

      // Should not send again automatically
      expect(mockSendOTP).toHaveBeenCalledTimes(1);
    });
  });
});
