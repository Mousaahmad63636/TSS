// Simple page to initialize default categories
import { useState } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/AdminLayout';

export default function SetupCategories() {
  const [status, setStatus] = useState('ready'); // ready, loading, success, error
  const [message, setMessage] = useState('');

  const createDefaultCategories = async () => {
    setStatus('loading');
    setMessage('Creating default categories...');
    
    try {
      const response = await fetch('/api/create-default-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage('Default categories created successfully! You can now manage them in the Categories section.');
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to create default categories');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <AdminLayout title="Setup Categories">
      <Head>
        <title>Setup Categories -  Admin</title>
      </Head>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-menu-gray-100 p-8 text-center">
          <div className="w-16 h-16 bg-menu-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-menu-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-menu-gray-900 mb-4">Setup Default Categories</h1>
          <p className="text-menu-gray-600 mb-8">
            Get started quickly by creating a standard restaurant menu structure with main categories and subcategories.
          </p>

          {status === 'ready' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">What will be created:</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>🍽️ <strong>Food</strong> → Pizza, Pasta, Appetizers</div>
                  <div>☕ <strong>Beverages</strong> → Hot Drinks, Cold Drinks, Specialty Drinks</div>
                  <div>🧁 <strong>Desserts</strong> → Cakes, Ice Cream</div>
                  <div>🚬 <strong>Tobacco</strong> → Shisha, Cigarettes</div>
                </div>
              </div>
              
              <button
                onClick={createDefaultCategories}
                className="inline-flex items-center px-6 py-3 bg-menu-accent-500 text-white rounded-lg hover:bg-menu-accent-600 transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Default Categories
              </button>
            </div>
          )}

          {status === 'loading' && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-menu-accent-500 mx-auto"></div>
              <p className="text-menu-gray-600">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Setup Complete!</h3>
                <p className="text-green-700 mb-6">{message}</p>
              </div>
              <div className="flex justify-center space-x-4">
                <a
                  href="/admin/categories"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Manage Categories
                </a>
                <a
                  href="/admin/add-item"
                  className="inline-flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Add Menu Items
                </a>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Setup Failed</h3>
                <p className="text-red-700 mb-6">{message}</p>
              </div>
              <button
                onClick={() => setStatus('ready')}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Note</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>This will only create categories if none exist. If you already have categories, you can manage them directly in the Categories section.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
