import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/AdminLayout';

export default function HierarchicalCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMainForm, setShowAddMainForm] = useState(false);
  const [showAddSubForm, setShowAddSubForm] = useState(null); // ID of main category
  const [editingMain, setEditingMain] = useState(null);
  const [editingSub, setEditingSub] = useState(null);
  
  const [mainCategoryForm, setMainCategoryForm] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    order: 0,
    isActive: true
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: '',
    description: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        if (response.status === 500) {
          console.warn('Categories API returned 500, starting with empty categories');
          setCategories([]);
          setError('Categories service unavailable. You can still create new categories.');
          return;
        }
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories([]);
      setError('Failed to load categories. Starting with empty list.');
    } finally {
      setIsLoading(false);
    }
  };

  // Main Category Operations
  const handleMainCategorySubmit = async (e) => {
    e.preventDefault();
    
    try {
      const categoryData = {
        ...mainCategoryForm,
        subcategories: []
      };
      
      if (editingMain) {
        const response = await fetch(`/api/categories/${editingMain.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
        if (!response.ok) throw new Error('Failed to update main category');
      } else {
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData),
        });
        if (!response.ok) throw new Error('Failed to create main category');
      }
      
      await loadCategories();
      resetMainForm();
    } catch (err) {
      console.error('Error saving main category:', err);
      setError('Failed to save main category');
    }
  };

  const handleDeleteMainCategory = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" and all its subcategories? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete main category');
        await loadCategories();
      } catch (err) {
        console.error('Error deleting main category:', err);
        setError('Failed to delete main category');
      }
    }
  };

  // Subcategory Operations
  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    
    try {
      const mainCategory = categories.find(cat => cat.id === showAddSubForm || editingSub?.mainCategoryId);
      if (!mainCategory) throw new Error('Main category not found');

      let updatedSubcategories = [...(mainCategory.subcategories || [])];
      
      if (editingSub) {
        // Update existing subcategory
        const index = updatedSubcategories.findIndex(sub => sub.id === editingSub.id);
        if (index !== -1) {
          updatedSubcategories[index] = { 
            ...updatedSubcategories[index], 
            ...subcategoryForm 
          };
        }
      } else {
        // Add new subcategory
        const newSubcategory = {
          id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...subcategoryForm
        };
        updatedSubcategories.push(newSubcategory);
      }

      const response = await fetch(`/api/categories/${mainCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subcategories: updatedSubcategories }),
      });
      
      if (!response.ok) throw new Error('Failed to save subcategory');
      
      await loadCategories();
      resetSubForm();
    } catch (err) {
      console.error('Error saving subcategory:', err);
      setError('Failed to save subcategory');
    }
  };

  const handleDeleteSubcategory = async (mainCategoryId, subcategoryId, subcategoryName) => {
    if (window.confirm(`Are you sure you want to delete "${subcategoryName}"?`)) {
      try {
        const mainCategory = categories.find(cat => cat.id === mainCategoryId);
        const updatedSubcategories = (mainCategory.subcategories || []).filter(sub => sub.id !== subcategoryId);
        
        const response = await fetch(`/api/categories/${mainCategoryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subcategories: updatedSubcategories }),
        });
        
        if (!response.ok) throw new Error('Failed to delete subcategory');
        await loadCategories();
      } catch (err) {
        console.error('Error deleting subcategory:', err);
        setError('Failed to delete subcategory');
      }
    }
  };

  // Form Management
  const resetMainForm = () => {
    setMainCategoryForm({
      name: '',
      description: '',
      color: '#3B82F6',
      order: 0,
      isActive: true
    });
    setEditingMain(null);
    setShowAddMainForm(false);
  };

  const resetSubForm = () => {
    setSubcategoryForm({
      name: '',
      description: '',
      order: 0,
      isActive: true
    });
    setEditingSub(null);
    setShowAddSubForm(null);
  };

  const startEditMain = (category) => {
    setEditingMain(category);
    setMainCategoryForm({
      name: category.name,
      description: category.description || '',
      color: category.color || '#3B82F6',
      order: category.order || 0,
      isActive: category.isActive !== false
    });
    setShowAddMainForm(true);
  };

  const startEditSub = (mainCategoryId, subcategory) => {
    setEditingSub({ ...subcategory, mainCategoryId });
    setSubcategoryForm({
      name: subcategory.name,
      description: subcategory.description || '',
      order: subcategory.order || 0,
      isActive: subcategory.isActive !== false
    });
    setShowAddSubForm(mainCategoryId);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-menu-accent-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Menu Categories">
      <Head>
        <title>Menu Categories -  Admin</title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-menu-gray-900">Menu Categories</h1>
            <p className="mt-1 text-menu-gray-600">Organize your menu with main categories and subcategories</p>
          </div>
          <button
            onClick={() => setShowAddMainForm(true)}
            className="inline-flex items-center px-4 py-2 bg-menu-accent-500 text-white rounded-lg hover:bg-menu-accent-600 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Main Category
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Add/Edit Main Category Form */}
        {showAddMainForm && (
          <div className="bg-white rounded-xl shadow-sm border border-menu-gray-100">
            <div className="p-6 border-b border-menu-gray-100">
              <h2 className="text-lg font-semibold text-menu-gray-900">
                {editingMain ? 'Edit Main Category' : 'Add Main Category'}
              </h2>
            </div>
            
            <form onSubmit={handleMainCategorySubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-menu-gray-700 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={mainCategoryForm.name}
                    onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, name: e.target.value })}
                    className="block w-full px-3 py-2 border border-menu-gray-300 rounded-lg focus:outline-none focus:ring-menu-accent-500 focus:border-menu-accent-500"
                    placeholder="e.g., Food, Beverages, Desserts"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-menu-gray-700 mb-2">
                    Theme Color
                  </label>
                  <input
                    type="color"
                    value={mainCategoryForm.color}
                    onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, color: e.target.value })}
                    className="block w-full h-10 border border-menu-gray-300 rounded-lg focus:outline-none focus:ring-menu-accent-500 focus:border-menu-accent-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-menu-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={mainCategoryForm.order}
                    onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, order: parseInt(e.target.value) || 0 })}
                    className="block w-full px-3 py-2 border border-menu-gray-300 rounded-lg focus:outline-none focus:ring-menu-accent-500 focus:border-menu-accent-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-menu-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={mainCategoryForm.description}
                  onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, description: e.target.value })}
                  className="block w-full px-3 py-2 border border-menu-gray-300 rounded-lg focus:outline-none focus:ring-menu-accent-500 focus:border-menu-accent-500"
                  placeholder="Brief description of this category"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={mainCategoryForm.isActive}
                  onChange={(e) => setMainCategoryForm({ ...mainCategoryForm, isActive: e.target.checked })}
                  className="h-4 w-4 text-menu-accent-600 focus:ring-menu-accent-500 border-menu-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-menu-gray-700">
                  Active (visible on menu)
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetMainForm}
                  className="px-4 py-2 border border-menu-gray-300 rounded-lg text-menu-gray-700 bg-white hover:bg-menu-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-menu-accent-500 text-white rounded-lg hover:bg-menu-accent-600 transition-colors"
                >
                  {editingMain ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add/Edit Subcategory Form */}
        {showAddSubForm && (
          <div className="bg-blue-50 rounded-xl shadow-sm border border-blue-200">
            <div className="p-6 border-b border-blue-200">
              <h2 className="text-lg font-semibold text-blue-900">
                {editingSub ? 'Edit Subcategory' : `Add Subcategory to "${categories.find(c => c.id === showAddSubForm)?.name}"`}
              </h2>
            </div>
            
            <form onSubmit={handleSubcategorySubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Subcategory Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={subcategoryForm.name}
                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value })}
                    className="block w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Pizza, Pasta, Hot Drinks"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={subcategoryForm.order}
                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, order: parseInt(e.target.value) || 0 })}
                    className="block w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={subcategoryForm.description}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                  className="block w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of this subcategory"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={subcategoryForm.isActive}
                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
                />
                <label className="ml-2 block text-sm text-blue-700">
                  Active (visible on menu)
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetSubForm}
                  className="px-4 py-2 border border-blue-300 rounded-lg text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingSub ? 'Update Subcategory' : 'Add Subcategory'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="space-y-4">
          {categories.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-menu-gray-100 p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-menu-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-menu-gray-900">No categories yet</h3>
              <p className="mt-2 text-menu-gray-500">Get started by creating your first main category.</p>
              <button
                onClick={() => setShowAddMainForm(true)}
                className="mt-4 inline-flex items-center px-4 py-2 bg-menu-accent-500 text-white rounded-lg hover:bg-menu-accent-600 transition-colors"
              >
                Create First Category
              </button>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-menu-gray-100 overflow-hidden">
                {/* Main Category Header */}
                <div className="p-6" style={{ borderLeft: `4px solid ${category.color || '#3B82F6'}` }}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: category.color || '#3B82F6' }}
                        ></div>
                        <h3 className="text-xl font-semibold text-menu-gray-900">{category.name}</h3>
                        <span className="ml-3 text-sm text-menu-gray-500">Order: {category.order || 0}</span>
                        {!category.isActive && (
                          <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                      </div>
                      {category.description && (
                        <p className="mt-2 text-menu-gray-600">{category.description}</p>
                      )}
                      <p className="mt-1 text-sm text-menu-gray-500">
                        {(category.subcategories || []).length} subcategories
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-3 ml-4">
                      <button
                        onClick={() => setShowAddSubForm(category.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Sub
                      </button>
                      
                      <button
                        onClick={() => startEditMain(category)}
                        className="inline-flex items-center px-3 py-1.5 border border-menu-gray-300 rounded-lg text-sm font-medium text-menu-gray-700 bg-white hover:bg-menu-gray-50 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDeleteMainCategory(category.id, category.name)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                {(category.subcategories || []).length > 0 && (
                  <div className="border-t border-menu-gray-100">
                    <div className="px-6 py-4 bg-menu-gray-50">
                      <h4 className="text-sm font-medium text-menu-gray-700">Subcategories</h4>
                    </div>
                    <div className="divide-y divide-menu-gray-100">
                      {category.subcategories
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((subcategory) => (
                        <div key={subcategory.id} className="p-4 bg-white hover:bg-menu-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 text-menu-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <h5 className="text-menu-gray-900 font-medium">{subcategory.name}</h5>
                                <span className="ml-3 text-sm text-menu-gray-500">Order: {subcategory.order || 0}</span>
                                {!subcategory.isActive && (
                                  <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              {subcategory.description && (
                                <p className="mt-1 text-sm text-menu-gray-600 ml-6">{subcategory.description}</p>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => startEditSub(category.id, subcategory)}
                                className="inline-flex items-center px-2 py-1 border border-menu-gray-300 rounded text-xs font-medium text-menu-gray-700 bg-white hover:bg-menu-gray-50 transition-colors"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              
                              <button
                                onClick={() => handleDeleteSubcategory(category.id, subcategory.id, subcategory.name)}
                                className="inline-flex items-center px-2 py-1 border border-red-300 rounded text-xs font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
