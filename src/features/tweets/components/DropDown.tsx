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
  temp: boolean;
  userName: string;
};

export default function DropDown({
  temp,
  children,
  items,
  onOpened,
  userName,
}: DropProps) {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <div className="relative" data-testid="tweet-dropdown">
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
          if (onOpened) {
            onOpened(open);
          }
        }}
        className="p-0"
      >
        <DropdownTrigger>
          <span
            className="h-auto w-auto"
            onClick={() => {
              setIsOpened(true);
            }}
          >
            {children}
          </span>
        </DropdownTrigger>
        {/* Position the dropdown menu at top right of tweet */}
        <div className="w-full">
          <DropdownMenu
            data-testid="tweet-dropdown-menu"
            aria-label="Static Actions"
            variant="faded"
            className="rounded-xl border border-gray-800 bg-black shadow-lg shadow-white/20 p-0 "
          >
            {items.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === items.length - 1;
              const borderRadius =
                (isFirst ? 'rounded-t-xl ' : '') +
                (isLast ? 'rounded-b-xl ' : '');
              return (
                <DropdownItem
                  key={item.key}
                  data-testid={`tweet-dropdown-item-${item.key}`}
                  color={item.color}
                  startContent={item.icon}
                  className={
                    borderRadius +
                    'hover:bg-white/10 hover:backdrop-blur-sm transition-all duration-200 py-2.5'
                  }
                >
                  {index === 1
                    ? temp
                      ? `unFollow @${userName}`
                      : `follow @${userName}`
                    : item.label}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </div>
      </Dropdown>
    </div>
  );
}
