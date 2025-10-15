'use client';

import React from 'react';
import { authFormConfigs } from '@/features/authentication/configs/authFormConfigs';
import { FormContainer } from '@/components/ui/forms/components/FormContainer';
import { MultiStepFormProps } from '../types/components';
import { getConfigKey } from '../utils';
import { useMultiStepForm } from '../hooks';

export function MultiStepForm({
  isOpen,
  onClose,
  mode = 'modal',
  onSocialLogin,
  onSwitchModal,
  onForgotPassword,
  onSubmit,
  formState,
  onClearState,
  type,
}: MultiStepFormProps) {
  const { currentStep, handleStepSubmit, handleClose, getInitialFormValues } =
    useMultiStepForm({
      type,
      onSubmit,
      onClose,
      onClearState,
    });

  if (!isOpen) return null;

  const config = authFormConfigs[getConfigKey(currentStep, type)];

  return (
    <div className="relative">
      {/* Form */}
      <FormContainer
        {...config}
        onSubmit={handleStepSubmit}
        onSocialLogin={onSocialLogin}
        onForgotPassword={onForgotPassword}
        onSwitchModal={onSwitchModal}
        onClose={handleClose}
        mode={mode}
        formState={formState}
        onClearState={onClearState}
        initialValues={getInitialFormValues()}
      />
    </div>
  );
}
