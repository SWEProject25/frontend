import React, { ReactElement } from 'react';
import GenericDropdown, {
  DropdownItemType,
} from '@/components/generic/Dropdown';
import Action from './Action';

type DropProps = {
  children: ReactElement<typeof Action> | React.ReactNode;
  items: DropdownItemType[];
  onOpened?: (opened: boolean) => void;
};

export default function DropDown({ children, items, onOpened }: DropProps) {
  return (
    <GenericDropdown
      testId="tweet-dropdown"
      items={items}
      onOpened={onOpened}
      showBackdrop={true}
    >
      {children}
    </GenericDropdown>
  );
}
