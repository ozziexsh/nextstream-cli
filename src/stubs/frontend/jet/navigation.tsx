import { useState } from 'react';
import classNames from 'classnames';
import JetApplicationMark from './application-mark';
import JetDropdown from './dropdown';
import JetDropdownLink from './dropdown-link';
import JetNavigationLink from './navigation-link';
import JetResponsiveNavigationLink from './responsive-navigation-link';
import { useFeatures, useUser } from './providers';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function JetNavigation() {
  const user = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { hasProfilePhotoFeatures, hasApiFeatures } = useFeatures();
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a>
                  <JetApplicationMark className="block h-9 w-auto" />
                </a>
              </Link>
            </div>

            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
              <JetNavigationLink href={'/'} active={router.pathname === '/'}>
                Dashboard
              </JetNavigationLink>
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:ml-6">
            <div className="ml-3 relative">
              <JetDropdown
                renderTrigger={({ Trigger }) =>
                  hasProfilePhotoFeatures ? (
                    <Trigger className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out">
                      {user.profile_photo_url && (
                        <img
                          className="h-8 w-8 rounded-full object-cover"
                          src={user.profile_photo_url}
                          alt={user.name}
                        />
                      )}
                    </Trigger>
                  ) : (
                    <span className="inline-flex rounded-md">
                      <Trigger className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150">
                        {user?.name}
                        <svg
                          className="ml-2 -mr-0.5 h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Trigger>
                    </span>
                  )
                }
              >
                {({ DropdownItem }) => (
                  <>
                    <div className="block px-4 py-2 text-xs text-gray-400">
                      Manage Account
                    </div>
                    <DropdownItem>
                      <JetDropdownLink href="/settings">
                        Settings
                      </JetDropdownLink>
                    </DropdownItem>
                    {hasApiFeatures && (
                      <DropdownItem>
                        <JetDropdownLink href="/settings/api-tokens">
                          API Tokens
                        </JetDropdownLink>
                      </DropdownItem>
                    )}
                    <div className="border-t border-gray-100"></div>
                    <DropdownItem>
                      <a
                        href="/logout"
                        className={
                          'block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out'
                        }
                      >
                        Logout
                      </a>
                    </DropdownItem>
                  </>
                )}
              </JetDropdown>
            </div>
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  className={classNames({
                    hidden: mobileOpen,
                    'inline-flex': !mobileOpen,
                  })}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  className={classNames({
                    hidden: !mobileOpen,
                    'inline-flex': mobileOpen,
                  })}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={classNames('sm:hidden', {
          block: mobileOpen,
          hidden: !mobileOpen,
        })}
      >
        <div className="pt-2 pb-3 space-y-1">
          {/* "request()->routeIs('dashboard')" */}
          <JetResponsiveNavigationLink
            href={'/'}
            active={router.pathname === '/'}
          >
            Dashboard
          </JetResponsiveNavigationLink>
        </div>

        <div className="pt-4 pb-1 border-t border-gray-200">
          <div className="flex items-center px-4">
            {hasProfilePhotoFeatures && user.profile_photo_url && (
              <div className="flex-shrink-0 mr-3">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={user.profile_photo_url}
                  alt={user.name}
                />
              </div>
            )}

            <div>
              <div className="font-medium text-base text-gray-800">
                {user?.name}
              </div>
              <div className="font-medium text-sm text-gray-500">
                {user?.email}
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            {/* "request()->routeIs('profile.show')" */}
            <JetResponsiveNavigationLink href="/settings" active={false}>
              Settings
            </JetResponsiveNavigationLink>
            {/* "request()->routeIs('api-tokens.index')" */}
            {hasApiFeatures && (
              <JetResponsiveNavigationLink
                href="/settings/api-tokens"
                active={false}
              >
                API Tokens
              </JetResponsiveNavigationLink>
            )}
            <a
              href="/logout"
              className={
                'block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out'
              }
            >
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
