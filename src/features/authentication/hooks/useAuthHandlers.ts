import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { CreateUserDto, LoginDto, VerifyOTPDto } from '../types/api';
import { formatBirthDate } from '../utils/dateUtils';
import { AUTH_CLIENT_CONFIG } from '../constants/api';
import { FormState } from '../types/hooks';
import { useAuth } from './useAuth';

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
    isLoginLoading,
    isRegisterLoading,
  } = useAuth();

  const handleSocialAuth = useCallback(
    async (providerId: string) => {
      try {
        setFormState((prev) => ({ ...prev, isLoading: true }));
        // Open popup and handle result via callback
        oAuthLogin(providerId, () => {
          // Update state to reflect successful login
          setFormState((prev) => ({
            ...prev,
            isLoading: false,
            success: true,
          }));

          // Always redirect to the demo success page after OAuth
          setTimeout(() => {
            router.push(AUTH_CLIENT_CONFIG.SUCCESS_REDIRECT);
          }, 300);
        });
      } catch (error) {
        setFormState((prev) => ({
          ...prev,
          isLoading: false,
          errors: {
            social:
              error instanceof Error
                ? error.message
                : 'Social login failed. Please try again.',
          },
        }));
      }
    },
    [oAuthLogin, router]
  );

  const handleLogin = useCallback(
    async (data: Record<string, string>, step?: string): Promise<boolean> => {
      try {
        setFormState((prev) => ({ ...prev, isLoading: true }));

        // Use the step parameter to determine what action to take
        switch (step) {
          case 'email':
            // Email step - just proceed to password step
            setFormState((prev) => ({
              ...prev,
              isLoading: false,
              success: true,
            }));
            return true;

          case 'password':
            // Password step - make actual login request
            const loginData: LoginDto = {
              email: data.identifier || data.email, // Handle both step formats
              password: data.password,
            };

            await login(loginData);
            setFormState((prev) => ({
              ...prev,
              isLoading: false,
              success: true,
            }));

            // Redirect to demo page with success message
            setTimeout(() => {
              router.push(AUTH_CLIENT_CONFIG.SUCCESS_REDIRECT);
            }, 1000); // Small delay to show success state
            return true;

          default:
            // Fallback - make login request
            const fallbackLoginData: LoginDto = {
              email: data.identifier || data.email,
              password: data.password,
            };

            await login(fallbackLoginData);
            setFormState((prev) => ({
              ...prev,
              isLoading: false,
              success: true,
            }));

            // Redirect to demo page with success message
            setTimeout(() => {
              router.push(AUTH_CLIENT_CONFIG.SUCCESS_REDIRECT);
            }, 1000);
            return true;
        }
      } catch (error) {
        // Set error as 'login' for general form error display
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Invalid email or password, please try again';
        setFormState((prev) => ({
          ...prev,
          isLoading: false,
          errors: {
            login: errorMessage,
          },
        }));
        return false;
      }
    },
    [login, router]
  );

  const handleSignup = useCallback(
    async (data: Record<string, string>, step?: string): Promise<boolean> => {
      try {
        setFormState((prev) => ({ ...prev, isLoading: true }));

        // Use the step parameter to determine what action to take
        switch (step) {
          case 'register':
            // Register step - just proceed to captcha
            setFormState((prev) => ({
              ...prev,
              isLoading: false,
              success: true,
            }));
            return true;

          case 'captcha':
            // Captcha step - just verify captcha and proceed to OTP step
            // OTP will be sent automatically when OTP step loads
            setFormState((prev) => ({
              ...prev,
              isLoading: false,
              success: true,
            }));
            return true;

          case 'otp':
            // OTP verification step - verify the OTP when button is clicked
            const verifyOtpData: VerifyOTPDto = {
              email: data.email,
              otp: data.otp,
            };

            try {
              await verifyOTP(verifyOtpData);
              setFormState((prev) => ({
                ...prev,
                isLoading: false,
                success: true,
              }));
              return true; // Success - proceed to next step
            } catch {
              // OTP verification failed - stay on OTP step and show error
              setFormState((prev) => ({
                ...prev,
                isLoading: false,
                success: false,
                errors: {
                  ...prev.errors,
                  otp: 'Invalid verification code. Please check the code and try again.',
                },
              }));
              return false; // Failure - don't proceed to next step
            }

          case 'password':
            console.log(data);
            const signupData: CreateUserDto = {
              name: data.name,
              email: data.email,
              password: data.password,
              birth_date: formatBirthDate(
                data.birthMonth,
                data.birthDay,
                data.birthYear
              ),
            };

            await register(signupData);
            setFormState((prev) => ({
              ...prev,
              isLoading: false,
              success: true,
            }));
            console.log(signupData);

            // Redirect to configured success page after registration
            setTimeout(() => {
              router.push(AUTH_CLIENT_CONFIG.SUCCESS_REDIRECT);
            }, 1000); // Small delay to show success state
            return true;

          default:
            // Handle other cases
            setFormState((prev) => ({
              ...prev,
              isLoading: false,
              success: true,
            }));
            return true;
        }
      } catch (error) {
        setFormState((prev) => ({
          ...prev,
          isLoading: false,
          errors: {
            signup: error instanceof Error ? error.message : 'Signup failed',
          },
        }));
        return false; // Return false on any error
      }
    },
    [register, verifyOTP, router]
  );

  const handleForgotPassword = useCallback(async (): Promise<boolean> => {
    try {
      setFormState((prev) => ({ ...prev, isLoading: true }));

      // TODO: Implement forgot password logic when backend supports it
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormState((prev) => ({ ...prev, isLoading: false, success: true }));
      return true;
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        errors: {
          forgotPassword:
            error instanceof Error ? error.message : 'Password reset failed',
        },
      }));
      return false;
    }
  }, []);

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
      isLoading: formState.isLoading || isLoginLoading || isRegisterLoading,
    },
    handleSocialAuth,
    handleLogin,
    handleSignup,
    handleForgotPassword,
    clearFormState,
  };
}
