import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuthModals } from '../hooks/useAuthModals';
import { AUTH_MODAL_TYPES } from '../constants';
import * as utils from '../utils';

// Mock utility functions
vi.mock('../utils', async () => {
  const actual = await vi.importActual('../utils');
  return {
    ...actual,
    isMobileScreen: vi.fn(),
    getModalType: vi.fn((activeModal) => activeModal),
    getFullScreenFormType: vi.fn((activeModal, isMobile) =>
      isMobile ? activeModal : null
    ),
    isValidModalType: vi.fn((type) =>
      Object.values(AUTH_MODAL_TYPES).includes(type)
    ),
    AUTH_MODAL_STORAGE_KEY: 'auth-modal-type',
  };
});

describe('useAuthModals', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(utils.isMobileScreen).mockReturnValue(false);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Initialization', () => {
    it('should initialize with no active modal', () => {
      const { result } = renderHook(() => useAuthModals());

      expect(result.current.modalType).toBe(null);
      expect(result.current.isMobile).toBe(false);
    });

    it('should restore modal from localStorage on mount', async () => {
      localStorage.setItem('auth-modal-type', AUTH_MODAL_TYPES.SIGNUP);
      vi.mocked(utils.isValidModalType).mockReturnValue(true);

      const { result } = renderHook(() => useAuthModals());

      await waitFor(() => {
        expect(result.current.modalType).toBe(AUTH_MODAL_TYPES.SIGNUP);
      });
    });

    it('should not restore invalid modal type from localStorage', () => {
      localStorage.setItem('auth-modal-type', 'invalid-type');
      vi.mocked(utils.isValidModalType).mockReturnValue(false);

      const { result } = renderHook(() => useAuthModals());

      expect(result.current.modalType).toBe(null);
    });

    it('should detect mobile screen size', () => {
      vi.mocked(utils.isMobileScreen).mockReturnValue(true);

      const { result } = renderHook(() => useAuthModals());

      expect(result.current.isMobile).toBe(true);
    });
  });

  describe('openModal', () => {
    it('should open login modal', () => {
      const { result } = renderHook(() => useAuthModals());

      act(() => {
        result.current.openModal(AUTH_MODAL_TYPES.LOGIN);
      });

      expect(result.current.modalType).toBe(AUTH_MODAL_TYPES.LOGIN);
      expect(localStorage.getItem('auth-modal-type')).toBe(
        AUTH_MODAL_TYPES.LOGIN
      );
    });

    it('should open signup modal', () => {
      const { result } = renderHook(() => useAuthModals());

      act(() => {
        result.current.openModal(AUTH_MODAL_TYPES.SIGNUP);
      });

      expect(result.current.modalType).toBe(AUTH_MODAL_TYPES.SIGNUP);
      expect(localStorage.getItem('auth-modal-type')).toBe(
        AUTH_MODAL_TYPES.SIGNUP
      );
    });

    it('should open forgot password modal', () => {
      const { result } = renderHook(() => useAuthModals());

      act(() => {
        result.current.openModal(AUTH_MODAL_TYPES.FORGOT_PASSWORD);
      });

      expect(result.current.modalType).toBe(AUTH_MODAL_TYPES.FORGOT_PASSWORD);
    });
  });

  describe('closeModal', () => {
    it('should close active modal', () => {
      const { result } = renderHook(() => useAuthModals());

      // Open a modal first
      act(() => {
        result.current.openModal(AUTH_MODAL_TYPES.LOGIN);
      });

      expect(result.current.modalType).toBe(AUTH_MODAL_TYPES.LOGIN);

      // Close it
      act(() => {
        result.current.closeModal();
      });

      expect(result.current.modalType).toBe(null);
      expect(localStorage.getItem('auth-modal-type')).toBe(null);
    });

    it('should remove from localStorage when closing', () => {
      const { result } = renderHook(() => useAuthModals());

      act(() => {
        result.current.openModal(AUTH_MODAL_TYPES.SIGNUP);
      });

      expect(localStorage.getItem('auth-modal-type')).toBe(
        AUTH_MODAL_TYPES.SIGNUP
      );

      act(() => {
        result.current.closeModal();
      });

      expect(localStorage.getItem('auth-modal-type')).toBe(null);
    });
  });

  describe('switchModal', () => {
    it('should switch from login to signup', () => {
      const { result } = renderHook(() => useAuthModals());

      act(() => {
        result.current.openModal(AUTH_MODAL_TYPES.LOGIN);
      });

      act(() => {
        result.current.switchModal(AUTH_MODAL_TYPES.SIGNUP);
      });

      expect(result.current.modalType).toBe(AUTH_MODAL_TYPES.SIGNUP);
      expect(localStorage.getItem('auth-modal-type')).toBe(
        AUTH_MODAL_TYPES.SIGNUP
      );
    });

    it('should switch from signup to login', () => {
      const { result } = renderHook(() => useAuthModals());

      act(() => {
        result.current.openModal(AUTH_MODAL_TYPES.SIGNUP);
      });

      act(() => {
        result.current.switchModal(AUTH_MODAL_TYPES.LOGIN);
      });

      expect(result.current.modalType).toBe(AUTH_MODAL_TYPES.LOGIN);
    });

    it('should update localStorage when switching', () => {
      const { result } = renderHook(() => useAuthModals());

      act(() => {
        result.current.openModal(AUTH_MODAL_TYPES.LOGIN);
      });

      act(() => {
        result.current.switchModal(AUTH_MODAL_TYPES.FORGOT_PASSWORD);
      });

      expect(localStorage.getItem('auth-modal-type')).toBe(
        AUTH_MODAL_TYPES.FORGOT_PASSWORD
      );
    });
  });

  describe('closeFullScreenForm', () => {
    it('should close full screen form (alias for closeModal)', () => {
      const { result } = renderHook(() => useAuthModals());

      act(() => {
        result.current.openModal(AUTH_MODAL_TYPES.LOGIN);
      });

      act(() => {
        result.current.closeFullScreenForm();
      });

      expect(result.current.modalType).toBe(null);
    });
  });

  describe('showFullScreenForm', () => {
    it('should show full screen form on mobile', () => {
      vi.mocked(utils.isMobileScreen).mockReturnValue(true);
      vi.mocked(utils.getFullScreenFormType).mockReturnValue(
        AUTH_MODAL_TYPES.LOGIN
      );

      const { result } = renderHook(() => useAuthModals());

      act(() => {
        result.current.openModal(AUTH_MODAL_TYPES.LOGIN);
      });

      expect(result.current.showFullScreenForm).toBe(AUTH_MODAL_TYPES.LOGIN);
    });

    it('should not show full screen form on desktop', () => {
      vi.mocked(utils.isMobileScreen).mockReturnValue(false);
      vi.mocked(utils.getFullScreenFormType).mockReturnValue(null);

      const { result } = renderHook(() => useAuthModals());

      act(() => {
        result.current.openModal(AUTH_MODAL_TYPES.LOGIN);
      });

      expect(result.current.showFullScreenForm).toBe(null);
    });
  });

  describe('Responsive behavior', () => {
    it('should update isMobile on window resize', () => {
      vi.mocked(utils.isMobileScreen)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      const { result } = renderHook(() => useAuthModals());

      expect(result.current.isMobile).toBe(false);

      // Simulate window resize
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current.isMobile).toBe(true);
    });

    it('should clean up resize event listener', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = renderHook(() => useAuthModals());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'resize',
        expect.any(Function)
      );
    });
  });

  describe('Integration', () => {
    it('should handle complete modal lifecycle', () => {
      const { result } = renderHook(() => useAuthModals());

      // Start with no modal
      expect(result.current.modalType).toBe(null);

      // Open login modal
      act(() => {
        result.current.openModal(AUTH_MODAL_TYPES.LOGIN);
      });
      expect(result.current.modalType).toBe(AUTH_MODAL_TYPES.LOGIN);

      // Switch to signup
      act(() => {
        result.current.switchModal(AUTH_MODAL_TYPES.SIGNUP);
      });
      expect(result.current.modalType).toBe(AUTH_MODAL_TYPES.SIGNUP);

      // Close modal
      act(() => {
        result.current.closeModal();
      });
      expect(result.current.modalType).toBe(null);
    });
  });
});
