import React from 'react';
import Link from 'next/link';
import { ArrowRightIcon } from '@/components/ui/icons';

interface SubOptionItemProps {
  label: string;
  description?: string;
  href: string;
  isActive?: boolean;
  icon?: React.ReactNode;
}

export default function SubOptionItem({
  label,
  description,
  href,
  isActive = false,
  icon,
}: SubOptionItemProps) {
  return (
    <Link
      href={href}
      className={`
        flex items-center justify-between
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
      <div className="flex items-start gap-3 flex-1">
        {icon && <div className="mt-0.5 text-text-secondary">{icon}</div>}
        <div className="flex-1">
          <div className="text-text-active text-[15px] font-medium">
            {label}
          </div>
          {description && (
            <div className="text-sm text-text-secondary mt-1">
              {description}
            </div>
          )}
        </div>
      </div>
      <ArrowRightIcon className="w-5 h-5 text-text-secondary flex-shrink-0" />
    </Link>
  );
}
