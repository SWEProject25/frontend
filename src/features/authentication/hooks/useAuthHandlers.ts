import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { CreateUserDto, LoginDto, VerifyOTPDto } from '../types/api';
import { FormState } from '../types/hooks';
import { useAuth } from './useAuth';

export function useAuthHandlers() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    success: false,
    errors: {},
  });

  const { login, register, verifyOTP, isLoginLoading, isRegisterLoading } =
    useAuth();

  const handleSocialLogin = useCallback(async (_providerId: string) => {
    try {
      setFormState((prev) => ({ ...prev, isLoading: true }));

      // TODO: Implement social login logic when backend supports it
      // providerId will be used to determine which provider (Google, GitHub, etc.)
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormState((prev) => ({ ...prev, isLoading: false, success: true }));
    } catch (_error) {
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        errors: { social: 'Social login failed. Please try again.' },
      }));
    }
  }, []);

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
              router.push('/auth-demo?login=success');
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
              router.push('/auth-demo?login=success');
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
            // Final step: complete registration
            const signupData: CreateUserDto = {
              name: data.name,
              email: data.email,
              password: data.password,
            };

            await register(signupData);
            setFormState((prev) => ({
              ...prev,
              isLoading: false,
              success: true,
            }));

            // Redirect to demo page with success message
            setTimeout(() => {
              router.push('/auth-demo?register=success');
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
    handleSocialLogin,
    handleLogin,
    handleSignup,
    handleForgotPassword,
    clearFormState,
  };
}
