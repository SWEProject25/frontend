import React from 'react';
import { IconProps } from '@/types/ui';

export const CheckIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const SpinnerIcon = ({ className = 'w-5 h-5' }: IconProps) => {
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
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
};

export const CloseIcon = ({ className = 'w-5 h-5' }: IconProps) => {
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
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};

export const LoginIcon = ({ className = 'w-5 h-5' }: IconProps) => {
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
        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
      />
    </svg>
  );
};

export const UserIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <g>
        <path d="M5.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C15.318 13.65 13.838 13 12 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C7.627 11.85 9.648 11 12 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H3.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46zM12 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM8 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4z"></path>
      </g>
    </svg>
  );
};

export const KeyIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <g>
        <path d="M13 9.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm9.14 1.77l-5.83 5.84-4-1L6.41 22H2v-4.41l5.89-5.9-1-4 5.84-5.83 7.06 2.35 2.35 7.06zm-12.03 1.04L4 18.41V20h1.59l6.1-6.11 4 1 4.17-4.16-1.65-4.94-4.94-1.65-4.16 4.17 1 4z"></path>
      </g>
    </svg>
  );
};

export const InstallIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <g>
        <path d="M11.99 16l-5.7-5.7L7.7 8.88l3.29 3.3V2.59h2v9.59l3.3-3.3 1.41 1.42-5.71 5.7zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path>
      </g>
    </svg>
  );
};

export const MailIcon = ({ className = 'w-5 h-5' }: IconProps) => {
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
        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
};

export const ChatIcon = ({ className = 'w-5 h-5' }: IconProps) => {
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
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
};

export const ListIcon = ({ className = 'w-5 h-5' }: IconProps) => {
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
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
      />
    </svg>
  );
};

export const CloseXIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export const XLogoIcon = ({ className = 'w-8 h-8' }) => {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
};

export const ArrowLeftIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <g>
        <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z"></path>
      </g>
    </svg>
  );
};

export const ArrowRightIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <g>
        <path d="M14.586 12L7.543 4.96l1.414-1.42L17.414 12l-8.457 8.46-1.414-1.42L14.586 12z"></path>
      </g>
    </svg>
  );
};

export const SearchIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <g>
        <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z"></path>
      </g>
    </svg>
  );
};

export const MuteIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
    >
      <g>
        <path d="M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z"></path>
      </g>
    </svg>
  );
};

export const MessagesIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 17 15"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M0 2.08333C0 0.9325 0.9325 0 2.08333 0H14.5833C15.7342 0 16.6667 0.9325 16.6667 2.08333V12.9167C16.6667 14.0675 15.7342 15 14.5833 15H2.08333C0.9325 15 0 14.0675 0 12.9167V2.08333ZM2.08333 1.66667C1.85333 1.66667 1.66667 1.85333 1.66667 2.08333V4.38667L8.33333 7.41833L15 4.38833V2.08333C15 1.85333 14.8133 1.66667 14.5833 1.66667H2.08333ZM15 6.21917L8.33333 9.24917L1.66667 6.2175V12.9167C1.66667 13.1467 1.85333 13.3333 2.08333 13.3333H14.5833C14.8133 13.3333 15 13.1467 15 12.9167V6.21917Z"
        fill="#F7F9F9"
      />
    </svg>
  );
};

export const MoreIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2.5 9.99992C2.5 9.08325 3.25 8.33325 4.16667 8.33325C5.08333 8.33325 5.83333 9.08325 5.83333 9.99992C5.83333 10.9166 5.08333 11.6666 4.16667 11.6666C3.25 11.6666 2.5 10.9166 2.5 9.99992ZM10 11.6666C10.9167 11.6666 11.6667 10.9166 11.6667 9.99992C11.6667 9.08325 10.9167 8.33325 10 8.33325C9.08333 8.33325 8.33333 9.08325 8.33333 9.99992C8.33333 10.9166 9.08333 11.6666 10 11.6666ZM15.8333 11.6666C16.75 11.6666 17.5 10.9166 17.5 9.99992C17.5 9.08325 16.75 8.33325 15.8333 8.33325C14.9167 8.33325 14.1667 9.08325 14.1667 9.99992C14.1667 10.9166 14.9167 11.6666 15.8333 11.6666Z" />
    </svg>
  );
};

