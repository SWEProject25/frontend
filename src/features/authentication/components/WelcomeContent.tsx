'use client';

import { AuthButton } from '@/components/ui/AuthButton';
import { Divider } from '@/components/ui/Divider';
import { GoogleIcon, GitHubIcon } from '@/components/ui/icons';
import { useAuthHandlers } from '../hooks';
import { WelcomeContentProps } from '../types';
import { SOCIAL_PROVIDERS } from '../constants';

export function WelcomeContent({
  onCreateAccount,
  onLogin,
}: WelcomeContentProps) {
  const { handleSocialAuth } = useAuthHandlers();

  return (
    <div className="space-y-12">
      {/* Main Title */}
      <div>
        <h1 className="text-6xl font-bold text-foreground mb-12">
          Happening now
        </h1>
      </div>

      {/* Signup Section */}
      <div className="space-y-5">
        <h2 className="text-3xl font-bold text-foreground">Join today.</h2>

        {/* Social Signup Buttons */}
        <div className="space-y-3">
          <AuthButton
            variant="social"
            size="lg"
            icon={<GoogleIcon />}
            className="w-full"
            onClick={() => handleSocialAuth(SOCIAL_PROVIDERS.GOOGLE)}
          >
            Sign up with Google
          </AuthButton>

          <AuthButton
            variant="social"
            size="lg"
            icon={<GitHubIcon />}
            className="w-full"
            onClick={() => handleSocialAuth(SOCIAL_PROVIDERS.GITHUB)}
          >
            Sign up with GitHub
          </AuthButton>
        </div>

        <Divider text="or" />

        {/* Create Account Button */}
        <AuthButton
          variant="primary"
          size="lg"
          className="w-full"
          onClick={onCreateAccount}
        >
          Create account
        </AuthButton>

        {/* Legal Text */}
        <p className="text-xs text-text-inactive">
          By signing up, you agree to the{' '}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
          , including{' '}
          <a href="#" className="text-primary hover:underline">
            Cookie Use
          </a>
          .
        </p>
      </div>

      {/* Login Section */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-foreground">
          Already have an account?
        </h3>

        <div className="space-y-3">
          <AuthButton
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onLogin}
          >
            Sign in
          </AuthButton>
        </div>
      </div>
    </div>
  );
}
