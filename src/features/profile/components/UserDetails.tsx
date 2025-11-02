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

  return (
    <div className="flex flex-row items-center gap-3">
      {location && (
        <div className="flex flex-row items-center gap-1">
          <LocationIcon className="w-4 h-4 text-text-placeholder" />
          <span
            className="font-inter text-base text-text-placeholder
"
          >
            {location}
          </span>
        </div>
      )}
      {externalUrl && (
        <div className="flex flex-row items-center gap-1">
          <LinkIcon className="w-4 h-4 text-text-placeholder" />
          <Link
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-inter text-base text-primary hover:underline"
          >
            {normalizedWebsite}
          </Link>
        </div>
      )}
      <div className="flex flex-row items-center gap-1">
        <JoinDateIcon className="w-4 h-4 text-text-placeholder" />
        <span className="font-inter text-base text-text-placeholder">
          Joined {formattedDate}
        </span>
      </div>
    </div>
  );
};

export default UserDetails;
