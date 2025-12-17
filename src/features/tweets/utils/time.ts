import { MONTH_NAMES, TIME_CONSTANTS } from '../constants';

/**
 * Format a date to full format: "12:30 PM · Jan 1, 2024"
 */
export const formatDateFull = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const month = MONTH_NAMES[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm} · ${month} ${day}, ${year}`;
};

/**
 * Format a date to relative time format: "5m", "2h", "Jan 1", etc.
 */
export const formatDateRelative = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const month = MONTH_NAMES[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  if (seconds < TIME_CONSTANTS.SECONDS_IN_MINUTE) {
    if (seconds <= 0) return 'Just now';
    return `${seconds}s`;
  } else if (seconds < TIME_CONSTANTS.SECONDS_IN_HOUR) {
    return `${Math.floor(seconds / TIME_CONSTANTS.SECONDS_IN_MINUTE)}m`;
  } else if (seconds < TIME_CONSTANTS.SECONDS_IN_DAY) {
    return `${Math.floor(seconds / TIME_CONSTANTS.SECONDS_IN_HOUR)}h`;
  } else if (seconds < TIME_CONSTANTS.SECONDS_IN_WEEK) {
    return `${Math.floor(seconds / TIME_CONSTANTS.SECONDS_IN_DAY)}d`;
  } else if (seconds < TIME_CONSTANTS.SECONDS_IN_YEAR) {
    return `${month} ${day}`;
  } else {
    return `${month} ${day}, ${year}`;
  }
};
