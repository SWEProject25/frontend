/**
 * Convert a DatePickerValue ({ year, month, day }) to a Date object.
 * Returns undefined if any field is missing or invalid.
 */
export function datePickerValueToISOString(val?: {
  year?: string;
  month?: string;
  day?: string;
}): string | undefined {
  if (!val || !val.year || !val.month || !val.day) return undefined;
  const y = Number(val.year);
  const m = Number(val.month);
  const d = Number(val.day);
  if (!y || !m || !d) return undefined;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (isNaN(date.getTime())) return undefined;
  return date.toISOString();
}
/**
 * Given a DatePickerValue, returns undefined if untouched, null if all fields are empty, or the value for further processing.
 */
export function getBirthDateOrNull(selected?: {
  year?: string;
  month?: string;
  day?: string;
}): { year: string; month: string; day: string } | null | undefined {
  if (!selected || !selected.year || !selected.month || !selected.day) {
    if (!selected) return undefined;
    const empty = !selected.year && !selected.month && !selected.day;
    return empty ? null : undefined;
  }
  return selected as { year: string; month: string; day: string };
}
/**
 * Convert a Date or string to a DatePickerValue ({ month, day, year }) or undefined if invalid.
 */
export function isoStringToDatePickerValue(
  input?: string
): { month: string; day: string; year: string } | undefined {
  if (!input) return undefined;
  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) return undefined;
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const yyyy = String(d.getUTCFullYear());
    return { month: mm, day: dd, year: yyyy };
  } catch {
    return undefined;
  }
}
/**
 * Compare two dates (Date or string). If equal (same day), return undefined, else return the composed Date.
 * Used for profile birth date update logic.
 */
export function compareDatesOrUndefined(
  composedIso: string,
  initialIso?: string
): string | undefined {
  if (!initialIso) return composedIso;
  try {
    const d1 = new Date(composedIso);
    const d2 = new Date(initialIso);
    if (
      !isNaN(d1.getTime()) &&
      !isNaN(d2.getTime()) &&
      d1.getUTCFullYear() === d2.getUTCFullYear() &&
      d1.getUTCMonth() === d2.getUTCMonth() &&
      d1.getUTCDate() === d2.getUTCDate()
    ) {
      return undefined;
    }
  } catch {}
  return composedIso;
}
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

/**
 * Parse a formatted date string back into an ISO date string.
 * This is intended as the inverse of `formatDate` for the supported formats.
 *
 * Returns an ISO date string (full toISOString) on success, or the string
 * 'Invalid date' when parsing fails.
 */
export const parseFormattedDate = (
  formatted: string,
  format: 'short' | 'long' | 'month-year' = 'long'
): string => {
  if (!formatted || typeof formatted !== 'string') {
    return 'Invalid date';
  }

  try {
    // short: expected "M/D/YYYY" or "MM/DD/YYYY" (en-US)
    if (format === 'short') {
      const parts = formatted.split('/').map((s) => s.trim());
      if (parts.length !== 3) return 'Invalid date';
      const [m, d, y] = parts;
      const mm = parseInt(m, 10);
      const dd = parseInt(d, 10);
      const yy = parseInt(y, 10);
      if (Number.isNaN(mm) || Number.isNaN(dd) || Number.isNaN(yy))
        return 'Invalid date';
      const date = new Date(yy, mm - 1, dd);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toISOString();
    }

    // long: expected "MonthName D, YYYY" e.g. "October 31, 2025"
    if (format === 'long') {
      const match = formatted.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
      if (!match) return 'Invalid date';
      const [, monthName, dayStr, yearStr] = match;
      const day = parseInt(dayStr, 10);
      const year = parseInt(yearStr, 10);
      // Derive month index by constructing a Date with the month name
      const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
      const date = new Date(year, monthIndex, day);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toISOString();
    }

    // month-year: could be "October 2025" or numeric like "10/2025" or "10 2025"
    // Try long-style month name first
    const longMatch = formatted.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (longMatch) {
      const [, monthName, yearStr] = longMatch;
      const year = parseInt(yearStr, 10);
      const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
      const date = new Date(year, monthIndex, 1);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toISOString();
    }

    // numeric month-year (allow '/', '-', or space separators)
    const parts = formatted
      .split(/[\/\-\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 2) {
      const mm = parseInt(parts[0], 10);
      const yy = parseInt(parts[1], 10);
      if (Number.isNaN(mm) || Number.isNaN(yy)) return 'Invalid date';
      const date = new Date(yy, mm - 1, 1);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toISOString();
    }

    return 'Invalid date';
  } catch {
    return 'Invalid date';
  }
};

// Export profile validation utilities
export * from './profileValidation';
