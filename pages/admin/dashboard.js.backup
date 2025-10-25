import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [migrationStatus, setMigrationStatus] = useState('');
  const [isRunningMigration, setIsRunningMigration] = useState(false);
  const [menuStats, setMenuStats] = useState({
    totalItems: 0,
    categories: 0,
    loading: true
  });

  useEffect(() => {
    fetchMenuStats();
  }, []);

  const fetchMenuStats = async () => {
    try {
      const response = await fetch('/api/menu-items');
      if (response.ok) {
        const items = await response.json();
        const categories = new Set(items.map(item => item.category)).size;
        setMenuStats({
          totalItems: items.length,
          categories: categories,
          loading: false
        });
      }
    } catch (error) {
      console.error('Failed to fetch menu stats:', error);
      setMenuStats(prev => ({ ...prev, loading: false }));
    }
  };

  const runMigration = async () => {
    setIsRunningMigration(true);
    setMigrationStatus('Running migration...');
    
    try {
      const response = await fetch('/api/migrate-menu-items', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setMigrationStatus(`Migration completed! Migrated ${result.migratedCount} items.`);
        // Refresh stats after migration
        fetchMenuStats();
      } else {
        setMigrationStatus(`Migration failed: ${result.error}`);
      }
    } catch (error) {
      setMigrationStatus(`Migration error: ${error.message}`);
    } finally {
      setIsRunningMigration(false);
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-menu-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-menu-gray-900">
            Menu Management System
          </h3>
          <div className="mt-2 max-w-xl text-sm text-menu-gray-500">
            <p>
              Welcome to the menu administration dashboard. Use the options below to manage your menu items.
            </p>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-menu-accent-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-menu-accent-800 truncate">
                    Menu Items
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-menu-accent-900">
                    {menuStats.loading ? '...' : menuStats.totalItems}
                  </dd>
                </dl>
                <div className="mt-4">
                  <Link href="/admin/menu-items" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-menu-accent-600 hover:bg-menu-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-menu-accent-500">
                      View All
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-green-800 truncate">
                    Categories
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-green-900">
                    {menuStats.loading ? '...' : menuStats.categories}
                  </dd>
                </dl>
                <div className="mt-4">
                  <Link href="/admin/categories" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      Manage Categories
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-amber-800 truncate">
                    Add New Item
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-amber-900">
                    <span className="text-2xl">+</span>
                  </dd>
                </dl>
                <div className="mt-4">
                  <Link href="/admin/add-item" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
                      Create New
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Migration Section */}
          <div className="mt-8 border-t border-menu-gray-200 pt-6">
            <h4 className="text-lg font-medium text-menu-gray-900 mb-4">System Utilities</h4>
            <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h5 className="text-sm font-medium text-blue-800 mb-2">
                  Migrate Menu Items
                </h5>
                <p className="text-sm text-blue-600 mb-4">
                  Fix item IDs for proper editing functionality. Run this if you're having trouble editing existing items.
                </p>
                <button
                  onClick={runMigration}
                  disabled={isRunningMigration}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRunningMigration ? 'Running...' : 'Run Migration'}
                </button>
                {migrationStatus && (
                  <p className="mt-3 text-sm text-blue-800">
                    {migrationStatus}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
