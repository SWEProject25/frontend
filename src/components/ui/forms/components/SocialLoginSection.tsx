import React from 'react';
import { AuthButton } from '@/components/ui/AuthButton';
import { Divider } from '@/components/ui/Divider';
import { SocialLoginSectionProps } from '../types';

export function SocialLoginSection({
  socialProviders,
  showDivider,
  loading,
  onSocialLogin,
}: Readonly<SocialLoginSectionProps>) {
  if (socialProviders.length === 0) {
    return null;
  }

  return (
    <>
      {/* Social Login Buttons */}
      <div className="space-y-3 mb-6">
        {socialProviders.map((provider) => (
          <AuthButton
            key={provider.id}
            variant="social"
            size="lg"
            icon={provider.icon}
            className="w-full"
            onClick={() => onSocialLogin(provider.id)}
            disabled={loading}
          >
            {provider.name}
          </AuthButton>
        ))}
      </div>

      {/* Divider */}
      {showDivider && <Divider text="or" className="mb-6" />}
    </>
  );
}
