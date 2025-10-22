import React from 'react';
import { JoinDateIcon } from '@/components/ui/icons'; // Assuming these icons exist

interface UserDetailsProps {
  joinDate: string;
}

const UserDetails = ({ joinDate }: UserDetailsProps) => {
  return (
    <div className="flex flex-row items-center gap-1">
      <JoinDateIcon className="w-4 h-4 text-text-placeholder" />
      <span className="font-inter text-base text-text-placeholder">
        {joinDate}
      </span>
    </div>
  );
};

export default UserDetails;
