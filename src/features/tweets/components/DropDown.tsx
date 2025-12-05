import React, { ReactElement } from 'react';
import GenericDropdown, {
  DropdownItemType,
} from '@/components/generic/Dropdown';
import Action from './Action';

type DropProps = {
  children: ReactElement<typeof Action> | React.ReactNode;
  items: DropdownItemType[];
  onOpened?: (opened: boolean) => void;
  onSelect?: (key: string) => void;
};

export default function DropDown({
  children,
  items,
  onOpened,
  onSelect,
}: DropProps) {
  // Map items to include onSelect callback
  const itemsWithCallback = items.map((item) => ({
    ...item,
    onClick: () => {
      if (onSelect) onSelect(item.key);
      if (item.onClick) item.onClick();
    },
  }));

  return (
    <GenericDropdown
      testId="tweet-dropdown"
      items={itemsWithCallback}
      onOpened={onOpened}
      showBackdrop={true}
    >
      {children}
    </GenericDropdown>
  );
}
