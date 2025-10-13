import Link from 'next/link';
import { XLogo } from '@/components/ui/icons';

export default function DemoIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <XLogo className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Component Library Demo
          </h1>
          <p className="text-text-inactive text-lg max-w-2xl mx-auto">
            Explore our comprehensive collection of reusable UI components built
            with clean architecture principles. All components follow X/Twitter
            design patterns and are fully responsive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Generic Auth Forms */}
          <Link
            href="/demo/auth-forms"
            className="group block p-8 bg-muted rounded-xl border border-border hover:bg-border-hover hover:border-border-hover transition-all duration-200"
          >
            <div className="mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-foreground text-xl font-bold mb-3">
              Generic Auth Forms
            </h2>
            <p className="text-text-inactive mb-4 text-sm">
              Responsive authentication forms with modal/full-page modes.
              Includes login, register, password reset, and custom form
              examples.
            </p>
            <div className="text-primary font-medium group-hover:text-primary-hover transition-colors">
              Explore Forms →
            </div>
          </Link>

          {/* Button Components */}
          <Link
            href="/demo/buttons"
            className="group block p-8 bg-muted rounded-xl border border-border hover:bg-border-hover hover:border-border-hover transition-all duration-200"
          >
            <div className="mb-4">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-foreground text-xl font-bold mb-3">
              Button Components
            </h2>
            <p className="text-text-inactive mb-4 text-sm">
              All button variants including social login, primary, secondary,
              outline, and ghost styles with loading states.
            </p>
            <div className="text-primary font-medium group-hover:text-primary-hover transition-colors">
              View Buttons →
            </div>
          </Link>

          {/* Input Components */}
          <Link
            href="/demo/inputs"
            className="group block p-8 bg-muted rounded-xl border border-border hover:bg-border-hover hover:border-border-hover transition-all duration-200"
          >
            <div className="mb-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>
            <h2 className="text-foreground text-xl font-bold mb-3">
              Input Components
            </h2>
            <p className="text-text-inactive mb-4 text-sm">
              Input fields, select dropdowns, floating labels, password toggles,
              character counters, and validation states.
            </p>
            <div className="text-primary font-medium group-hover:text-primary-hover transition-colors">
              View Inputs →
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-foreground font-semibold mb-2">
                Responsive Design
              </h3>
              <p className="text-text-inactive text-sm">
                Components automatically adapt to screen size with
                modal/full-page modes
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-foreground font-semibold mb-2">TypeScript</h3>
              <p className="text-text-inactive text-sm">
                Fully typed components with comprehensive interfaces and type
                safety
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-foreground font-semibold mb-2">Reusable</h3>
              <p className="text-text-inactive text-sm">
                Generic components that can be used anywhere in your project
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/auth/login"
              className="text-primary hover:text-primary-hover transition-colors"
            >
              Login Page
            </Link>
            <Link
              href="/auth/register"
              className="text-primary hover:text-primary-hover transition-colors"
            >
              Register Page
            </Link>
            <Link
              href="/"
              className="text-primary hover:text-primary-hover transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
