import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';
import { LoginDto, CreateUserDto } from '../types/api';
import { FormState } from '../types/hooks';

export function useAuthHandlers() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const {
    login,
    register,
    isLoginLoading,
    isRegisterLoading,
    error: authError,
  } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSocialLogin = useCallback(async (providerId: string) => {
    try {
      setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

      // TODO: Implement social login logic when backend supports it
      // providerId will be used to determine which provider (Google, GitHub, etc.)
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormState((prev) => ({ ...prev, isLoading: false, success: true }));
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Social login failed',
      }));
    }
  }, []);

  const handleLogin = useCallback(
    async (data: Record<string, string>) => {
      try {
        setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

        // MultiStepForm handles step transitions internally
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
      } catch (error) {
        setFormState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            authError ||
            (error instanceof Error ? error.message : 'Login failed'),
        }));
      }
    },
    [login, authError, router]
  );

  const handleSignup = useCallback(
    async (data: Record<string, string>) => {
      try {
        setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

        const signupData: CreateUserDto = {
          name: data.name,
          email: data.email,
          password: data.password,
        };

        await register(signupData);
        setFormState((prev) => ({ ...prev, isLoading: false, success: true }));

        // Redirect to demo page with success message
        setTimeout(() => {
          router.push('/auth-demo?register=success');
        }, 1000); // Small delay to show success state
      } catch (error) {
        setFormState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            authError ||
            (error instanceof Error ? error.message : 'Signup failed'),
        }));
      }
    },
    [register, authError, router]
  );

  const handleForgotPassword = useCallback(async () => {
    try {
      setFormState((prev) => ({ ...prev, isLoading: true, error: null }));

      // TODO: Implement forgot password logic when backend supports it
      // For now, just simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormState((prev) => ({ ...prev, isLoading: false, success: true }));
    } catch (error) {
      setFormState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Password reset failed',
      }));
    }
  }, []);

  const clearFormState = useCallback(() => {
    setFormState({ isLoading: false, error: null, success: false });
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
