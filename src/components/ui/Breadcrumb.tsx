import React from 'react';
import { ArrowLeftIcon } from '@/components/ui/icons';

interface BreadcrumbProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showSubtitleOnMobile?: boolean;
}

export default function Breadcrumb({
  title,
  subtitle,
  onBack,
  showSubtitleOnMobile = false,
}: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-4 mb-3">
      {onBack && (
        <button
          onClick={onBack}
          className="p-4 hover:bg-muted rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon className="w-5 h-5 text-text-active" />
        </button>
      )}
      <div>
        <h1 className="xs:text-[20px] text-[17px] mt-2 font-bold text-text-active">
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
  );
}
