'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/authentication/store/authStore';
import DateOfBirthModal from './DateOfBirthModal';
import InterestsModal from './InterestsModal';
import FollowSuggestionsModal from './FollowSuggestionsModal';

type OnboardingStep = 'dateOfBirth' | 'interests' | 'followSuggestions' | null;

interface OnboardingFlowProps {
  onComplete?: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(null);
  const hasCompletedOnboardingRef = useRef(false);

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

    const prevStep = currentStep;

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

      // Only invalidate suggested users cache if we just completed onboarding
      // This prevents invalidating on every render when onboarding is already complete
      if (
        prevStep === 'followSuggestions' &&
        !hasCompletedOnboardingRef.current
      ) {
        hasCompletedOnboardingRef.current = true;
        // Invalidate suggested users to refresh the "Who to follow" list
        queryClient.invalidateQueries({ queryKey: ['suggestedUsers'] });
      }
    }
  }, [user, isLoading, onComplete, router, currentStep, queryClient]);

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
