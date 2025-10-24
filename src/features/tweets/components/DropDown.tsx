import React, { ReactElement } from 'react';
import { useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';
import Action from './Action';

type DropProps = {
  children: ReactElement<typeof Action> | React.ReactNode;
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
  onOpened?: (opened: boolean) => void;
};

export default function DropDown({ children, items, onOpened }: DropProps) {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <div className="relative">
      {/* 🔹 Backdrop to block clicks only inside tweet, not whole page */}
      {isOpened && (
        <div
          onClick={() => {
            setIsOpened(false);
          }}
          className="fixed inset-0 bg-transparent z-40 cursor-default pointer-events-auto"
          style={{ pointerEvents: isOpened ? 'auto' : 'none' }}
        />
      )}
      <Dropdown
        onOpenChange={(open) => {
          setIsOpened(open);
          onOpened && onOpened(open);
        }}
      >
        <DropdownTrigger>
          <button
            className="h-auto w-auto"
            onClick={() => {
              setIsOpened(true);
            }}
          >
            {children}
          </button>
        </DropdownTrigger>
        {/* Position the dropdown menu at top right of tweet */}
        <div>
          <DropdownMenu
            aria-label="Static Actions"
            variant="faded"
            className="rounded-xl border border-gray-800 bg-black shadow-lg shadow-white/20"
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
        </div>
      </Dropdown>
    </div>
  );
}
