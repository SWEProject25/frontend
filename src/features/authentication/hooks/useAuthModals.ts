import { useState, useEffect } from 'react';
import { AUTH_MODAL_TYPES } from '../constants';
import {
  isMobileScreen,
  getModalType,
  getFullScreenFormType,
  AUTH_MODAL_STORAGE_KEY,
  isValidModalType,
} from '../utils';

export type AuthModalType =
  (typeof AUTH_MODAL_TYPES)[keyof typeof AUTH_MODAL_TYPES];

export function useAuthModals() {
  const [activeModal, setActiveModal] = useState<AuthModalType | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_MODAL_STORAGE_KEY);
    if (raw && isValidModalType(raw)) {
      setActiveModal(raw as AuthModalType);
    }
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(isMobileScreen());
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Simplified handlers
  const openModal = (type: AuthModalType) => {
    setActiveModal(type);
    localStorage.setItem(AUTH_MODAL_STORAGE_KEY, type);
  };

  const closeModal = () => {
    setActiveModal(null);
    localStorage.removeItem(AUTH_MODAL_STORAGE_KEY);
  };

  const switchModal = (newType: AuthModalType) => {
    setActiveModal(newType);
    localStorage.setItem(AUTH_MODAL_STORAGE_KEY, newType);
  };

  return {
    modalType: getModalType(activeModal),
    showFullScreenForm: getFullScreenFormType(activeModal, isMobile),
    isMobile,
    openModal,
    closeModal,
    closeFullScreenForm: closeModal,
    switchModal,
  };
}