export const ProfessionIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6-2a2 2 0 100 4 2 2 0 000-4zm6-2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
};
export const LocationIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 7c-1.93 0-3.5 1.57-3.5 3.5S10.07 14 12 14s3.5-1.57 3.5-3.5S13.93 7 12 7zm0 5c-.827 0-1.5-.673-1.5-1.5S11.173 9 12 9s1.5.673 1.5 1.5S12.827 12 12 12zm0-10c-4.687 0-8.5 3.813-8.5 8.5 0 5.967 7.621 11.116 7.945 11.332l.555.37.555-.37c.324-.216 7.945-5.365 7.945-11.332C20.5 5.813 16.687 2 12 2zm0 17.77c-1.665-1.241-6.5-5.196-6.5-9.27C5.5 6.916 8.416 4 12 4s6.5 2.916 6.5 6.5c0 4.073-4.835 8.028-6.5 9.27z"></path>
    </svg>
  );
};
export const LinkIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.36 5.64c-1.95-1.96-5.11-1.96-7.07 0L9.88 7.05 8.46 5.64l1.42-1.42c2.73-2.73 7.16-2.73 9.9 0 2.73 2.74 2.73 7.17 0 9.9l-1.42 1.42-1.41-1.42 1.41-1.41c1.96-1.96 1.96-5.12 0-7.07zm-2.12 3.53l-7.07 7.07-1.41-1.41 7.07-7.07 1.41 1.41zm-12.02.71l1.42-1.42 1.41 1.42-1.41 1.41c-1.96 1.96-1.96 5.12 0 7.07 1.95 1.96 5.11 1.96 7.07 0l1.41-1.41 1.42 1.41-1.42 1.42c-2.73 2.73-7.16 2.73-9.9 0-2.73-2.74-2.73-7.17 0-9.9z"></path>{' '}
    </svg>
  );
};
export const BirthdateIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6-2a2 2 0 100 4 2 2 0 000-4zm6-2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
};
export const JoinDateIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3.33333 0.833333V0H5V0.833333H10V0H11.6667V0.833333H12.9167C14.075 0.833333 15 1.76667 15 2.91667V12.9167C15 14.0667 14.075 15 12.9167 15H2.08333C0.933333 15 0 14.0667 0 12.9167V2.91667C0 1.76667 0.933333 0.833333 2.08333 0.833333H3.33333ZM3.33333 2.5H2.08333C1.85833 2.5 1.66667 2.68333 1.66667 2.91667V12.9167C1.66667 13.15 1.85833 13.3333 2.08333 13.3333H12.9167C13.15 13.3333 13.3333 13.15 13.3333 12.9167V2.91667C13.3333 2.68333 13.15 2.5 12.9167 2.5H11.6667V3.33333H10V2.5H5V3.33333H3.33333V2.5ZM3.33333 7.5H5V5.83333H3.33333V7.5ZM3.33333 10.8333H5V9.16667H3.33333V10.8333ZM6.66667 7.5H8.33333V5.83333H6.66667V7.5ZM6.66667 10.8333H8.33333V9.16667H6.66667V10.8333ZM10 7.5H11.6667V5.83333H10V7.5Z" />
    </svg>
  );
};

export const CameraIcon = ({ className = 'w-5 h-5' }: IconProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.697 3H11v2h-.697l-3 2H5c-.276 0-.5.224-.5.5v11c0 .276.224.5.5.5h14c.276 0 .5-.224.5-.5V10h2v8.5c0 1.381-1.119 2.5-2.5 2.5H5c-1.381 0-2.5-1.119-2.5-2.5v-11C2.5 6.119 3.619 5 5 5h1.697l3-2zM12 10.5c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm-4 2c0-2.209 1.791-4 4-4s4 1.791 4 4-1.791 4-4 4-4-1.791-4-4zM17 2c0 1.657-1.343 3-3 3v1c1.657 0 3 1.343 3 3h1c0-1.657 1.343-3 3-3V5c-1.657 0-3-1.343-3-3h-1z"></path>
    </svg>
  );
};
