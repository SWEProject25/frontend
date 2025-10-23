import { useState, useCallback, useEffect } from 'react';
import { LOGIN_STEPS, getCreateAccountSteps } from '../constants';
import { AllSteps } from '../types/components';
import { getInitialValues } from '@/features/authentication/utils';
import { UseMultiStepFormProps, UseMultiStepFormReturn } from '../types/hooks';

// Helper function to get accumulated data
function getAccumulatedData(
  stepData: Record<string, Record<string, string>>,
  currentStep: AllSteps,
  currentData: Record<string, string>
): Record<string, string> {
  const accumulatedData = { ...stepData, [currentStep]: currentData };
  return Object.values(accumulatedData).reduce(
    (acc, stepData) => ({ ...acc, ...stepData }),
    {}
  );
}

export function useMultiStepForm({
  type,
  onSubmit,
  onClose,
  onClearState,
}: UseMultiStepFormProps): UseMultiStepFormReturn {
  // Helper function to get initial step for form type
  const getInitialStep = useCallback((): AllSteps => {
    return type === 'login'
      ? 'email'
      : type === 'createAccount'
        ? 'register'
        : type;
  }, [type]);

  const [currentStep, setCurrentStep] = useState<AllSteps>(getInitialStep);

  const [stepData, setStepData] = useState<
    Record<string, Record<string, string>>
  >({});

  // Get steps array for current form type
  const getSteps = useCallback((): AllSteps[] => {
    const isMultiStep = type === 'login' || type === 'createAccount';
    return isMultiStep
      ? type === 'login'
        ? LOGIN_STEPS
        : getCreateAccountSteps() // Use dynamic steps for create account
      : [type as AllSteps];
  }, [type]);

  // Handle prop changes - reset state when type changes
  useEffect(() => {
    setCurrentStep(getInitialStep());
    setStepData({});
  }, [type, getInitialStep]);

  const handleStepSubmit = useCallback(
    async (data: Record<string, string>) => {
      const isMultiStep = type === 'login' || type === 'createAccount';

      // For single-step forms, submit directly
      if (!isMultiStep) {
        await onSubmit(data, currentStep);
        return;
      }

      // Store data for current step
      setStepData((prev) => ({ ...prev, [currentStep]: data }));

      // Get steps for current form type
      const steps = getSteps();

      // Move to next step or complete
      const currentStepIndex = steps.indexOf(currentStep);
      if (currentStepIndex < steps.length - 1) {
        const nextStep = steps[currentStepIndex + 1];

        // Use helper function to get accumulated data
        const flattenedData = getAccumulatedData(stepData, currentStep, data);

        // Call onSubmit with accumulated data for each step transition
        // Only proceed to next step if onSubmit returns true
        const success = await onSubmit(flattenedData, currentStep);
        if (success) {
          setCurrentStep(nextStep);
        }
      } else {
        // All steps completed, submit final data
        const flattenedData = getAccumulatedData(stepData, currentStep, data);

        // Submit the final data
        await onSubmit(flattenedData, currentStep);
      }
    },
    [type, onSubmit, currentStep, getSteps, stepData]
  );

  const handleClose = useCallback(() => {
    setCurrentStep(getInitialStep());
    setStepData({});
    onClearState?.(); // Clear form state when closing
    onClose();
  }, [onClose, getInitialStep, onClearState]);

  const getInitialFormValues = useCallback(() => {
    return getInitialValues(type, currentStep, stepData);
  }, [type, currentStep, stepData]);

  return {
    currentStep,
    handleStepSubmit,
    handleClose,
    getInitialFormValues,
  };
}
