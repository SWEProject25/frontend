'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/authentication/store/authStore';
import DateOfBirthModal from './DateOfBirthModal';
import InterestsModal from './InterestsModal';
import FollowSuggestionsModal from './FollowSuggestionsModal';

type OnboardingStep = 'dateOfBirth' | 'interests' | 'followSuggestions' | null;

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(null);

  // Determine which step to show based on user state
  useEffect(() => {
    // Don't determine step while loading user data
    if (isLoading) {
      setCurrentStep(null);
      return;
    }

    if (!user) {
      setCurrentStep(null);
      return;
    }

    const onboardingStatus = user.onboardingStatus;

    // Don't show any modal if onboardingStatus is not yet loaded
    // This prevents showing birthdate modal by default before API responds
    if (!onboardingStatus) {
      setCurrentStep(null);
      return;
    }

    // Check onboarding status and determine next step
    // Priority: birthDate -> interests -> followSuggestions
    if (!onboardingStatus.hasCompletedBirthDate) {
      setCurrentStep('dateOfBirth');
    } else if (!onboardingStatus.hasCompeletedInterests) {
      setCurrentStep('interests');
    } else if (!onboardingStatus.hasCompeletedFollowing) {
      setCurrentStep('followSuggestions');
    } else {
      // All onboarding steps completed
      setCurrentStep(null);
      onComplete?.();
    }
  }, [user, isLoading, onComplete]);

  // Empty handlers - useEffect automatically determines next step based on user state
  const handleDateOfBirthComplete = () => {};
  const handleInterestsComplete = () => {};
  const handleFollowSuggestionsComplete = () => {};

  // Don't show modal if loading or there's no current step
  if (isLoading || !currentStep) {
    return null;
  }

  return (
    <>
      <DateOfBirthModal
        isOpen={currentStep === 'dateOfBirth'}
        onClose={() => {}}
        onComplete={handleDateOfBirthComplete}
      />

      <InterestsModal
        isOpen={currentStep === 'interests'}
        onClose={() => {}}
        onComplete={handleInterestsComplete}
      />

      <FollowSuggestionsModal
        isOpen={currentStep === 'followSuggestions'}
        onClose={() => {}}
        onComplete={handleFollowSuggestionsComplete}
      />
    </>
  );
}
