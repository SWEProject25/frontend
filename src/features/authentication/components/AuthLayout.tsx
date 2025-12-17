import { XLogo } from '@/components/ui/icons';
import { AuthLayoutProps } from '../types';

export function AuthLayout({ children, showLogo = true }: AuthLayoutProps) {
  return (
    <div className="h-full bg-background flex">
      {/* Left Section - Logo */}
      {showLogo && (
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-background">
          <div className="w-full flex justify-center">
            <XLogo className="w-96 h-96 text-foreground" />
          </div>
        </div>
      )}

      {/* Right Section - Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start">
        <div className="px-8">{children}</div>
      </div>
    </div>
  );
}
