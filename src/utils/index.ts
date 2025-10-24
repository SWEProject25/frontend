/**
 * Convert File to data URL (base64)
 * In production, this should upload to a storage service (S3, Cloudinary, etc.)
 */
export const convertFileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Format date to readable format
 * @param dateString - ISO date string
 * @param format - 'short' | 'long' | 'month-year'
 */
export const formatDate = (
  dateString: string,
  format: 'short' | 'long' | 'month-year' = 'long'
): string => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: format === 'short' ? 'numeric' : 'long',
    day: format === 'month-year' ? undefined : 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
};
