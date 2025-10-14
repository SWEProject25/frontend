import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@/components/ui/icons';

interface SettingsListItemProps {
  label: string;
  href: string;
  isActive?: boolean;
  showArrow?: boolean;
}

export default function SettingsListItem({
  label,
  href,
  isActive = false,
  showArrow = true,
}: SettingsListItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex flex-col items-stretch justify-between
        relative cursor-pointer
        py-3 px-4 min-h-[48px]
        transition-[background-color,box-shadow] duration-200
        outline-none
        ${isActive ? 'bg-muted' : ''}
        hover:bg-muted
      `}
      style={{
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
      }}
    >
      <div className="flex items-center w-full">
        <div className="text-text-active text-[14px]">{label}</div>
        {showArrow && (
          <ArrowRightIcon className="w-5 h-5 text-text-secondary ml-auto" />
        )}
      </div>
    </Link>
  );
}
