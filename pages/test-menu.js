import { useState } from 'react';
import Head from 'next/head';

export default function TestMenu() {
  const [menuData, setMenuData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const testMenuAPI = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Testing /api/menu...');
      const response = await fetch('/api/menu');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Menu data received:', data);
      setMenuData(data);
      
    } catch (err) {
      console.error('Menu API test failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Menu API Test - </title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Menu API Test</h1>
            
            <div className="space-y-4">
              <button
                onClick={testMenuAPI}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test /api/menu'}
              </button>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h3 className="text-red-800 font-medium">Error:</h3>
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {menuData && (
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <h3 className="text-green-800 font-medium mb-2">Success! Menu Data:</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Restaurant:</strong> {menuData.restaurant?.name}</p>
                    <p><strong>Categories:</strong> {menuData.mainCategories?.length || 0}</p>
                    
                    {menuData.mainCategories?.map(category => (
                      <div key={category.id} className="ml-4 p-2 bg-white rounded border">
                        <p><strong>{category.name}</strong> ({category.subcategories?.length || 0} subcategories)</p>
                        {category.subcategories?.map(sub => (
                          <div key={sub.id} className="ml-4 text-gray-600">
                            - {sub.name} ({sub.items?.length || 0} items)
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="text-blue-800 font-medium mb-2">API Testing Instructions:</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>1. Click "Test /api/menu" to verify the API works</p>
                  <p>2. Check browser console for detailed logs</p>
                  <p>3. If successful, the homepage should work</p>
                  <p>4. If it fails, check Firebase configuration</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <h3 className="text-yellow-800 font-medium mb-2">Navigation:</h3>
                <div className="space-x-4">
                  <a href="/admin/setup-categories" className="text-blue-600 hover:underline">
                    Setup Categories
                  </a>
                  <a href="/admin/categories" className="text-blue-600 hover:underline">
                    Manage Categories
                  </a>
                  <a href="/admin/add-item" className="text-blue-600 hover:underline">
                    Add Menu Items
                  </a>
                  <a href="/" className="text-blue-600 hover:underline">
                    Public Menu
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
