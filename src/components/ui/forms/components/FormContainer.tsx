import React from 'react';
import { XLogo, CloseIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { FormContent } from './FormContent';
import { FormContainerProps } from '../types';

export function FormContainer({
  displayMode,
  onClose,
  className,
  isRegisterForm,
  ...props
}: FormContainerProps) {
  if (displayMode === 'fullpage') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex justify-center mb-8">
            <XLogo />
          </div>
          <div className="bg-background rounded-2xl w-full">
            <div className="px-4 sm:px-8 pb-8">
              <FormContent {...props} isRegisterForm={isRegisterForm} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed inset-0 bg-background bg-opacity-60 flex items-center justify-center p-4 z-50',
        className
      )}
    >
      <div className="bg-background rounded-2xl w-full max-w-[600px] max-h-[90vh] overflow-y-auto relative sm:mx-4">
        {/* Close Button */}
        {onClose && (
          <button
            className="absolute top-4 left-4 text-foreground hover:bg-border-hover rounded-full p-2 transition-colors"
            onClick={onClose}
            title="Close"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        )}

        {/* X Logo */}
        <div className="flex justify-center pt-8 pb-8">
          <XLogo />
        </div>

        {/* Content */}
        <div className="px-4 sm:px-8 pb-8">
          <FormContent {...props} isRegisterForm={isRegisterForm} />
        </div>
      </div>
    </div>
  );
}
