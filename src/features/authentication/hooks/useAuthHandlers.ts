import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { CreateUserDto, LoginDto } from '../types/api';
import { formatBirthDate } from '../utils/dateUtils';
import { AUTH_CLIENT_CONFIG } from '../constants/api';
import { FormState } from '../types/hooks';
import { useAuth } from './useAuth';
import { AUTH_MODAL_STORAGE_KEY } from '../utils';
import { normalizeEmail } from '../utils/emailValidation';

export function useAuthHandlers() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    success: false,
    errors: {},
  });

  const {
    login,
    register,
    verifyOTP,
    oAuthLogin,
    forgotPassword,
    resetPassword,
    isLoginLoading,
    isRegisterLoading,
    isForgotPasswordLoading,
    isResetPasswordLoading,
  } = useAuth();

  // Small helpers to update form state consistently
  const setLoading = (loading: boolean) =>
    setFormState((prev) => ({ ...prev, isLoading: loading }));

  const setSuccess = (success: boolean) =>
    setFormState((prev) => ({
      ...prev,
      isLoading: false,
      success,
      errors: success ? {} : prev.errors,
    }));

  const setFieldError = (field: string, message: string) =>
    setFormState((prev) => {
      const newErrors = { ...prev.errors };
      delete newErrors.forgotPasswordSuccess;
      newErrors[field] = message;

      return {
        ...prev,
        isLoading: false,
        success: false,
        message: undefined,
        errors: newErrors,
      };
    });

  const setSuccessMessage = (field: string, message: string) =>
    setFormState((prev) => ({
      ...prev,
      isLoading: false,
      success: false,
      errors: { [field]: message },
    }));

  const setMessage = (message: string) =>
    setFormState((prev) => ({
      ...prev,
      isLoading: false,
      success: true,
      message,
      errors: {},
    }));

  const handleSocialAuth = useCallback(
    async (providerId: string) => {
      try {
        setLoading(true);
        oAuthLogin(providerId, () => {
          setSuccess(true);
          localStorage.removeItem(AUTH_MODAL_STORAGE_KEY);
          setTimeout(
            () => router.push(AUTH_CLIENT_CONFIG.SUCCESS_REDIRECT),
            300
          );
        });
      } catch (error) {
        setFieldError(
          'social',
          error instanceof Error
            ? error.message
            : 'Social login failed. Please try again.'
        );
      }
    },
    [oAuthLogin, router]
  );

  const handleLogin = useCallback(
    async (data: Record<string, string>, step?: string): Promise<boolean> => {
      try {
        setLoading(true);

        // Use the step parameter to determine what action to take
        switch (step) {
          case 'email':
            // Email step - just proceed to password step
            setSuccess(true);
            return true;

          case 'password': {
            // Password step - make actual login request
            const loginData: LoginDto = {
              email: normalizeEmail(data.identifier || data.email),
              password: data.password,
            };

            await login(loginData);
            setSuccess(true);
            // Redirect after a short delay to show success state
            localStorage.removeItem(AUTH_MODAL_STORAGE_KEY);

            setTimeout(
              () => router.push(AUTH_CLIENT_CONFIG.SUCCESS_REDIRECT),
              1000
            );
            return true;
          }

          default: {
            // Fallback - make login request
            const fallbackLoginData: LoginDto = {
              email: normalizeEmail(data.identifier || data.email),
              password: data.password,
            };

            await login(fallbackLoginData);
            setSuccess(true);
            localStorage.removeItem(AUTH_MODAL_STORAGE_KEY);

            setTimeout(
              () => router.push(AUTH_CLIENT_CONFIG.SUCCESS_REDIRECT),
              1000
            );
            return true;
          }
        }
      } catch (error) {
        // Set error as 'login' for general form error display
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Invalid email or password, please try again';
        setFieldError('login', errorMessage);
        return false;
      }
    },
    [login, router]
  );

  const handleSignup = useCallback(
    async (data: Record<string, string>, step?: string): Promise<boolean> => {
      try {
        setLoading(true);

        // Use the step parameter to determine what action to take
        switch (step) {
          case 'register': {
            // Register step - just proceed to captcha
            setSuccess(true);
            return true;
          }

          case 'captcha': {
            // Captcha step - verify captcha and proceed to OTP step
            setSuccess(true);
            return true;
          }

          case 'otp': {
            // OTP verification step - verify the OTP when button is clicked
            try {
              await verifyOTP({
                email: normalizeEmail(data.email),
                otp: data.otp,
              });
              setSuccess(true);
              return true; // Success - proceed to next step
            } catch (err) {
              setFieldError(
                'otp',
                err instanceof Error
                  ? err.message
                  : 'Invalid verification code. Please check the code and try again.'
              );
              return false;
            }
          }

          case 'password': {
            console.log(data);
            const signupData: CreateUserDto = {
              name: data.name,
              email: normalizeEmail(data.email),
              password: data.password,
              birthDate: formatBirthDate(
                data.birthMonth,
                data.birthDay,
                data.birthYear
              ),
            };

            await register(signupData);
            setSuccess(true);

            // Redirect to configured success page after registration
            localStorage.removeItem(AUTH_MODAL_STORAGE_KEY);

            setTimeout(() => {
              router.push(AUTH_CLIENT_CONFIG.SUCCESS_REDIRECT);
            }, 1000); // Small delay to show success state
            return true;
          }

          default: {
            // Handle other cases
            setSuccess(true);
            return true;
          }
        }
      } catch (error) {
        setFieldError(
          'signup',
          error instanceof Error ? error.message : 'Signup failed'
        );
        return false; // Return false on any error
      }
    },
    [register, verifyOTP, router]
  );

  const handleForgotPassword = useCallback(
    async (data: Record<string, string>, step?: string): Promise<boolean> => {
      try {
        setLoading(true);

        switch (step) {
          case 'forgotPassword':
          case 'email': {
            if (!data.email) {
              setFieldError('forgotPassword', 'Email is required');
              return false;
            }
            try {
              const resp = await forgotPassword({
                email: normalizeEmail(data.email),
                type: 'WEB',
              });

              setSuccessMessage('forgotPasswordSuccess', resp.message);
              return false;
            } catch (err) {
              setFieldError(
                'forgotPassword',
                err instanceof Error
                  ? err.message
                  : 'Failed to request password reset'
              );
              return false;
            }
          }
          case 'password': {
            //TODO
            await new Promise((resolve) => setTimeout(resolve, 800));
            setSuccess(true);
            return true;
          }

          default:
            setSuccess(true);
            return true;
        }
      } catch (err) {
        setFieldError(
          'forgotPassword',
          err instanceof Error ? err.message : 'Forgot password failed'
        );
        return false;
      }
    },
    [forgotPassword]
  );

  const handleResetPassword = useCallback(
    async (payload: {
      userId: number;
      token: string;
      newPassword: string;
      email?: string;
    }): Promise<boolean> => {
      try {
        setLoading(true);
        const resp = await resetPassword({
          userId: payload.userId,
          token: payload.token,
          newPassword: payload.newPassword,
          email: payload.email,
        });

        setMessage(resp.message);
        return true;
      } catch (err) {
        setLoading(false);
        const message =
          err instanceof Error ? err.message : 'Failed to reset password';
        // Surface error as a field error for consistency
        setFieldError('resetPassword', message);
        return false;
      }
    },
    [resetPassword]
  );

  const clearFormState = useCallback((fieldName?: string) => {
    if (fieldName) {
      // Clear specific field error
      setFormState((prev) => {
        const newErrors = { ...prev.errors };
        delete newErrors[fieldName];
        return {
          ...prev,
          errors: newErrors,
        };
      });
    } else {
      // Clear all form state
      setFormState({ isLoading: false, success: false, errors: {} });
    }
  }, []);

  return {
    formState: {
      ...formState,
      isLoading:
        formState.isLoading ||
        isLoginLoading ||
        isRegisterLoading ||
        isForgotPasswordLoading ||
        isResetPasswordLoading,
    },
    handleSocialAuth,
    handleLogin,
    handleSignup,
    handleForgotPassword,
    handleResetPassword,
    clearFormState,
  };
}
