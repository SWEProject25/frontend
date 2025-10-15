'use client';

import { GenericAuthForm, authFormConfigs } from '@/components/ui/forms';

export default function RegisterPage() {
  const handleRegister = async (data: Record<string, string>) => {
    console.log('Register data:', data);
    // TODO: Implement actual registration logic
  };

  const handleSocialLogin = (providerId: string) => {
    console.log('Social login:', providerId);
    // TODO: Implement social login logic
  };

  return (
    <GenericAuthForm
      {...authFormConfigs.register}
      onSubmit={handleRegister}
      onSocialLogin={handleSocialLogin}
      mode="fullpage"
    />
  );
}
