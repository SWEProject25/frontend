/**
 * Formats birthMonth, birthDay, and birthYear into YYYY-MM-DD format
 * @param birthMonth - Month value (1-12 or '01'-'12')
 * @param birthDay - Day value (1-31 or '01'-'31')
 * @param birthYear - Year value (e.g., 2004)
 * @returns Formatted date string in YYYY-MM-DD format
 */
export function formatBirthDate(
  birthMonth: string | number,
  birthDay: string | number,
  birthYear: string | number
): string {
  const month = String(birthMonth).padStart(2, '0');
  const day = String(birthDay).padStart(2, '0');
  const year = String(birthYear);

  return `${year}-${month}-${day}`;
}

/**
 * Validates if the birth date fields exist in the data
 * @param data - Form data object
 * @returns True if all birth date fields exist
 */
export function hasBirthDateFields(data: Record<string, string>): boolean {
  return Boolean(data.birthMonth && data.birthDay && data.birthYear);
}
