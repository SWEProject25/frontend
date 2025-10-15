import { cn } from '@/lib/utils';
import { FieldStyleProps } from '../types/formUtils';

export function getFieldBaseStyles({
  error,
  isFocused,
  icon,
  showPasswordToggle,
  showCharCount,
}: FieldStyleProps) {
  return cn(
    'peer w-full h-16 px-4 text-lg text-foreground bg-transparent border rounded-lg transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:text-gray-400 disabled:bg-gray-800/50',
    // Padding adjustments
    icon ? 'pl-12' : '',
    isFocused && (showPasswordToggle || showCharCount) ? 'pr-12' : '',
    // Border styling with error priority
    error
      ? 'border-error focus:border-error'
      : 'border-input-border focus:border-input-border-focus hover:border-border-hover'
  );
}

export function getLabelStyles({
  error,
  isFocused,
  shouldFloatLabel,
  icon,
}: FieldStyleProps) {
  return cn(
    'absolute left-4 transition-all duration-200 pointer-events-none cursor-text',
    icon ? 'left-12' : '',
    shouldFloatLabel ? 'top-2 text-sm' : 'top-1/2 -translate-y-1/2 text-lg',
    // Label color priority: Error > Focus > Default
    error
      ? 'text-error'
      : isFocused && shouldFloatLabel
        ? 'text-primary'
        : shouldFloatLabel
          ? 'text-text-inactive'
          : 'text-text-placeholder',
    // Disabled field label styling
    'peer-disabled:text-gray-500'
  );
}

export function getInputPadding(shouldFloatLabel: boolean) {
  return shouldFloatLabel ? 'pt-6 pb-2' : 'py-4';
}
