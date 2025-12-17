import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOTPInput } from '../hooks/useOTPInput';
import * as otpUtils from '../utils';

// Mock the utility functions
vi.mock('../utils', async () => {
  const actual = await vi.importActual('../utils');
  return {
    ...actual,
    isValidOTPInput: vi.fn((value: string) => /^\d$/.test(value)),
    isOTPComplete: vi.fn(
      (otp: string[], length: number) =>
        otp.every((digit) => digit !== '') && otp.length === length
    ),
    getNextOTPIndex: vi.fn((index: number, length: number) =>
      Math.min(index + 1, length - 1)
    ),
    getPreviousOTPIndex: vi.fn((index: number) => Math.max(index - 1, 0)),
    processPastedOTP: vi.fn((data: string, length: number) =>
      data.split('').slice(0, length)
    ),
  };
});

describe('useOTPInput', () => {
  const mockOnComplete = vi.fn();
  const mockOnChange = vi.fn();
  const mockOnClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with empty OTP array', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
        })
      );

      expect(result.current.otp).toEqual(['', '', '', '', '', '']);
      expect(result.current.activeIndex).toBe(0);
    });

    it('should initialize with correct length', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 4,
          onComplete: mockOnComplete,
        })
      );

      expect(result.current.otp).toEqual(['', '', '', '']);
    });
  });

  describe('handleChange', () => {
    it('should update OTP value at specific index', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
          onChange: mockOnChange,
        })
      );

      act(() => {
        result.current.handleChange(0, '1');
      });

      expect(result.current.otp[0]).toBe('1');
      expect(mockOnChange).toHaveBeenCalledWith('1');
    });

    it('should not update OTP with invalid input', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
        })
      );

      vi.mocked(otpUtils.isValidOTPInput).mockReturnValueOnce(false);

      act(() => {
        result.current.handleChange(0, 'a');
      });

      expect(result.current.otp[0]).toBe('');
    });

    it('should call onClearError when user types', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
          error: 'Invalid OTP',
          onClearError: mockOnClearError,
        })
      );

      act(() => {
        result.current.handleChange(0, '1');
      });

      expect(mockOnClearError).toHaveBeenCalled();
    });

    it('should move to next input after entering digit', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
        })
      );

      act(() => {
        result.current.handleChange(0, '1');
      });

      expect(result.current.activeIndex).toBe(1);
    });

    it('should call onComplete when OTP is complete', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
        })
      );

      // Mock isOTPComplete to return true on the last call
      vi.mocked(otpUtils.isOTPComplete)
        .mockReturnValue(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      // Fill all digits
      act(() => {
        result.current.handleChange(0, '1');
      });
      act(() => {
        result.current.handleChange(1, '2');
      });
      act(() => {
        result.current.handleChange(2, '3');
      });
      act(() => {
        result.current.handleChange(3, '4');
      });
      act(() => {
        result.current.handleChange(4, '5');
      });
      act(() => {
        result.current.handleChange(5, '6');
      });

      expect(mockOnComplete).toHaveBeenCalledWith('123456');
    });

    it('should call onChange for partial OTP updates', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
          onChange: mockOnChange,
        })
      );

      act(() => {
        result.current.handleChange(0, '1');
      });

      expect(mockOnChange).toHaveBeenCalledWith('1');
    });
  });

  describe('handleKeyDown', () => {
    it('should clear current digit on backspace', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
          onChange: mockOnChange,
        })
      );

      // Set a digit first
      act(() => {
        result.current.handleChange(0, '1');
      });

      // Press backspace
      act(() => {
        result.current.handleKeyDown(0, {
          key: 'Backspace',
          preventDefault: vi.fn(),
        } as any);
      });

      expect(result.current.otp[0]).toBe('');
      expect(mockOnChange).toHaveBeenCalledWith('');
    });

    it('should move to previous input on backspace when current is empty', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
        })
      );

      // Set activeIndex to 2
      act(() => {
        result.current.handleChange(0, '1');
        result.current.handleChange(1, '2');
      });

      // Press backspace on empty field
      act(() => {
        result.current.handleKeyDown(2, {
          key: 'Backspace',
          preventDefault: vi.fn(),
        } as any);
      });

      expect(result.current.activeIndex).toBe(1);
    });

    it('should call onClearError on backspace', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
          error: 'Invalid OTP',
          onClearError: mockOnClearError,
        })
      );

      act(() => {
        result.current.handleKeyDown(0, {
          key: 'Backspace',
          preventDefault: vi.fn(),
        } as any);
      });

      expect(mockOnClearError).toHaveBeenCalled();
    });

    it('should not move to previous input at index 0', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
        })
      );

      act(() => {
        result.current.handleKeyDown(0, {
          key: 'Backspace',
          preventDefault: vi.fn(),
        } as any);
      });

      expect(result.current.activeIndex).toBe(0);
    });
  });

  describe('handlePaste', () => {
    it('should fill OTP from pasted data', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
        })
      );

      vi.mocked(otpUtils.processPastedOTP).mockReturnValueOnce([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
      ]);
      vi.mocked(otpUtils.isOTPComplete).mockReturnValueOnce(true);

      act(() => {
        result.current.handlePaste({
          preventDefault: vi.fn(),
          clipboardData: {
            getData: vi.fn(() => '123456'),
          },
        } as any);
      });

      expect(result.current.otp).toEqual(['1', '2', '3', '4', '5', '6']);
      expect(mockOnComplete).toHaveBeenCalledWith('123456');
    });

    it('should set active index to last position after paste', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
        })
      );

      vi.mocked(otpUtils.processPastedOTP).mockReturnValueOnce([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
      ]);
      vi.mocked(otpUtils.isOTPComplete).mockReturnValueOnce(true);

      act(() => {
        result.current.handlePaste({
          preventDefault: vi.fn(),
          clipboardData: {
            getData: vi.fn(() => '123456'),
          },
        } as any);
      });

      expect(result.current.activeIndex).toBe(5);
    });

    it('should call onClearError on paste', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
          error: 'Invalid OTP',
          onClearError: mockOnClearError,
        })
      );

      vi.mocked(otpUtils.processPastedOTP).mockReturnValueOnce([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
      ]);
      vi.mocked(otpUtils.isOTPComplete).mockReturnValueOnce(true);

      act(() => {
        result.current.handlePaste({
          preventDefault: vi.fn(),
          clipboardData: {
            getData: vi.fn(() => '123456'),
          },
        } as any);
      });

      expect(mockOnClearError).toHaveBeenCalled();
    });

    it('should not call onComplete for incomplete pasted OTP', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
        })
      );

      vi.mocked(otpUtils.processPastedOTP).mockReturnValueOnce(['1', '2', '3']);
      vi.mocked(otpUtils.isOTPComplete).mockReturnValueOnce(false);

      act(() => {
        result.current.handlePaste({
          preventDefault: vi.fn(),
          clipboardData: {
            getData: vi.fn(() => '123'),
          },
        } as any);
      });

      expect(mockOnComplete).not.toHaveBeenCalled();
    });
  });

  describe('resetOTP', () => {
    it('should reset OTP to empty array', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
          onChange: mockOnChange,
        })
      );

      // Fill OTP first
      act(() => {
        result.current.handleChange(0, '1');
        result.current.handleChange(1, '2');
      });

      // Reset
      act(() => {
        result.current.resetOTP();
      });

      expect(result.current.otp).toEqual(['', '', '', '', '', '']);
      expect(result.current.activeIndex).toBe(0);
    });

    it('should call onClearError on reset', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
          onClearError: mockOnClearError,
        })
      );

      act(() => {
        result.current.resetOTP();
      });

      expect(mockOnClearError).toHaveBeenCalled();
    });

    it('should call onChange with empty string on reset', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
          onChange: mockOnChange,
        })
      );

      act(() => {
        result.current.resetOTP();
      });

      expect(mockOnChange).toHaveBeenCalledWith('');
    });
  });

  describe('inputRefs', () => {
    it('should maintain inputRefs array', () => {
      const { result } = renderHook(() =>
        useOTPInput({
          length: 6,
          onComplete: mockOnComplete,
        })
      );

      expect(result.current.inputRefs.current).toBeDefined();
      expect(Array.isArray(result.current.inputRefs.current)).toBe(true);
    });
  });
});
