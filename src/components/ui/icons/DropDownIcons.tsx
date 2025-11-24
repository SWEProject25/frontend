import React from 'react';
import { IconProps } from '@/types/ui';

export const NotInterstedIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      d="M9.5 7c.828 0 1.5 1.119 1.5 2.5S10.328 12 9.5 12 8 10.881 8 9.5 8.672 7 9.5 7zm5 0c.828 0 1.5 1.119 1.5 2.5s-.672 2.5-1.5 2.5S13 10.881 13 9.5 13.672 7 14.5 7zM12 22.25C6.348 22.25 1.75 17.652 1.75 12S6.348 1.75 12 1.75 22.25 6.348 22.25 12 17.652 22.25 12 22.25zm0-18.5c-4.549 0-8.25 3.701-8.25 8.25s3.701 8.25 8.25 8.25 8.25-3.701 8.25-8.25S16.549 3.75 12 3.75zM8.947 17.322l-1.896-.638C7.101 16.534 8.322 13 12 13s4.898 3.533 4.949 3.684l-1.897.633c-.031-.09-.828-2.316-3.051-2.316s-3.021 2.227-3.053 2.322z"
      data--h-bstatus="0OBSERVED"
    ></path>
  </svg>
);

export const FollowIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      d="M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zm13 4v3h2v-3h3V8h-3V5h-2v3h-3v2h3zM3.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C13.318 13.65 11.838 13 10 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C5.627 11.85 7.648 11 10 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H1.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46z"
      data--h-bstatus="0OBSERVED"
    ></path>
  </svg>
);

export const UnfollowIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      d="M10 4c-1.105 0-2 .9-2 2s.895 2 2 2 2-.9 2-2-.895-2-2-2zM6 6c0-2.21 1.791-4 4-4s4 1.79 4 4-1.791 4-4 4-4-1.79-4-4zm12.586 3l-2.043-2.04 1.414-1.42L20 7.59l2.043-2.05 1.414 1.42L21.414 9l2.043 2.04-1.414 1.42L20 10.41l-2.043 2.05-1.414-1.42L18.586 9zM3.651 19h12.698c-.337-1.8-1.023-3.21-1.945-4.19C13.318 13.65 11.838 13 10 13s-3.317.65-4.404 1.81c-.922.98-1.608 2.39-1.945 4.19zm.486-5.56C5.627 11.85 7.648 11 10 11s4.373.85 5.863 2.44c1.477 1.58 2.366 3.8 2.632 6.46l.11 1.1H1.395l.11-1.1c.266-2.66 1.155-4.88 2.632-6.46z"
      data--h-bstatus="0OBSERVED"
    ></path>
  </svg>
);

export const AddtoList = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      d="M5.5 4c-.28 0-.5.22-.5.5v15c0 .28.22.5.5.5H12v2H5.5C4.12 22 3 20.88 3 19.5v-15C3 3.12 4.12 2 5.5 2h13C19.88 2 21 3.12 21 4.5V13h-2V4.5c0-.28-.22-.5-.5-.5h-13zM16 10H8V8h8v2zm-8 2h8v2H8v-2zm10 7v-3h2v3h3v2h-3v3h-2v-3h-3v-2h3z"
      data--h-bstatus="0OBSERVED"
    ></path>
  </svg>
);

export const MuteIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      d="M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z"
      data--h-bstatus="0OBSERVED"
    ></path>
  </svg>
);

export const BlockIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      d="M12 3.75c-4.55 0-8.25 3.69-8.25 8.25 0 1.92.66 3.68 1.75 5.08L17.09 5.5C15.68 4.4 13.92 3.75 12 3.75zm6.5 3.17L6.92 18.5c1.4 1.1 3.16 1.75 5.08 1.75 4.56 0 8.25-3.69 8.25-8.25 0-1.92-.65-3.68-1.75-5.08zM1.75 12C1.75 6.34 6.34 1.75 12 1.75S22.25 6.34 22.25 12 17.66 22.25 12 22.25 1.75 17.66 1.75 12z"
      data--h-bstatus="0OBSERVED"
    ></path>
  </svg>
);

export const EngagementsIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"
      data--h-bstatus="0OBSERVED"
    ></path>
  </svg>
);

export const EmbedIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      d="M15.24 4.31l-4.55 15.93-1.93-.55 4.55-15.93 1.93.55zm-8.33 3.6L3.33 12l3.58 4.09-1.5 1.32L.67 12l4.74-5.41 1.5 1.32zm11.68-1.32L23.33 12l-4.74 5.41-1.5-1.32L20.67 12l-3.58-4.09 1.5-1.32z"
      data--h-bstatus="0OBSERVED"
    ></path>
  </svg>
);

export const ReportIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      d="M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z"
      data--h-bstatus="0OBSERVED"
    ></path>
  </svg>
);

export const RequestCommunityIcon = ({ className = 'w-5 h-5' }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="currentColor"
  >
    <path
      d="M22 2.63v17.74l-7.05-2.27c-.29 1.65-1.72 2.9-3.45 2.9C9.57 21 8 19.43 8 17.5v-1.63l-1.15-.37H4.5C3.12 15.5 2 14.38 2 13v-3c0-1.38 1.12-2.5 2.5-2.5h2.35L22 2.63zM6 9.5H4.5c-.27 0-.5.22-.5.5v3c0 .28.23.5.5.5H6v-4zm2 4.27l12 3.86V5.37L8 9.23v4.54zm2 2.74v.99c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-.02l-3-.97z"
      data--h-bstatus="0OBSERVED"
    ></path>
  </svg>
);
