import React from 'react';
import { IconProps } from '@/types/ui';

/**
 * Like/Heart notification icon
 */
export const LikeNotificationIcon = ({ className = 'h-5 w-5' }: IconProps) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
};

/**
 * Repost notification icon
 */
export const RepostNotificationIcon = ({
  className = 'h-5 w-5',
}: IconProps) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z" />
    </svg>
  );
};

/**
 * Reply/Comment notification icon
 */
export const ReplyNotificationIcon = ({ className = 'h-5 w-5' }: IconProps) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
    </svg>
  );
};

/**
 * Quote notification icon
 */
export const QuoteNotificationIcon = ({ className = 'h-5 w-5' }: IconProps) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 3c-1.25.1-2.4.53-3.4 1.2C.22 4.77 0 5.55 0 6.3c0 2.415 1.608 4.385 3.7 4.385.026 0 .053-.004.08-.005-.028.092-.063.178-.09.269C3.69 10.95 3.62 11 3.55 11.05c-.319.159-.642.32-.968.476-.326.157-.652.315-.978.474C1.282 12.15 1 12.374 1 12.75c0 .418.568.75 1.274.75.705 0 1.44-.332 2.184-.75.744-.417 1.506-.832 2.268-1.25.762-.418 1.524-.833 2.287-1.25C9.774 10.083 10.526 9.667 11.278 9.25c.752-.418 1.504-.832 2.256-1.25.752-.417 1.504-.832 2.256-1.25.283-.157.566-.315.849-.476.155-.089.31-.176.466-.268-1.02-1.183-2.474-1.965-4.105-1.965-2.099 0-3.924 1.298-4.655 3.136-.075.188-.15.377-.222.567A9.14 9.14 0 0 1 8 7.3c0-.75-.22-1.53-.6-2.1C6.4 4.53 5.25 4.1 4 3z" />
    </svg>
  );
};

/**
 * Mention notification icon (@mention)
 */
export const MentionNotificationIcon = ({
  className = 'h-5 w-5',
}: IconProps) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10c1.466 0 2.856-.336 4.09-.933.348-.168.495-.578.327-.926-.169-.348-.578-.496-.927-.327C14.338 20.379 13.197 20.7 12 20.7c-4.803 0-8.7-3.897-8.7-8.7S7.197 3.3 12 3.3s8.7 3.897 8.7 8.7c0 1.856-.632 3.573-1.691 4.933-.117.151-.248.293-.393.425-.482.413-1.098.642-1.737.642-1.224 0-2.22-.996-2.22-2.22V12c0-2.209-1.791-4-4-4s-4 1.791-4 4 1.791 4 4 4c1.217 0 2.308-.545 3.043-1.404.491.806 1.358 1.344 2.357 1.344.93 0 1.799-.35 2.446-.984.195-.191.37-.397.52-.615 1.323-1.571 2.034-3.58 2.034-5.653C22 6.486 17.514 2 12 2zm-1.34 12.5c-1.519 0-2.76-1.241-2.76-2.76S9.141 9.24 10.66 9.24s2.76 1.241 2.76 2.76-1.241 2.5-2.76 2.5z" />
    </svg>
  );
};

/**
 * Follow notification icon
 */
export const FollowNotificationIcon = ({
  className = 'h-5 w-5',
}: IconProps) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.863 13.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44zM12 2C9.791 2 8 3.79 8 6s1.791 4 4 4 4-1.79 4-4-1.791-4-4-4z" />
    </svg>
  );
};

/**
 * Direct Message notification icon
 */
export const DMNotificationIcon = ({ className = 'h-5 w-5' }: IconProps) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M1.998 5.5c0-1.381 1.119-2.5 2.5-2.5h15c1.381 0 2.5 1.119 2.5 2.5v13c0 1.381-1.119 2.5-2.5 2.5h-15c-1.381 0-2.5-1.119-2.5-2.5v-13zm2.5-.5c-.276 0-.5.224-.5.5v.511l8 3.722 8-3.722v-.511c0-.276-.224-.5-.5-.5h-15zm15.5 5.149l-8 3.722-8-3.722v8.851c0 .276.224.5.5.5h15c.276 0 .5-.224.5-.5v-8.851z" />
    </svg>
  );
};

/**
 * Error/Alert notification icon
 */
export const ErrorNotificationIcon = ({
  className = 'h-12 w-12',
}: IconProps) => {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};
