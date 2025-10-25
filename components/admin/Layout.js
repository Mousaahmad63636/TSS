import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import AuthGuard from '../AuthGuard';

export default function AdminLayout({ children }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  const navLinks = [
    { href: '/admin', label: 'Dashboard', exact: true },
    { href: '/admin/items', label: 'Menu Items', exact: false },
  ];

  const isActivePath = (path, exact) => {
    if (exact) return router.pathname === path;
    return router.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      router.push('/admin/firebase-login');
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-menu-gray-100">
      {/* Mobile Navigation Toggle */}
      <div className="lg:hidden p-4 bg-white border-b border-menu-gray-200">
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="text-menu-gray-600 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isNavOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isNavOpen ? 'block' : 'hidden'
          } lg:block w-64 bg-white border-r border-menu-gray-200 fixed inset-y-0 z-10 lg:z-0 transition-all duration-300 lg:translate-x-0 overflow-y-auto`}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-menu-gray-200">
              <h1 className="text-xl font-bold text-menu-gray-900">Menu Admin</h1>
              <p className="text-sm text-menu-gray-600 mt-1">
                {user?.email || 'Admin User'}
              </p>
            </div>

            <nav className="flex-1 px-2 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    isActivePath(link.href, link.exact)
                      ? 'bg-menu-accent-50 text-menu-accent-700'
                      : 'text-menu-gray-700 hover:bg-menu-gray-50'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-menu-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 lg:ml-64 transition-all duration-300`}>
          <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
      </div>
    </AuthGuard>
  );
}