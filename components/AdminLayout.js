import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import AuthGuard from './AuthGuard';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLayout({ children, title }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      router.push('/admin/firebase-login');
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-menu-gray-100">
        <Head>
          <title>{title} - Menu Admin</title>
        </Head>

        <nav className="bg-menu-accent-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-white font-bold text-xl">Menu Admin</span>
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <Link href="/admin/dashboard" className="text-white hover:bg-menu-accent-500 px-3 py-2 rounded-md text-sm font-medium">
                        Dashboard
                    </Link>
                    <Link href="/admin/categories" className="text-white hover:bg-menu-accent-500 px-3 py-2 rounded-md text-sm font-medium">
                        Categories
                    </Link>
                    <Link href="/admin/menu-items" className="text-white hover:bg-menu-accent-500 px-3 py-2 rounded-md text-sm font-medium">
                        Menu Items
                    </Link>
                    <Link href="/admin/add-item" className="text-white hover:bg-menu-accent-500 px-3 py-2 rounded-md text-sm font-medium">
                        Add New Item
                    </Link>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <button
                  onClick={handleSignOut}
                  className="text-white hover:bg-menu-accent-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
              <div className="-mr-2 flex md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-menu-accent-200 hover:text-white hover:bg-menu-accent-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-menu-accent-600 focus:ring-white"
                >
                  <span className="sr-only">Open main menu</span>
                  {!isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link href="/admin/dashboard" className="text-white hover:bg-menu-accent-500 block px-3 py-2 rounded-md text-base font-medium">
                    Dashboard
                </Link>
                <Link href="/admin/categories" className="text-white hover:bg-menu-accent-500 block px-3 py-2 rounded-md text-base font-medium">
                    Categories
                </Link>
                <Link href="/admin/menu-items" className="text-white hover:bg-menu-accent-500 block px-3 py-2 rounded-md text-base font-medium">
                    Menu Items
                </Link>
                <Link href="/admin/add-item" className="text-white hover:bg-menu-accent-500 block px-3 py-2 rounded-md text-base font-medium">
                    Add New Item
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-white hover:bg-menu-accent-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </nav>

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-menu-gray-900">{title}</h1>
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
