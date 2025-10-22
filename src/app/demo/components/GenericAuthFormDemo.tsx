'use client';

import React, { useState } from 'react';
import { FormContainer, authFormConfigs } from '@/components/ui/forms';
import { AuthButton } from '@/components/ui/AuthButton';
import { Divider } from '@/components/ui/Divider';
import {
  XLogo,
  LoginIcon,
  UserIcon,
  KeyIcon,
  MailIcon,
  ChatIcon,
  ListIcon,
} from '@/components/ui/icons';

type FormType =
  | 'login'
  | 'register'
  | 'forgotPassword'
  | 'contact'
  | 'newsletter'
  | 'feedback'
  | 'survey'
  | 'support'
  | 'newsletter-signup'
  | 'user-profile'
  | null;

export function GenericAuthFormDemo() {
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [submittedData, setSubmittedData] = useState<Record<
    string,
    string
  > | null>(null);
  const [formState, setFormState] = useState({
    isLoading: false,
    errors: {},
    success: false,
  });

  const handleSubmit = (data: Record<string, string>) => {
    console.log('Form submitted:', data);
    setFormState({ isLoading: true, errors: {}, success: false });

    // Simulate API call
    setTimeout(() => {
      setFormState({ isLoading: false, errors: {}, success: true });
      setSubmittedData(data);

      setTimeout(() => {
        setSubmittedData(null);
        setActiveForm(null);
        setFormState({ isLoading: false, errors: {}, success: false });
      }, 2000);
    }, 1000);
  };

  const handleSocialLogin = (providerId: string) => {
    console.log('Social login:', providerId);
    alert(`Social login with: ${providerId}`);
    setActiveForm(null);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
    setActiveForm('forgotPassword');
  };

  const closeModal = () => {
    setActiveForm(null);
    setFormState({ isLoading: false, errors: {}, success: false });
  };

  const clearFormState = () => {
    setFormState({ isLoading: false, errors: {}, success: false });
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <XLogo className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Generic Forms Demo
          </h1>
          <p className="text-text-inactive text-lg max-w-2xl mx-auto">
            Explore our comprehensive collection of responsive forms built with
            generic components. All forms automatically adapt to screen size
            with modal/full-page modes and follow X/Twitter design patterns.
          </p>
        </div>

        {/* Success Message */}
        {submittedData && (
          <div className="fixed top-4 right-4 bg-green-600 text-foreground p-4 rounded-lg shadow-lg z-50 max-w-md">
            <h3 className="font-semibold mb-2">Form Submitted Successfully!</h3>
            <pre className="text-sm bg-green-700 p-2 rounded overflow-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}

        {/* Authentication Forms Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Authentication Forms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Login Form */}
            <div className="bg-muted p-6 rounded-xl border border-gray-700 hover:bg-gray-750 transition-all duration-200 text-center">
              <div className="mb-4">
                <LoginIcon className="w-10 h-10 mx-auto text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Sign In
              </h3>
              <p className="text-text-inactive mb-4 text-sm">
                Login with email and password or social providers
              </p>
              <AuthButton
                variant="primary"
                className="w-full"
                onClick={() => setActiveForm('login')}
              >
                Try Login Form
              </AuthButton>
            </div>

            {/* Register Form */}
            <div className="bg-muted p-6 rounded-xl border border-gray-700 hover:bg-gray-750 transition-all duration-200 text-center">
              <div className="mb-4">
                <UserIcon className="w-10 h-10 mx-auto text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Sign Up
              </h3>
              <p className="text-text-inactive mb-4 text-sm">
                Create account with email, password, and date of birth
              </p>
              <AuthButton
                variant="primary"
                className="w-full"
                onClick={() => setActiveForm('register')}
              >
                Try Register Form
              </AuthButton>
            </div>

            {/* Forgot Password Form */}
            <div className="bg-muted p-6 rounded-xl border border-gray-700 hover:bg-gray-750 transition-all duration-200 text-center">
              <div className="mb-4">
                <KeyIcon className="w-10 h-10 mx-auto text-yellow-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Reset Password
              </h3>
              <p className="text-text-inactive mb-4 text-sm">
                Recover your account
              </p>
              <AuthButton
                variant="primary"
                className="w-full"
                onClick={() => setActiveForm('forgotPassword')}
              >
                Try Reset Form
              </AuthButton>
            </div>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Generic Forms Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Generic Forms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-muted p-6 rounded-xl border border-gray-700 hover:bg-gray-750 transition-all duration-200 text-center">
              <div className="mb-4">
                <MailIcon className="w-10 h-10 mx-auto text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Contact
              </h3>
              <p className="text-text-inactive mb-4 text-sm">
                Get in touch with us
              </p>
              <AuthButton
                variant="primary"
                className="w-full"
                onClick={() => setActiveForm('contact')}
              >
                Try Contact Form
              </AuthButton>
            </div>

            {/* Newsletter Form */}
            <div className="bg-muted p-6 rounded-xl border border-gray-700 hover:bg-gray-750 transition-all duration-200 text-center">
              <div className="mb-4">
                <MailIcon className="w-10 h-10 mx-auto text-orange-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Newsletter
              </h3>
              <p className="text-text-inactive mb-4 text-sm">
                Subscribe to updates
              </p>
              <AuthButton
                variant="primary"
                className="w-full"
                onClick={() => setActiveForm('newsletter')}
              >
                Try Newsletter Form
              </AuthButton>
            </div>

            {/* Feedback Form */}
            <div className="bg-muted p-6 rounded-xl border border-gray-700 hover:bg-gray-750 transition-all duration-200 text-center">
              <div className="mb-4">
                <ChatIcon className="w-10 h-10 mx-auto text-pink-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Feedback
              </h3>
              <p className="text-text-inactive mb-4 text-sm">
                Share your thoughts
              </p>
              <AuthButton
                variant="primary"
                className="w-full"
                onClick={() => setActiveForm('feedback')}
              >
                Try Feedback Form
              </AuthButton>
            </div>

            {/* Survey Form */}
            <div className="bg-muted p-6 rounded-xl border border-gray-700 hover:bg-gray-750 transition-all duration-200 text-center">
              <div className="mb-4">
                <ListIcon className="w-10 h-10 mx-auto text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Survey</h3>
              <p className="text-text-inactive mb-4 text-sm">Help us improve</p>
              <AuthButton
                variant="primary"
                className="w-full"
                onClick={() => setActiveForm('survey')}
              >
                Try Survey Form
              </AuthButton>
            </div>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Advanced Forms Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Advanced Forms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Support Form */}
            <div className="bg-muted p-6 rounded-xl border border-gray-700 hover:bg-gray-750 transition-all duration-200 text-center">
              <div className="mb-4">
                <ChatIcon className="w-10 h-10 mx-auto text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Support
              </h3>
              <p className="text-text-inactive mb-4 text-sm">
                Technical support request
              </p>
              <AuthButton
                variant="primary"
                className="w-full"
                onClick={() => setActiveForm('support')}
              >
                Try Support Form
              </AuthButton>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-muted p-6 rounded-xl border border-gray-700 hover:bg-gray-750 transition-all duration-200 text-center">
              <div className="mb-4">
                <MailIcon className="w-10 h-10 mx-auto text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Newsletter Signup
              </h3>
              <p className="text-text-inactive mb-4 text-sm">
                Simple email subscription
              </p>
              <AuthButton
                variant="primary"
                className="w-full"
                onClick={() => setActiveForm('newsletter-signup')}
              >
                Try Signup Form
              </AuthButton>
            </div>

            {/* User Profile */}
            <div className="bg-muted p-6 rounded-xl border border-gray-700 hover:bg-gray-750 transition-all duration-200 text-center">
              <div className="mb-4">
                <UserIcon className="w-10 h-10 mx-auto text-teal-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                User Profile
              </h3>
              <p className="text-text-inactive mb-4 text-sm">
                Update profile information
              </p>
              <AuthButton
                variant="primary"
                className="w-full"
                onClick={() => setActiveForm('user-profile')}
              >
                Try Profile Form
              </AuthButton>
            </div>
          </div>
        </div>

        {/* Form Features Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Form Features
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
                <h3 className="text-foreground font-semibold mb-2">
                  Responsive Design
                </h3>
                <p className="text-text-inactive text-sm">
                  Forms automatically adapt to screen size with modal/full-page
                  modes
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
                <h3 className="text-foreground font-semibold mb-2">
                  Form Validation
                </h3>
                <p className="text-text-inactive text-sm">
                  Built-in validation with real-time error feedback and field
                  validation
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
                <h3 className="text-foreground font-semibold mb-2">
                  Social Login
                </h3>
                <p className="text-text-inactive text-sm">
                  Integrated social login buttons with customizable providers
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
              href="/demo/inputs"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Input Components →
            </a>
          </div>
        </div>

        {/* Form Modals */}
        {activeForm === 'login' && (
          <FormContainer
            {...authFormConfigs.login}
            onSubmit={handleSubmit}
            onSocialLogin={handleSocialLogin}
            onForgotPassword={handleForgotPassword}
            onClose={closeModal}
            mode="responsive"
            className="animate-in fade-in duration-200"
            formState={formState}
            onClearState={clearFormState}
          />
        )}

        {activeForm === 'register' && (
          <FormContainer
            {...authFormConfigs.register}
            onSubmit={handleSubmit}
            onSocialLogin={handleSocialLogin}
            onClose={closeModal}
            mode="responsive"
            className="animate-in fade-in duration-200"
            formState={formState}
            onClearState={clearFormState}
          />
        )}

        {activeForm === 'forgotPassword' && (
          <FormContainer
            {...authFormConfigs.forgotPassword}
            onSubmit={handleSubmit}
            onClose={closeModal}
            mode="responsive"
            className="animate-in fade-in duration-200"
            formState={formState}
            onClearState={clearFormState}
          />
        )}

        {activeForm === 'contact' && (
          <FormContainer
            title="Contact Us"
            subtitle="Get in touch with our team"
            fields={[
              {
                name: 'name',
                label: 'Your Name',
                type: 'text',
                required: true,
                maxLength: 100,
                showCharCount: true,
              },
              {
                name: 'email',
                label: 'Email Address',
                type: 'email',
                required: true,
              },
              {
                name: 'subject',
                label: 'Subject',
                type: 'select',
                required: true,
                options: [
                  { value: '', label: 'Select a subject' },
                  { value: 'general', label: 'General Inquiry' },
                  { value: 'support', label: 'Technical Support' },
                  { value: 'billing', label: 'Billing Question' },
                  { value: 'other', label: 'Other' },
                ],
              },
              {
                name: 'message',
                label: 'Message',
                type: 'text',
                required: true,
                maxLength: 500,
                showCharCount: true,
              },
            ]}
            submitButton={{
              text: 'Send Message',
              variant: 'primary',
            }}
            showDivider={false}
            footerLinks={[
              {
                text: 'Need immediate help?',
                linkText: 'Call us',
                href: 'tel:+1234567890',
              },
            ]}
            onSubmit={handleSubmit}
            onClose={closeModal}
            mode="responsive"
            className="animate-in fade-in duration-200"
            formState={formState}
            onClearState={clearFormState}
          />
        )}

        {activeForm === 'newsletter' && (
          <FormContainer
            title="Newsletter Subscription"
            subtitle="Stay updated with our latest news and updates"
            fields={[
              {
                name: 'email',
                label: 'Email Address',
                type: 'email',
                required: true,
                placeholder: 'Enter your email address',
              },
              {
                name: 'interests',
                label: 'Interests',
                type: 'select',
                required: true,
                options: [
                  { value: '', label: 'Select your interests' },
                  { value: 'tech', label: 'Technology' },
                  { value: 'design', label: 'Design' },
                  { value: 'business', label: 'Business' },
                  { value: 'all', label: 'All Topics' },
                ],
              },
            ]}
            submitButton={{
              text: 'Subscribe',
              variant: 'primary',
            }}
            showDivider={false}
            footerLinks={[
              {
                text: 'Already subscribed?',
                linkText: 'Manage preferences',
                href: '#',
              },
            ]}
            onSubmit={handleSubmit}
            onClose={closeModal}
            mode="responsive"
            className="animate-in fade-in duration-200"
            formState={formState}
            onClearState={clearFormState}
          />
        )}

        {activeForm === 'feedback' && (
          <FormContainer
            title="Feedback Form"
            subtitle="Help us improve by sharing your thoughts"
            fields={[
              {
                name: 'name',
                label: 'Your Name',
                type: 'text',
                required: true,
              },
              {
                name: 'email',
                label: 'Email Address',
                type: 'email',
                required: true,
              },
              {
                name: 'rating',
                label: 'Overall Rating',
                type: 'select',
                required: true,
                options: [
                  { value: '', label: 'Select a rating' },
                  { value: 'excellent', label: 'Excellent' },
                  { value: 'good', label: 'Good' },
                  { value: 'average', label: 'Average' },
                  { value: 'poor', label: 'Poor' },
                ],
              },
              {
                name: 'feedback',
                label: 'Your Feedback',
                type: 'text',
                required: true,
                maxLength: 1000,
                showCharCount: true,
              },
            ]}
            submitButton={{
              text: 'Submit Feedback',
              variant: 'primary',
            }}
            showDivider={false}
            onSubmit={handleSubmit}
            onClose={closeModal}
            mode="responsive"
            className="animate-in fade-in duration-200"
            formState={formState}
            onClearState={clearFormState}
          />
        )}

        {activeForm === 'survey' && (
          <FormContainer
            title="User Survey"
            subtitle="Help us understand your needs better"
            fields={[
              {
                name: 'age',
                label: 'Age Range',
                type: 'select',
                required: true,
                options: [
                  { value: '', label: 'Select age range' },
                  { value: '18-24', label: '18-24' },
                  { value: '25-34', label: '25-34' },
                  { value: '35-44', label: '35-44' },
                  { value: '45-54', label: '45-54' },
                  { value: '55+', label: '55+' },
                ],
              },
              {
                name: 'experience',
                label: 'Experience Level',
                type: 'select',
                required: true,
                options: [
                  { value: '', label: 'Select experience level' },
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                  { value: 'expert', label: 'Expert' },
                ],
              },
              {
                name: 'suggestions',
                label: 'Suggestions for Improvement',
                type: 'text',
                maxLength: 500,
                showCharCount: true,
              },
            ]}
            submitButton={{
              text: 'Submit Survey',
              variant: 'primary',
            }}
            showDivider={false}
            onSubmit={handleSubmit}
            onClose={closeModal}
            mode="responsive"
            className="animate-in fade-in duration-200"
            formState={formState}
            onClearState={clearFormState}
          />
        )}

        {activeForm === 'support' && (
          <FormContainer
            title="Technical Support"
            subtitle="Describe your issue and we'll help you resolve it"
            fields={[
              {
                name: 'name',
                label: 'Your Name',
                type: 'text',
                required: true,
              },
              {
                name: 'email',
                label: 'Email Address',
                type: 'email',
                required: true,
              },
              {
                name: 'priority',
                label: 'Priority Level',
                type: 'select',
                required: true,
                options: [
                  { value: '', label: 'Select priority' },
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' },
                ],
              },
              {
                name: 'issue',
                label: 'Issue Description',
                type: 'text',
                required: true,
                maxLength: 1000,
                showCharCount: true,
              },
            ]}
            submitButton={{
              text: 'Submit Support Request',
              variant: 'primary',
            }}
            showDivider={false}
            footerLinks={[
              {
                text: 'Need immediate help?',
                linkText: 'Live Chat',
                href: '#',
              },
            ]}
            onSubmit={handleSubmit}
            onClose={closeModal}
            mode="responsive"
            className="animate-in fade-in duration-200"
            formState={formState}
            onClearState={clearFormState}
          />
        )}

        {activeForm === 'newsletter-signup' && (
          <FormContainer
            title="Newsletter Signup"
            subtitle="Get the latest updates delivered to your inbox"
            fields={[
              {
                name: 'email',
                label: 'Email Address',
                type: 'email',
                required: true,
                placeholder: 'Enter your email address',
              },
            ]}
            submitButton={{
              text: 'Subscribe',
              variant: 'primary',
            }}
            showDivider={false}
            footerLinks={[
              {
                text: 'We respect your privacy.',
                linkText: 'Privacy Policy',
                href: '#',
              },
            ]}
            onSubmit={handleSubmit}
            onClose={closeModal}
            mode="responsive"
            className="animate-in fade-in duration-200"
            formState={formState}
            onClearState={clearFormState}
          />
        )}

        {activeForm === 'user-profile' && (
          <FormContainer
            title="Update Profile"
            subtitle="Keep your profile information up to date"
            fields={[
              {
                name: 'firstName',
                label: 'First Name',
                type: 'text',
                required: true,
              },
              {
                name: 'lastName',
                label: 'Last Name',
                type: 'text',
                required: true,
              },
              {
                name: 'bio',
                label: 'Bio',
                type: 'text',
                maxLength: 160,
                showCharCount: true,
              },
              {
                name: 'location',
                label: 'Location',
                type: 'text',
              },
              {
                name: 'website',
                label: 'Website',
                type: 'text',
                placeholder: 'https://yourwebsite.com',
              },
            ]}
            submitButton={{
              text: 'Update Profile',
              variant: 'primary',
            }}
            showDivider={false}
            onSubmit={handleSubmit}
            onClose={closeModal}
            mode="responsive"
            className="animate-in fade-in duration-200"
            formState={formState}
            onClearState={clearFormState}
          />
        )}
      </div>
    </div>
  );
}
