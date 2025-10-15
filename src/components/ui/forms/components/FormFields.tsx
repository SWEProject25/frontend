import React from 'react';
import { InputField } from '@/components/ui/input';
import { SelectField } from '@/components/ui/SelectField';
import { FormFieldsProps } from '../types';

export function FormFields({
  fields,
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
  isRegisterForm,
}: FormFieldsProps) {
  if (isRegisterForm) {
    return (
      <RegisterFormFields
        {...{ fields, formData, errors, touched, onInputChange, onBlur }}
      />
    );
  }

  return (
    <RegularFormFields
      {...{ fields, formData, errors, touched, onInputChange, onBlur }}
    />
  );
}

function RegisterFormFields({
  fields,
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
}: Omit<FormFieldsProps, 'isRegisterForm'>) {
  const nameEmailFields = fields.filter((field) =>
    ['name', 'email'].includes(field.name)
  );
  const dateFields = fields.filter((field) =>
    ['birthMonth', 'birthDay', 'birthYear'].includes(field.name)
  );

  return (
    <>
      {/* Name and Email fields */}
      {nameEmailFields.map((field) => (
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
        />
      ))}

      {/* Date of birth section */}
      {dateFields.length > 0 && (
        <div className="space-y-3">
          <div className="text-foreground text-sm font-medium">
            Date of birth
          </div>
          <div className="text-text-inactive text-sm">
            This will not be shown publicly. Confirm your own age, even if this
            account is for a business, a pet, or something else.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {dateFields.map((field) => (
              <SelectField
                key={field.name}
                label={field.label}
                value={formData[field.name] || ''}
                onChange={onInputChange(field.name)}
                onBlur={onBlur(field.name)}
                options={field.options || []}
                error={touched[field.name] ? errors[field.name] : undefined}
                required={field.required}
                fullWidth={true}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function RegularFormFields({
  fields,
  formData,
  errors,
  touched,
  onInputChange,
  onBlur,
}: Omit<FormFieldsProps, 'isRegisterForm'>) {
  return (
    <>
      {fields.map((field) => {
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
            />
          );
        }

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
          />
        );
      })}
    </>
  );
}
