'use client';

import React, { useState } from 'react';
import { InputField } from '@/components/ui/input';
import { SelectField } from '@/components/ui/SelectField';
import { Divider } from '@/components/ui/Divider';
import { XLogo, EyeIcon } from '@/components/ui/icons';

export function InputFieldsDemo() {
  const [formData, setFormData] = useState({
    basic: '',
    email: '',
    password: '',
    withIcon: '',
    withCounter: '',
    withError: '',
    disabled: 'This field is disabled',
    required: '',
    withPlaceholder: '',
    maxLengthField: '',
    number: '',
    tel: '',
    url: '',
  });

  const [selectData, setSelectData] = useState({
    basic: '',
    withError: '',
    required: '',
    disabled: 'option2',
  });

  const [errors, setErrors] = useState({
    withError: 'This field has an error message',
    required: '',
    email: '',
    selectWithError: 'Please select a valid option',
  });

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Clear error when user starts typing
      if (errors[field as keyof typeof errors]) {
        setErrors((prev) => ({
          ...prev,
          [field]: '',
        }));
      }
    };

  const handleSelectChange =
    (field: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));

      // Clear error when user selects
      if (errors[`select${field}` as keyof typeof errors]) {
        setErrors((prev) => ({
          ...prev,
          [`select${field}`]: '',
        }));
      }
    };

  const handleBlur = (field: string) => () => {
    // Simple validation examples
    if (field === 'email' && formData.email && !formData.email.includes('@')) {
      setErrors((prev) => ({
        ...prev,
        email: 'Please enter a valid email',
      }));
    }
  };

  const selectOptions = [
    { value: '', label: 'Select an option' },
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const countryOptions = [
    { value: '', label: 'Select a country' },
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
  ];

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <XLogo className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Input Components Demo
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore all input field variants including floating labels,
            validation states, character counters, and different input types.
            All components are fully interactive.
          </p>
        </div>

        {/* Basic Input Fields */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Basic Input Fields
          </h2>
          <div className="max-w-md mx-auto space-y-6">
            <InputField
              label="Basic Text Field"
              type="text"
              value={formData.basic}
              onChange={handleInputChange('basic')}
            />

            <InputField
              label="Email Field"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              onBlur={handleBlur('email')}
              error={errors.email}
            />

            <InputField
              label="Password Field"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              showPasswordToggle
            />

            <InputField
              label="Number Field"
              type="number"
              value={formData.number}
              onChange={handleInputChange('number')}
            />

            <InputField
              label="Phone Number"
              type="tel"
              value={formData.tel}
              onChange={handleInputChange('tel')}
            />

            <InputField
              label="Website URL"
              type="url"
              value={formData.url}
              onChange={handleInputChange('url')}
            />
          </div>
        </div>

        <Divider className="my-12" />

        {/* Input Field States */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Input Field States
          </h2>
          <div className="max-w-md mx-auto space-y-6">
            <InputField
              label="Required Field"
              type="text"
              value={formData.required}
              onChange={handleInputChange('required')}
              required
              error={errors.required}
            />

            <InputField
              label="Field with Error"
              type="text"
              value={formData.withError}
              onChange={handleInputChange('withError')}
              error={errors.withError}
            />

            <InputField
              label="Disabled Field"
              type="text"
              value={formData.disabled}
              onChange={handleInputChange('disabled')}
              disabled
            />

            <InputField
              label="Field with Placeholder"
              type="text"
              value={formData.withPlaceholder}
              onChange={handleInputChange('withPlaceholder')}
            />
          </div>
        </div>

        <Divider className="my-12" />

        {/* Input Field Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Input Field Features
          </h2>
          <div className="max-w-md mx-auto space-y-6">
            <InputField
              label="Field with Icon"
              type="text"
              value={formData.withIcon}
              onChange={handleInputChange('withIcon')}
              icon={<EyeIcon className="w-5 h-5" />}
            />

            <InputField
              label="Field with Character Counter"
              type="text"
              value={formData.withCounter}
              onChange={handleInputChange('withCounter')}
              maxLength={50}
              showCharCount
            />

            <InputField
              label="Field with Max Length"
              type="text"
              value={formData.maxLengthField}
              onChange={handleInputChange('maxLengthField')}
              maxLength={20}
              showCharCount
            />
          </div>
        </div>

        <Divider className="my-12" />

        {/* Select Fields */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Select Fields
          </h2>
          <div className="max-w-md mx-auto space-y-6">
            <SelectField
              label="Basic Select"
              value={selectData.basic}
              onChange={handleSelectChange('basic')}
              options={selectOptions}
            />

            <SelectField
              label="Required Select"
              value={selectData.required}
              onChange={handleSelectChange('required')}
              options={selectOptions}
              required
            />

            <SelectField
              label="Select with Error"
              value={selectData.withError}
              onChange={handleSelectChange('withError')}
              options={selectOptions}
              error={errors.selectWithError}
            />

            <SelectField
              label="Disabled Select"
              value={selectData.disabled}
              onChange={handleSelectChange('disabled')}
              options={selectOptions}
              disabled
            />

            <SelectField
              label="Country Selection"
              value={selectData.basic}
              onChange={handleSelectChange('basic')}
              options={countryOptions}
              fullWidth
            />
          </div>
        </div>

        <Divider className="my-12" />

        {/* Form Examples */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Form Examples
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-white font-semibold mb-4">Contact Form</h3>
                <div className="space-y-4">
                  <InputField
                    label="Full Name"
                    type="text"
                    value={formData.basic}
                    onChange={handleInputChange('basic')}
                    required
                  />
                  <InputField
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                  />
                  <SelectField
                    label="Subject"
                    value={selectData.basic}
                    onChange={handleSelectChange('basic')}
                    options={[
                      { value: '', label: 'Select a subject' },
                      { value: 'general', label: 'General Inquiry' },
                      { value: 'support', label: 'Technical Support' },
                      { value: 'billing', label: 'Billing Question' },
                    ]}
                    required
                  />
                </div>
              </div>

              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                <h3 className="text-white font-semibold mb-4">User Profile</h3>
                <div className="space-y-4">
                  <InputField
                    label="Username"
                    type="text"
                    value={formData.basic}
                    onChange={handleInputChange('basic')}
                    maxLength={20}
                    showCharCount
                  />
                  <InputField
                    label="Bio"
                    type="text"
                    value={formData.withCounter}
                    onChange={handleInputChange('withCounter')}
                    maxLength={160}
                    showCharCount
                  />
                  <InputField
                    label="Website"
                    type="url"
                    value={formData.url}
                    onChange={handleInputChange('url')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Component Features
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">
                  Floating Labels
                </h3>
                <p className="text-gray-400 text-sm">
                  Labels float above the input when focused or filled
                </p>
              </div>

              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">
                  Validation States
                </h3>
                <p className="text-gray-400 text-sm">
                  Built-in error handling and validation feedback
                </p>
              </div>

              <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">
                  Character Counter
                </h3>
                <p className="text-gray-400 text-sm">
                  Real-time character counting with max length support
                </p>
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
              ← Button Components
            </a>
            <a
              href="/demo/auth-forms"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Auth Forms →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
