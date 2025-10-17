'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { XLogo } from '@/components/ui/icons';

export function ButtonsDemo() {
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
            General Button Components
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore all button variants including primary, secondary, outline,
            and ghost buttons with different states and sizes.
          </p>
        </div>

        {/* Primary Buttons Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Primary Buttons
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => handleButtonClick('primary-lg')}
              loading={loading === 'primary-lg'}
            >
              Large Primary Button
            </Button>

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => handleButtonClick('primary-md')}
              loading={loading === 'primary-md'}
            >
              Medium Primary Button
            </Button>

            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => handleButtonClick('primary-sm')}
              loading={loading === 'primary-sm'}
            >
              Small Primary Button
            </Button>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Secondary Buttons Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Secondary Buttons
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => handleButtonClick('secondary-lg')}
              loading={loading === 'secondary-lg'}
            >
              Large Secondary Button
            </Button>

            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => handleButtonClick('secondary-md')}
              loading={loading === 'secondary-md'}
            >
              Medium Secondary Button
            </Button>

            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={() => handleButtonClick('secondary-sm')}
              loading={loading === 'secondary-sm'}
            >
              Small Secondary Button
            </Button>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Outline Buttons Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Outline Buttons
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={() => handleButtonClick('outline-lg')}
              loading={loading === 'outline-lg'}
            >
              Large Outline Button
            </Button>

            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => handleButtonClick('outline-md')}
              loading={loading === 'outline-md'}
            >
              Medium Outline Button
            </Button>

            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => handleButtonClick('outline-sm')}
              loading={loading === 'outline-sm'}
            >
              Small Outline Button
            </Button>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Ghost Buttons Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Ghost Buttons
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={() => handleButtonClick('ghost-lg')}
              loading={loading === 'ghost-lg'}
            >
              Large Ghost Button
            </Button>

            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => handleButtonClick('ghost-md')}
              loading={loading === 'ghost-md'}
            >
              Medium Ghost Button
            </Button>

            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => handleButtonClick('ghost-sm')}
              loading={loading === 'ghost-sm'}
            >
              Small Ghost Button
            </Button>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Button States Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Button States
          </h2>
          <div className="max-w-md mx-auto space-y-4">
            <Button variant="primary" size="lg" fullWidth>
              Normal State
            </Button>

            <Button variant="primary" size="lg" fullWidth disabled>
              Disabled State
            </Button>

            <Button variant="primary" size="lg" fullWidth loading={true}>
              Loading State
            </Button>
          </div>
        </div>

        <Divider className="my-12" />

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
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => handleButtonClick('save')}
                    loading={loading === 'save'}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={() => handleButtonClick('cancel')}
                    loading={loading === 'cancel'}
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-white font-semibold mb-4">
                  Multiple Buttons
                </h3>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleButtonClick('yes')}
                    loading={loading === 'yes'}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => handleButtonClick('no')}
                    loading={loading === 'no'}
                  >
                    No
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => handleButtonClick('maybe')}
                    loading={loading === 'maybe'}
                  >
                    Maybe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="/demo"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Demos
            </a>
            <a
              href="/demo/buttons"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Buttons Home
            </a>
            <a
              href="/demo/buttons/auth"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Auth Buttons →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
