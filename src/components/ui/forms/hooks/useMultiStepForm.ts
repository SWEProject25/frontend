import { useState, useCallback, useMemo, useEffect } from 'react';
import { LOGIN_STEPS, CREATE_ACCOUNT_STEPS } from '../constants';
import { AllSteps } from '../types/components';
import { getInitialValues } from '../utils';
import { UseMultiStepFormProps, UseMultiStepFormReturn } from '../types/hooks';

export function useMultiStepForm({
  type,
  onSubmit,
  onClose,
  onClearState,
}: UseMultiStepFormProps): UseMultiStepFormReturn {
  const [currentStep, setCurrentStep] = useState<AllSteps>(
    type === 'login' ? 'email' : type === 'createAccount' ? 'register' : type
  );
  const [stepData, setStepData] = useState<
    Record<string, Record<string, string>>
  >({});

  const steps: AllSteps[] = useMemo(() => {
    const isMultiStep = type === 'login' || type === 'createAccount';
    return isMultiStep
      ? type === 'login'
        ? LOGIN_STEPS
        : CREATE_ACCOUNT_STEPS
      : [type as AllSteps];
  }, [type]);

  // Handle prop changes - reset form when type changes
  useEffect(() => {
    const initialStep =
      type === 'login' ? 'email' : type === 'createAccount' ? 'register' : type;
    setCurrentStep(initialStep as AllSteps);
    setStepData({});
  }, [type]);

  const handleStepSubmit = useCallback(
    (data: Record<string, string>) => {
      const isMultiStep = type === 'login' || type === 'createAccount';

      // For single-step forms, submit directly
      if (!isMultiStep) {
        onSubmit(data);
        return;
      }

      // Store data for current step
      setStepData((prev) => ({ ...prev, [currentStep]: data }));

      // Move to next step or complete
      const currentStepIndex = steps.indexOf(currentStep);
      if (currentStepIndex < steps.length - 1) {
        const nextStep = steps[currentStepIndex + 1];
        setCurrentStep(nextStep);
      } else {
        // All steps completed, submit final data
        const allData = { ...stepData, [currentStep]: data };
        const flattenedData = Object.values(allData).reduce(
          (acc, stepData) => ({ ...acc, ...stepData }),
          {}
        );

        // Submit the final data
        onSubmit(flattenedData);
      }
    },
    [type, onSubmit, currentStep, steps, stepData]
  );

  const handleClose = useCallback(() => {
    const initialStep =
      type === 'login' ? 'email' : type === 'createAccount' ? 'register' : type;
    setCurrentStep(initialStep as AllSteps);
    setStepData({});
    onClearState?.(); // Clear form state when closing
    onClose();
  }, [onClose, type, onClearState]);

  const getInitialFormValues = useCallback(() => {
    return getInitialValues(type, currentStep, stepData);
  }, [type, currentStep, stepData]);

  return {
    currentStep,
    stepData,
    steps,
    handleStepSubmit,
    handleClose,
    getInitialFormValues,
  };
}
