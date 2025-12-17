'use client';
import React, { ReactNode, useState } from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/react';

export type DropdownItemType = {
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
  onClick?: () => void;
  className?: string;
};

type GenericDropdownProps = {
  readonly children: ReactNode;
  readonly items: readonly DropdownItemType[];
  readonly onOpened?: (opened: boolean) => void;
  readonly testId?: string;
  readonly menuClassName?: string;
  readonly triggerClassName?: string;
  readonly showBackdrop?: boolean;
};

export default function GenericDropdown({
  children,
  items,
  onOpened,
  testId = 'dropdown',
  menuClassName = '',
  triggerClassName = '',
  showBackdrop = true,
}: GenericDropdownProps) {
  const [isOpened, setIsOpened] = useState(false);

  const handleItemClick = (item: DropdownItemType) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpened(false);
  };

  return (
    <div className="relative">
      {/* Backdrop to prevent clicks from propagating */}
      {isOpened && showBackdrop && (
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpened(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              setIsOpened(false);
            }
          }}
          className="fixed inset-0 bg-transparent z-40 cursor-default pointer-events-auto"
          aria-label="Close dropdown"
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
            role="button"
            tabIndex={0}
            className={`h-auto w-auto ${triggerClassName}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsOpened(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                setIsOpened(true);
              }
            }}
            aria-haspopup="menu"
            aria-expanded={isOpened}
          >
            {children}
          </span>
        </DropdownTrigger>
        <div className="w-full">
          <DropdownMenu
            data-testid={`${testId}-menu`}
            aria-label="Dropdown Actions"
            variant="faded"
            className={`rounded-xl border border-gray-800 bg-black shadow-lg shadow-white/20 p-0 ${menuClassName}`}
          >
            {items.map((item, index) => {
              const isFirst = index === 0;
              const isLast = index === items.length - 1;
              const borderRadius =
                (isFirst ? 'rounded-t-xl ' : '') +
                (isLast ? 'rounded-b-xl ' : '');
              const isDelete = item.label.toLowerCase() === 'delete';
              return (
                <DropdownItem
                  key={item.key}
                  data-testid={`${testId}-item-${item.key}`}
                  color={isDelete ? 'danger' : item.color}
                  startContent={item.icon}
                  className={`${borderRadius} hover:bg-white/10 hover:backdrop-blur-sm transition-all duration-200 py-2.5 ${item.className || ''} ${isDelete ? 'text-red-500' : ''}`}
                  onClick={() => {
                    handleItemClick(item);
                  }}
                >
                  {item.label}
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </div>
      </Dropdown>
    </div>
  );
}
