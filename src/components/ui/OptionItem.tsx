import React from 'react';
import { ArrowRightIcon } from '@/components/ui/icons';

interface OptionItemProps {
  label: string;
  description?: string;
  showArrow?: boolean;
  icon?: React.ReactNode;
}

export default function OptionItem({
  label,
  description,
  showArrow = true,
  icon,
}: OptionItemProps) {
  return (
    <>
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
    </>
  );
}
