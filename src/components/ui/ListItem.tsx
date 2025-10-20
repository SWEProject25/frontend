import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@/components/ui/icons';

interface ListItemProps {
  label: string;
  description?: string;
  href: string;
  isActive?: boolean;
  showArrow?: boolean;
  icon?: React.ReactNode;
}

export default function ListItem({
  label,
  description,
  href,
  isActive = false,
  showArrow = true,
  icon,
}: ListItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center justify-between
        relative cursor-pointer
        py-3 px-4 min-h-[48px]
        transition-[background-color,box-shadow] duration-200
        outline-none
        ${isActive ? 'bg-muted border-r-2 border-r-primary' : ''}
        hover:bg-muted
      `}
      style={{
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        {icon && (
          <div className="text-text-secondary flex items-center p-3">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <div className="text-text-active text-[14px]">{label}</div>
          {description && (
            <div className="text-[12px] text-text-secondary mt-1">
              {description}
            </div>
          )}
        </div>
      </div>
      {showArrow && (
        <ArrowRightIcon className="w-5 h-5 text-text-secondary flex-shrink-0" />
      )}
    </Link>
  );
}
