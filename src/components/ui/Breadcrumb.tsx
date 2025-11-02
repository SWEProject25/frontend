import React from 'react';
import { ArrowLeftIcon } from '@/components/ui/icons';

interface BreadcrumbProps {
  title: string;
  subtitle?: string;
  description?: string;
  onBack?: () => void;
  showArrow?: boolean;
  showSubtitleOnMobile?: boolean;
}

export default function Breadcrumb({
  title,
  subtitle,
  description,
  onBack,
  showArrow,
  showSubtitleOnMobile = false,
}: BreadcrumbProps) {
  return (
    <div className="mb-3 p-4">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className={`${showArrow && showArrow == true ? '' : 'lg:hidden'} hover:bg-muted rounded-full transition-colors cursor-pointer`}
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-5 h-5 text-text-active" />
          </button>
        )}
        <div className="flex flex-col gap-0">
          <h1 className="xs:text-[15px]  text-[12px] mt-2 xs:mt-0 font-bold text-text-active">
            {title}
          </h1>
          {subtitle && (
            <p
              className={`text-[12px] text-text-secondary ${
                showSubtitleOnMobile ? '' : 'xs:hidden'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {description && (
        <p className="text-[13px] text-text-secondary mt-4 px-2">
          {description}
        </p>
      )}
    </div>
  );
}
