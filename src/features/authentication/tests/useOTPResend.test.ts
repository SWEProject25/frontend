import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useOTPResend } from '../hooks/useOTPResend';
import { OTP_CONSTANTS } from '../constants';

// Mock constants
vi.mock('../constants', () => ({
  OTP_CONSTANTS: {
    RESEND_COUNTDOWN_SECONDS: 30,
  },
}));

describe('useOTPResend', () => {
  const mockOnResend = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() =>
        useOTPResend({
          isOTPSent: false,
          onResend: mockOnResend,
        })
      );

      expect(result.current.resendCountdown).toBe(0);
      expect(result.current.isResendDisabled).toBe(false);
    });

    it('should start countdown when isOTPSent is true', () => {
      const { result } = renderHook(() =>
        useOTPResend({
          isOTPSent: true,
          onResend: mockOnResend,
        })
      );

      expect(result.current.resendCountdown).toBe(30);
      expect(result.current.isResendDisabled).toBe(true);
    });
  });

  describe('isOTPSent changes', () => {
    it('should start countdown when isOTPSent changes from false to true', () => {
      const { result, rerender } = renderHook(
        ({ isOTPSent }) =>
          useOTPResend({
            isOTPSent,
            onResend: mockOnResend,
          }),
        {
          initialProps: { isOTPSent: false },
        }
      );

      expect(result.current.resendCountdown).toBe(0);
      expect(result.current.isResendDisabled).toBe(false);

      rerender({ isOTPSent: true });

      expect(result.current.resendCountdown).toBe(30);
      expect(result.current.isResendDisabled).toBe(true);
    });
  });

  describe('handleCountdownComplete', () => {
    it('should enable resend button and reset countdown', () => {
      const { result } = renderHook(() =>
        useOTPResend({
          isOTPSent: true,
          onResend: mockOnResend,
        })
      );

      expect(result.current.isResendDisabled).toBe(true);

      act(() => {
        result.current.handleCountdownComplete();
      });

      expect(result.current.isResendDisabled).toBe(false);
      expect(result.current.resendCountdown).toBe(0);
    });
  });

  describe('handleResendClick', () => {
    it('should call onResend when button is not disabled', () => {
      const { result } = renderHook(() =>
        useOTPResend({
          isOTPSent: false,
          onResend: mockOnResend,
        })
      );

      act(() => {
        result.current.handleResendClick();
      });

      expect(mockOnResend).toHaveBeenCalledTimes(1);
    });

    it('should not call onResend when button is disabled', () => {
      const { result } = renderHook(() =>
        useOTPResend({
          isOTPSent: true,
          onResend: mockOnResend,
        })
      );

      act(() => {
        result.current.handleResendClick();
      });

      expect(mockOnResend).not.toHaveBeenCalled();
    });

    it('should call onReset when provided', () => {
      const { result } = renderHook(() =>
        useOTPResend({
          isOTPSent: false,
          onResend: mockOnResend,
          onReset: mockOnReset,
        })
      );

      act(() => {
        result.current.handleResendClick();
      });

      expect(mockOnReset).toHaveBeenCalledTimes(1);
      expect(mockOnResend).toHaveBeenCalledTimes(1);
    });

    it('should start countdown after resend click', () => {
      const { result } = renderHook(() =>
        useOTPResend({
          isOTPSent: false,
          onResend: mockOnResend,
        })
      );

      act(() => {
        result.current.handleResendClick();
      });

      expect(result.current.resendCountdown).toBe(30);
      expect(result.current.isResendDisabled).toBe(true);
    });

    it('should work without onReset callback', () => {
      const { result } = renderHook(() =>
        useOTPResend({
          isOTPSent: false,
          onResend: mockOnResend,
        })
      );

      act(() => {
        result.current.handleResendClick();
      });

      expect(mockOnResend).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple isOTPSent changes', () => {
      const { result, rerender } = renderHook(
        ({ isOTPSent }) =>
          useOTPResend({
            isOTPSent,
            onResend: mockOnResend,
          }),
        {
          initialProps: { isOTPSent: false },
        }
      );

      rerender({ isOTPSent: true });
      expect(result.current.resendCountdown).toBe(30);

      rerender({ isOTPSent: false });
      expect(result.current.resendCountdown).toBe(30); // Should not change

      rerender({ isOTPSent: true });
      expect(result.current.resendCountdown).toBe(30); // Should restart
    });

    it('should allow resend after countdown completes', () => {
      const { result } = renderHook(() =>
        useOTPResend({
          isOTPSent: true,
          onResend: mockOnResend,
        })
      );

      // Complete countdown
      act(() => {
        result.current.handleCountdownComplete();
      });

      // Should be able to resend
      act(() => {
        result.current.handleResendClick();
      });

      expect(mockOnResend).toHaveBeenCalledTimes(1);
      expect(result.current.resendCountdown).toBe(30);
      expect(result.current.isResendDisabled).toBe(true);
    });
  });
});
