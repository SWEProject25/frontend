import { useState, useEffect, useRef, useCallback } from 'react';
import type ReCAPTCHA from 'react-google-recaptcha';
import { authApi } from '../services/authApi';
import { RECAPTCHA_CONFIG } from '../constants';

export interface UseCaptchaProps {
  onVerify: (isVerified: boolean) => void;
}

export interface UseCaptchaReturn {
  recaptchaRef: React.RefObject<ReCAPTCHA | null>;
  isClient: boolean;
  isVerifying: boolean;
  isRecaptchaLoaded: boolean;
  error: string | null;
  siteKey: string | undefined;
  handleCaptchaChange: (token: string | null) => Promise<void>;
  handleCaptchaLoad: () => void;
  handleCaptchaExpired: () => void;
  handleCaptchaError: () => void;
}

/**
 * Custom hook to manage reCAPTCHA logic
 * Handles verification, loading states, and error handling
 */
export function useCaptcha({ onVerify }: UseCaptchaProps): UseCaptchaReturn {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isClient, setIsClient] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);

  const siteKey = RECAPTCHA_CONFIG.SITE_KEY;

  // Set client-side hydration flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCaptchaChange = useCallback(
    async (token: string | null) => {
      if (!token) {
        setError(null);
        onVerify(false);
        return;
      }

      try {
        setIsVerifying(true);
        setError(null);

        const response = await authApi.verifyRecaptcha({ recaptcha: token });

        // Handle 200 status - Human verification successful
        if (response.status === 'success') {
          setError(null);
          onVerify(true);
        } else {
          // Handle any other status as failure
          setError(
            response.message || RECAPTCHA_CONFIG.ERRORS.VERIFICATION_FAILED
          );
          onVerify(false);
          recaptchaRef.current?.reset();
        }
      } catch (err) {
        // Handle 400 status - reCAPTCHA verification failed
        const errorMessage =
          err instanceof Error
            ? err.message
            : RECAPTCHA_CONFIG.ERRORS.VERIFICATION_FAILED;

        setError(errorMessage);
        onVerify(false);
        recaptchaRef.current?.reset();
      } finally {
        setIsVerifying(false);
      }
    },
    [onVerify]
  );

  const handleCaptchaLoad = useCallback(() => {
    setIsRecaptchaLoaded(true);
  }, []);

  const handleCaptchaExpired = useCallback(() => {
    setError(RECAPTCHA_CONFIG.ERRORS.EXPIRED);
    onVerify(false);
  }, [onVerify]);

  const handleCaptchaError = useCallback(() => {
    setError(RECAPTCHA_CONFIG.ERRORS.ERROR);
    onVerify(false);
  }, [onVerify]);

  return {
    recaptchaRef,
    isClient,
    isVerifying,
    isRecaptchaLoaded,
    error,
    siteKey,
    handleCaptchaChange,
    handleCaptchaLoad,
    handleCaptchaExpired,
    handleCaptchaError,
  };
}
