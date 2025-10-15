'use client';

import React, { useState, useEffect } from 'react';
import { CaptchaComponentProps } from '../types/components';
import {
  generateCaptchaText,
  validateCaptcha,
} from '@/features/authentication/utils';
import { CAPTCHA_CONSTANTS } from '../constants';

export function CaptchaComponent({ onVerify }: CaptchaComponentProps) {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Generate random captcha text
  const generateCaptcha = () => {
    const result = generateCaptchaText();
    setCaptchaText(result);
    setUserInput('');
    setIsValid(false);
  };

  useEffect(() => {
    // Ensure we're on the client side before generating captcha
    setIsClient(true);
    generateCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setUserInput(value);
    const valid = validateCaptcha(value, captchaText);
    setIsValid(valid);
    onVerify(valid);
  };

  // Don't render until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-gray-800 tracking-wider mb-2">
              Loading...
            </div>
            <p className="text-sm text-gray-600">
              Enter the code above to verify you&apos;re human
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            disabled
            className="text-sm text-gray-400 underline cursor-not-allowed"
          >
            Refresh Captcha
          </button>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Enter the code
          </label>
          <input
            type="text"
            disabled
            placeholder="Loading..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Captcha Display */}
      <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-gray-800 tracking-wider mb-2">
            {captchaText}
          </div>
          <p className="text-sm text-gray-600">
            Enter the code above to verify you&apos;re human
          </p>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={generateCaptcha}
          className="text-sm text-blue-500 hover:text-blue-700 underline"
        >
          Refresh Captcha
        </button>
      </div>

      {/* Input Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Enter the code
        </label>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Enter the code above"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            userInput && !isValid
              ? 'border-red-500 focus:ring-red-500'
              : isValid
                ? 'border-green-500 focus:ring-green-500'
                : 'border-gray-300'
          }`}
          maxLength={CAPTCHA_CONSTANTS.LENGTH}
        />
        {userInput && !isValid && (
          <p className="text-sm text-red-500">Code doesn&apos;t match</p>
        )}
        {isValid && <p className="text-sm text-green-500">✓ Code verified</p>}
      </div>
    </div>
  );
}
