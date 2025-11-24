import React from 'react';
import { JoinDateIcon, LocationIcon, LinkIcon } from '@/components/ui/icons';
import { formatDate } from '@/utils';
import Link from 'next/link';

interface UserDetailsProps {
  joinDate: string;
  location: string | null;
  website: string | null;
}

const UserDetails = ({ joinDate, location, website }: UserDetailsProps) => {
  const formattedDate = formatDate(joinDate, 'month-year');

  // Normalize website so missing protocol doesn't create a relative link
  const normalizedWebsite = website ? website.trim() : null;
  const externalUrl = normalizedWebsite
    ? normalizedWebsite.startsWith('http')
      ? normalizedWebsite
      : `https://${normalizedWebsite}`
    : null;

  // Truncate display text if longer than 20 characters
  const displayWebsite = normalizedWebsite
    ? normalizedWebsite.length > 20
      ? `${normalizedWebsite.substring(0, 20)}...`
      : normalizedWebsite
    : null;

  return (
    <div
      className="flex flex-row items-center gap-2 sm:gap-3 flex-wrap"
      data-testid="profile-user-details"
    >
      {location && (
        <div
          className="flex flex-row items-center gap-1"
          data-testid="profile-location"
        >
          <LocationIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-placeholder" />
          <span className="font-inter text-sm sm:text-base text-text-placeholder">
            {location}
          </span>
        </div>
      )}
      {externalUrl && (
        <div
          className="flex flex-row items-center gap-1"
          data-testid="profile-website"
        >
          <LinkIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-placeholder" />
          <Link
            data-testid="profile-website-link"
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter text-sm sm:text-base text-primary hover:underline"
            title={normalizedWebsite || undefined}
          >
            {displayWebsite}
          </Link>
        </div>
      )}
      <div
        className="flex flex-row items-center gap-1"
        data-testid="profile-join-date"
      >
        <JoinDateIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-placeholder" />
        <span className="font-inter text-sm sm:text-base text-text-placeholder">
          Joined {formattedDate}
        </span>
      </div>
    </div>
  );
};

export default UserDetails;
