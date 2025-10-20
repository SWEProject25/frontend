import React from 'react';
import Link from 'next/link';

interface ListItemProps {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function ListItem({
  href,
  isActive = false,
  children,
  className = '',
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
        ${isActive ? 'bg-muted border-r-4 border-r-primary' : ''}
        hover:bg-muted
        ${className}
      `}
      style={{
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
      }}
    >
      {children}
    </Link>
  );
}
