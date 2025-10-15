export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Finds the longest option text from an array of options
 * @param options Array of options with label property
 * @param fallback Fallback text if no options exist
 * @returns The longest option label
 */
export function getLongestOptionText(
  options: { label: string }[],
  fallback = 'Select'
): string {
  if (!options.length) return fallback;
  return options.reduce(
    (longest, option) =>
      option.label.length > longest.length ? option.label : longest,
    options[0].label
  );
}

/**
 * Calculates appropriate width class based on text length
 * @param textLength Length of the longest text
 * @param fullWidth Whether to use full width
 * @returns Tailwind width class
 */
export function getWidthClass(textLength: number, fullWidth = false): string {
  if (fullWidth) return 'w-full';

  if (textLength <= 8) return 'w-32'; // 8rem
  if (textLength <= 12) return 'w-40'; // 10rem
  if (textLength <= 16) return 'w-48'; // 12rem
  if (textLength <= 20) return 'w-56'; // 14rem
  return 'w-64'; // 16rem max
}

/**
 * Calculates width class for select field based on options and label
 * @param options Array of options with label property
 * @param label Optional label text
 * @param fullWidth Whether to use full width
 * @returns Tailwind width class
 */
export function getSelectFieldWidthClass(
  options: { label: string }[],
  label?: string,
  fullWidth = false
): string {
  const longestOption = getLongestOptionText(options, label || 'Select');
  const maxLength = Math.max(longestOption.length, (label || '').length);
  return getWidthClass(maxLength, fullWidth);
}
