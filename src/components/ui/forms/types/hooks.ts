import { AllSteps } from './components';

// Multi-step Form Hook Types
export interface UseMultiStepFormProps {
  type: 'login' | 'createAccount' | 'signup' | 'forgotPassword';
  onSubmit: (data: Record<string, string>) => void;
  onClose: () => void;
  onClearState?: () => void;
}

export interface UseMultiStepFormReturn {
  currentStep: AllSteps;
  stepData: Record<string, Record<string, string>>;
  steps: AllSteps[];
  handleStepSubmit: (data: Record<string, string>) => void;
  handleClose: () => void;
  getInitialFormValues: () => Record<string, string>;
}
