import React from 'react';
import { ArrowRightIcon } from '@/components/ui/icons';

interface OptionItemProps {
  label: string;
  description?: string;
  showArrow?: boolean;
  icon?: React.ReactNode;
  'data-testid'?: string;
}

export default function OptionItem({
  label,
  description,
  showArrow = true,
  icon,
  'data-testid': dataTestId,
}: OptionItemProps) {
  return (
    <>
      <div
        className="flex items-center gap-3 flex-1"
        data-testid={dataTestId ? `${dataTestId}-content` : undefined}
      >
        {icon && (
          <div
            className="text-text-secondary flex items-center p-3"
            data-testid={dataTestId ? `${dataTestId}-icon` : undefined}
          >
            {icon}
          </div>
        )}
        <div className="flex-1">
          <div
            className="text-text-active text-[14px]"
            data-testid={dataTestId ? `${dataTestId}-label` : undefined}
          >
            {label}
          </div>
          {description && (
            <div
              className="text-[12px] text-text-secondary mt-1"
              data-testid={dataTestId ? `${dataTestId}-description` : undefined}
            >
              {description}
            </div>
          )}
        </div>
      </div>
      {showArrow && (
        <ArrowRightIcon
          className="w-5 h-5 text-text-secondary shrink-0"
          data-testid={dataTestId ? `${dataTestId}-arrow` : undefined}
        />
      )}
    </>
  );
}
