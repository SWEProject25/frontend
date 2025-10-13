'use client';

import { GenericAuthForm, authFormConfigs } from '@/components/ui/forms';

export default function LoginPage() {
  const handleLogin = async (data: Record<string, string>) => {
    console.log('Login data:', data);
    // TODO: Implement actual login logic
  };

  const handleSocialLogin = (providerId: string) => {
    console.log('Social login:', providerId);
    // TODO: Implement social login logic
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    // TODO: Navigate to forgot password page or show modal
  };

  return (
    <GenericAuthForm
      {...authFormConfigs.login}
      onSubmit={handleLogin}
      onSocialLogin={handleSocialLogin}
      onForgotPassword={handleForgotPassword}
      mode="fullpage"
    />
  );
}
