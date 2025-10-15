'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AUTH_API_CONFIG } from '@/features/authentication/constants/api';
import { UseValidationOptions, ValidationState } from './types/validation';

const API_BASE_URL = AUTH_API_CONFIG.BASE_URL || 'http://localhost:5000';

export function useValidation({
  rules,
  onValidationChange,
}: UseValidationOptions) {
  const [validationState, setValidationState] = useState<ValidationState>({
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

  // Generic validation function
  const validateValue = useCallback(
    async (value: string) => {
      if (!value) {
        setValidationState({
          isValidating: false,
          error: undefined,
          isValid: true,
        });
        onValidationChange?.(true);
        return;
      }

      // Check local validation rules first
      for (const rule of rules) {
        if (rule.type === 'email') {
          if (!isValidEmailFormat(value)) {
            setValidationState({
              isValidating: false,
              error: rule.message,
              isValid: false,
            });
            onValidationChange?.(false, rule.message);
            return;
          }
        } else if (rule.type === 'custom' && rule.validator) {
          if (!rule.validator(value)) {
            setValidationState({
              isValidating: false,
              error: rule.message,
              isValid: false,
            });
            onValidationChange?.(false, rule.message);
            return;
          }
        }
      }

      // If local validation passes, check API validation
      const apiRule = rules.find((rule) => rule.apiEndpoint);
      if (apiRule?.apiEndpoint) {
        setValidationState((prev) => ({
          ...prev,
          isValidating: true,
          error: undefined,
        }));

        try {
          const response = await fetch(
            `${API_BASE_URL}${apiRule.apiEndpoint}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: value }),
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
              error: apiRule.message,
              isValid: false,
            });
            onValidationChange?.(false, apiRule.message);
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
          console.error('Validation error:', error);
          // Network error - don't show error, just don't validate
          setValidationState({
            isValidating: false,
            error: undefined,
            isValid: true,
          });
          onValidationChange?.(true);
        }
      } else {
        // No API validation needed
        setValidationState({
          isValidating: false,
          error: undefined,
          isValid: true,
        });
        onValidationChange?.(true);
      }
    },
    [rules, onValidationChange, isValidEmailFormat]
  );

  // Debounced validation
  const validateWithDebounce = useCallback(
    (value: string, debounceMs: number = 500) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        validateValue(value);
      }, debounceMs);
    },
    [validateValue]
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
