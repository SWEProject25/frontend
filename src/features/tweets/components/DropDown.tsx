import React, { ReactElement } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@heroui/react';
import Action from './Action';

type DropProps = {
  children:
    | ReactElement<typeof Action>
    | ReactElement<typeof Action>[]
    | React.ReactNode;
  items: {
    key: string;
    label: string;
    icon?: React.ReactNode;
    color?:
      | 'default'
      | 'primary'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'danger';
  }[];
};

export default function DropDown({ children, items }: DropProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <button className="h-auto w-auto">{children}</button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Tweet Actions"
        className="rounded-xl border border-gray-800 bg-black backdrop-blur-md shadow-lg shadow-white/20"
      >
        {items.map((item) => (
          <DropdownItem
            key={item.key}
            color={item.color}
            startContent={item.icon}
            className="hover:bg-white/10 hover:backdrop-blur-sm transition-all duration-200 py-2 px-4"
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
