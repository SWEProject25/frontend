'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthButton } from '@/components/ui/AuthButton';
import { Divider } from '@/components/ui/Divider';
import {
  GoogleIcon,
  AppleIcon,
  GrokIcon,
  FacebookIcon,
  GitHubIcon,
  XLogo,
} from '@/components/ui/icons';

export function AuthButtonsDemo() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleButtonClick = (buttonName: string) => {
    setLoading(buttonName);
    setTimeout(() => setLoading(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <XLogo className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Button Components Demo
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore all button variants with different states, sizes, and use
            cases. All buttons follow X/Twitter design patterns and are fully
            interactive.
          </p>
        </div>

        {/* Social Login Buttons Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Social Login Buttons
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <AuthButton
              variant="social"
              size="lg"
              icon={<GoogleIcon className="w-5 h-5" />}
              className="w-full"
              onClick={() => handleButtonClick('google')}
              loading={loading === 'google'}
            >
              Sign in with Google
            </AuthButton>

            <AuthButton
              variant="social"
              size="lg"
              icon={<AppleIcon className="w-5 h-5" />}
              className="w-full"
              onClick={() => handleButtonClick('apple')}
              loading={loading === 'apple'}
            >
              Sign in with Apple
            </AuthButton>

            <AuthButton
              variant="social"
              size="lg"
              icon={<GrokIcon className="w-5 h-5" />}
              className="w-full"
              onClick={() => handleButtonClick('grok')}
              loading={loading === 'grok'}
            >
              Sign in with Grok
            </AuthButton>

            <AuthButton
              variant="social"
              size="lg"
              icon={<FacebookIcon className="w-5 h-5" />}
              className="w-full"
              onClick={() => handleButtonClick('facebook')}
              loading={loading === 'facebook'}
            >
              Sign in with Facebook
            </AuthButton>

            <AuthButton
              variant="social"
              size="lg"
              icon={<GitHubIcon className="w-5 h-5" />}
              className="w-full"
              onClick={() => handleButtonClick('github')}
              loading={loading === 'github'}
            >
              Sign in with GitHub
            </AuthButton>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Primary Buttons Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Primary Buttons
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <AuthButton
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => handleButtonClick('primary-lg')}
              loading={loading === 'primary-lg'}
            >
              Create Account
            </AuthButton>

            <AuthButton
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => handleButtonClick('primary-md')}
              loading={loading === 'primary-md'}
            >
              Sign In
            </AuthButton>

            <AuthButton
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => handleButtonClick('primary-sm')}
              loading={loading === 'primary-sm'}
            >
              Continue
            </AuthButton>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Secondary Buttons Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Secondary Buttons
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <AuthButton
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => handleButtonClick('secondary-lg')}
              loading={loading === 'secondary-lg'}
            >
              Learn More
            </AuthButton>

            <AuthButton
              variant="secondary"
              size="md"
              className="w-full"
              onClick={() => handleButtonClick('secondary-md')}
              loading={loading === 'secondary-md'}
            >
              Get Started
            </AuthButton>

            <AuthButton
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => handleButtonClick('secondary-sm')}
              loading={loading === 'secondary-sm'}
            >
              Explore
            </AuthButton>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Outline Buttons Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Outline Buttons
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <AuthButton
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => handleButtonClick('outline-lg')}
              loading={loading === 'outline-lg'}
            >
              View Profile
            </AuthButton>

            <AuthButton
              variant="outline"
              size="md"
              className="w-full"
              onClick={() => handleButtonClick('outline-md')}
              loading={loading === 'outline-md'}
            >
              Edit Settings
            </AuthButton>

            <AuthButton
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleButtonClick('outline-sm')}
              loading={loading === 'outline-sm'}
            >
              Share
            </AuthButton>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Ghost Buttons Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Ghost Buttons
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <AuthButton
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={() => handleButtonClick('ghost-lg')}
              loading={loading === 'ghost-lg'}
            >
              Follow
            </AuthButton>

            <AuthButton
              variant="ghost"
              size="md"
              className="w-full"
              onClick={() => handleButtonClick('ghost-md')}
              loading={loading === 'ghost-md'}
            >
              Message
            </AuthButton>

            <AuthButton
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => handleButtonClick('ghost-sm')}
              loading={loading === 'ghost-sm'}
            >
              Like
            </AuthButton>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Button States Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Button States
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <AuthButton variant="primary" size="lg" className="w-full" disabled>
              Disabled Button
            </AuthButton>

            <AuthButton
              variant="primary"
              size="lg"
              className="w-full"
              loading={true}
            >
              Loading Button
            </AuthButton>

            <AuthButton
              variant="primary"
              size="lg"
              className="w-full"
              icon={<XLogo className="w-5 h-5" />}
              onClick={() => handleButtonClick('with-icon')}
              loading={loading === 'with-icon'}
            >
              Button with Icon
            </AuthButton>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Usage Examples
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-white font-semibold mb-4">Form Actions</h3>
                <div className="space-y-3">
                  <AuthButton
                    variant="primary"
                    size="lg"
                    className="w-full"
                    type="submit"
                    onClick={() => handleButtonClick('submit')}
                    loading={loading === 'submit'}
                  >
                    Submit Form
                  </AuthButton>
                  <AuthButton
                    variant="outline"
                    size="lg"
                    className="w-full"
                    type="button"
                    onClick={() => handleButtonClick('cancel')}
                    loading={loading === 'cancel'}
                  >
                    Cancel
                  </AuthButton>
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-white font-semibold mb-4">
                  Social Actions
                </h3>
                <div className="space-y-3">
                  <AuthButton
                    variant="ghost"
                    size="md"
                    className="w-full"
                    onClick={() => handleButtonClick('follow')}
                    loading={loading === 'follow'}
                  >
                    Follow @username
                  </AuthButton>
                  <AuthButton
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={() => handleButtonClick('message')}
                    loading={loading === 'message'}
                  >
                    Send Message
                  </AuthButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/demo"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Demos
            </Link>
            <Link
              href="/demo/buttons"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Buttons Home
            </Link>
            <Link
              href="/demo/buttons/general"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← General Buttons
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
