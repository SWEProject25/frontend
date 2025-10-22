import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { MoreIcon, MessagesIcon } from '@/components/ui/icons';

interface ActionsPanelProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  onEditProfile?: () => void;
  onFollow?: () => void;
  onUnfollow?: () => void;
}

const ActionsPanel: React.FC<ActionsPanelProps> = ({
  isOwnProfile,
  isFollowing,
  onEditProfile,
  onFollow,
  onUnfollow,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-row justify-end items-start p-3 gap-3 w-[600px] h-[60px]">
      {isOwnProfile ? (
        <Button
          variant="outline"
          size="md"
          shape="rounded"
          className="px-5"
          onClick={onEditProfile}
        >
          Edit Profile
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            size="md"
            shape="circle"
            onClick={() => console.log('More clicked')}
          >
            <MoreIcon className="w-5 h-5 text-text-primary" />
          </Button>
          <Button
            variant="outline"
            size="md"
            shape="circle"
            onClick={() => console.log('Messages clicked')}
          >
            <MessagesIcon className="w-5 h-5 text-text-primary" />
          </Button>
          {isFollowing ? (
            <Button
              variant={isHovered ? 'error-outline' : 'outline'}
              size="md"
              shape="rounded"
              className="px-5"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={onUnfollow}
            >
              {isHovered ? 'Unfollow' : 'Following'}
            </Button>
          ) : (
            <Button
              variant="social"
              size="md"
              shape="rounded"
              className="px-5"
              onClick={onFollow}
            >
              Follow
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ActionsPanel;
