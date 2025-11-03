import React from 'react';
import { InputField } from '@/components/ui/input';
import { SelectField } from '@/components/ui/SelectField';
import { CaptchaInput } from '@/features/authentication/components/CaptchaInput';
import { OTPInput } from '@/features/authentication/components/OTPInput';
import { EmailInputField } from '@/features/authentication/components/EmailInputField';
import { FormFieldsProps } from '../types';

export function FormFields({
  fields,
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  onClearState,
  onEmailValidationChange,
  loading = false,
}: FormFieldsProps) {
  // Group fields by their group.id
  const fieldGroups = fields.reduce(
    (groups, field) => {
      const groupId = field.group?.id || 'default';
      if (!groups[groupId]) {
        groups[groupId] = [];
      }
      groups[groupId].push(field);
      return groups;
    },
    {} as Record<string, (typeof fields)[0][]>
  );

  return (
    <>
      {Object.entries(fieldGroups).map(([groupId, groupFields]) => {
        const firstField = groupFields[0];
        const group = firstField.group;

        // If no group, render fields individually
        if (!group) {
          return groupFields.map((field) => renderField(field));
        }

        // Render grouped fields
        return (
          <div key={groupId} className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                {group.title}
              </label>
              {group.description && (
                <p className="text-sm text-text-inactive mb-4">
                  {group.description}
                </p>
              )}
            </div>
            <div
              className={
                group.layout === 'horizontal'
                  ? 'grid grid-cols-3 gap-3'
                  : 'space-y-3'
              }
            >
              {groupFields.map((field) => renderField(field))}
            </div>
          </div>
        );
      })}
    </>
  );

  function renderField(field: (typeof fields)[0]) {
    // Special field types
    if (field.name === 'captcha') {
      return (
        <CaptchaInput
          key={field.name}
          onVerify={(isValid: boolean) => {
            // Handle captcha verification
            if (isValid) {
              onInputChange(field.name)({
                target: { value: 'verified' },
              } as React.ChangeEvent<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
              >);
            }
          }}
        />
      );
    }

    if (field.name === 'otp') {
      return (
        <OTPInput
          key={field.name}
          onComplete={(otp) => {
            onInputChange(field.name)({
              target: { value: otp },
            } as React.ChangeEvent<
              HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >);
          }}
          email={formData.email}
          error={errors.otp || undefined}
          onClearError={onClearState}
        />
      );
    }

    if (field.type === 'select' && field.options) {
      return (
        <SelectField
          key={field.name}
          label={field.label}
          value={formData[field.name] || ''}
          onChange={onInputChange(field.name)}
          onBlur={onBlur(field.name)}
          options={field.options}
          error={touched[field.name] ? errors[field.name] : undefined}
          required={field.required}
          fullWidth={true}
          disabled={field.disabled || loading}
        />
      );
    }

    // Special email field with real-time validation
    if (
      field.name === 'email' &&
      field.type === 'email' &&
      field.validation?.enableRealTimeValidation
    ) {
      return (
        <EmailInputField
          key={field.name}
          label={field.label}
          value={formData[field.name] || ''}
          onChange={onInputChange(field.name)}
          onBlur={onBlur(field.name)}
          placeholder={field.placeholder}
          required={field.required}
          disabled={field.disabled || loading}
          validation={field.validation}
          onValidationChange={onEmailValidationChange}
        />
      );
    }

    // Regular input field
    return (
      <InputField
        key={field.name}
        label={field.label}
        type={field.type === 'select' ? 'text' : field.type}
        value={formData[field.name] || ''}
        onChange={onInputChange(field.name)}
        onBlur={onBlur(field.name)}
        error={touched[field.name] ? errors[field.name] : undefined}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        showCharCount={field.showCharCount}
        showPasswordToggle={field.showPasswordToggle}
        required={field.required}
        disabled={field.disabled || loading}
      />
    );
  }
}
