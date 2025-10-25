import { AllSteps, AuthModalType } from './components';

// Multi-step Form Hook Types
export interface UseMultiStepFormProps {
  type: AuthModalType;
  onSubmit: (data: Record<string, string>, step?: AllSteps) => Promise<boolean>;
  onClose: () => void;
  onClearState?: () => void;
}

export interface UseMultiStepFormReturn {
  currentStep: AllSteps;
  handleStepSubmit: (data: Record<string, string>) => void;
  handleClose: () => void;
  getInitialFormValues: () => Record<string, string>;
}
