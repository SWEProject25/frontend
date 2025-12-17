/**
 * Month names abbreviated (3 letters)
 */
export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/**
 * Time conversion constants
 */
export const TIME_CONSTANTS = {
  SECONDS_IN_MINUTE: 60,
  SECONDS_IN_HOUR: 3600,
  SECONDS_IN_DAY: 3600 * 24,
  SECONDS_IN_WEEK: 3600 * 24 * 7,
  SECONDS_IN_YEAR: 3600 * 24 * 30 * 12,
} as const;
