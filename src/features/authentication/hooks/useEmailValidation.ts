'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AUTH_API_CONFIG, AUTH_ENDPOINTS } from '../constants/api';

interface EmailValidationState {
  isValidating: boolean;
  error: string | undefined;
  isValid: boolean;
}

interface UseEmailValidationOptions {
  onValidationChange?: (isValid: boolean, error?: string) => void;
}

const API_BASE_URL = AUTH_API_CONFIG.BASE_URL;

export function useEmailValidation({
  onValidationChange,
}: UseEmailValidationOptions = {}) {
  const [validationState, setValidationState] = useState<EmailValidationState>({
    isValidating: false,
    error: undefined,
    isValid: true,
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Email regex validation
  const isValidEmailFormat = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  // Email validation function
  const validateEmail = useCallback(
    async (email: string) => {
      if (!email) {
        setValidationState({
          isValidating: false,
          error: undefined,
          isValid: true,
        });
        onValidationChange?.(true);
        return;
      }

      // Check email format first
      if (!isValidEmailFormat(email)) {
        setValidationState({
          isValidating: false,
          error: 'Please enter a valid email.',
          isValid: false,
        });
        onValidationChange?.(false, 'Please enter a valid email.');
        return;
      }

      // Check if email is already taken
      setValidationState((prev) => ({
        ...prev,
        isValidating: true,
        error: undefined,
      }));

      try {
        const response = await fetch(
          `${API_BASE_URL}${AUTH_ENDPOINTS.CHECK_EMAIL}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          }
        );

        if (response.ok) {
          setValidationState({
            isValidating: false,
            error: undefined,
            isValid: true,
          });
          onValidationChange?.(true);
        } else if (response.status === 409) {
          setValidationState({
            isValidating: false,
            error: 'Email has already been taken.',
            isValid: false,
          });
          onValidationChange?.(false, 'Email has already been taken.');
        } else {
          // API error - don't show error, just don't validate
          setValidationState({
            isValidating: false,
            error: undefined,
            isValid: true,
          });
          onValidationChange?.(true);
        }
      } catch (error) {
        console.error('Email validation error:', error);
        // Network error - don't show error, just don't validate
        setValidationState({
          isValidating: false,
          error: undefined,
          isValid: true,
        });
        onValidationChange?.(true);
      }
    },
    [onValidationChange, isValidEmailFormat]
  );

  // Debounced validation
  const validateWithDebounce = useCallback(
    (email: string, debounceMs: number = 500) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        validateEmail(email);
      }, debounceMs);
    },
    [validateEmail]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    ...validationState,
    validateWithDebounce,
  };
}
