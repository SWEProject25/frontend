import React from 'react';
import { JoinDateIcon } from '@/components/ui/icons';
import { formatDate } from '@/utils';

interface UserDetailsProps {
  joinDate: string;
}

const UserDetails = ({ joinDate }: UserDetailsProps) => {
  const formattedDate = formatDate(joinDate, 'month-year');

  return (
    <div className="flex flex-row items-center gap-1">
      <JoinDateIcon className="w-4 h-4 text-text-placeholder" />
      <span className="font-inter text-base text-text-placeholder">
        Joined {formattedDate}
      </span>
    </div>
  );
};

export default UserDetails;
