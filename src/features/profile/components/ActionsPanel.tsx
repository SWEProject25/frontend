import React from 'react';
import Button from '@/components/ui/Button';
import { MoreIcon, MessagesIcon } from '@/components/ui/icons';

const ActionsPanel: React.FC = () => {
  return (
    <div className="flex flex-row justify-end items-start p-3 gap-3 w-[600px] h-[60px]">
      <Button variant="outline" size="md" shape="circle">
        <MoreIcon className="w-5 h-5 text-text-primary" />
      </Button>
      <Button variant="outline" size="md" shape="circle">
        <MessagesIcon className="w-5 h-5 text-text-primary" />
      </Button>
      <Button variant="primary" size="md" className="px-5">
        Follow
      </Button>
    </div>
  );
};

export default ActionsPanel;
