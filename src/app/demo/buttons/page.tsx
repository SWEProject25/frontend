import Link from 'next/link';
import { XLogo } from '@/components/ui/icons';

export default function ButtonsIndexPage() {
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <XLogo className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Button Components
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our button components including general-purpose buttons and
            authentication buttons.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* General Buttons Card */}
            <Link href="/demo/buttons/general">
              <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-primary transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 text-center">
                  General Buttons
                </h2>
                <p className="text-gray-400 text-center mb-4">
                  Primary, secondary, outline, and ghost button variants with
                  different sizes and states.
                </p>
                <div className="text-center">
                  <span className="text-primary group-hover:text-primary-hover font-medium">
                    View Examples →
                  </span>
                </div>
              </div>
            </Link>

            {/* Auth Buttons Card */}
            <Link href="/demo/buttons/auth">
              <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-primary transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 text-center">
                  Auth Buttons
                </h2>
                <p className="text-gray-400 text-center mb-4">
                  Social login buttons for Google, Apple, Facebook, GitHub, and
                  more authentication providers.
                </p>
                <div className="text-center">
                  <span className="text-primary group-hover:text-primary-hover font-medium">
                    View Examples →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/demo"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Demos
            </Link>
            <Link
              href="/demo/inputs"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Input Components →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
