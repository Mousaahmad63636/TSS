import { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageUpload from './ImageUpload';

export default function ItemForm({ initialData, onSubmit, isSubmitting, isEditing = false }) {
  // State for dynamic category options
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  // Load categories on component mount
  useEffect(() => {
    const loadCategoryOptions = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categories = await response.json();
        
        // Transform categories to options format
        const options = [];
        categories.forEach(mainCat => {
          (mainCat.subcategories || []).forEach(subCat => {
            options.push({
              value: `${mainCat.id}-${subCat.id}`,
              label: `${mainCat.name} > ${subCat.name}`,
              mainCategory: mainCat.id,
              subCategory: subCat.id
            });
          });
        });
        
        setCategoryOptions(options);
      } catch (error) {
        console.error('Failed to load categories:', error);
        setCategoryOptions([]);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    loadCategoryOptions();
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    description2: '',
    price: '',
    image: '',
    allergens: '',
    isvegetarian: false,
    preptime: '',
    popular: false,
    agerestricted: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || '',
        description: initialData.description || '',
        description2: initialData.description2 || '',
        price: initialData.price ? parseFloat(initialData.price).toFixed(2) : '',
        image: initialData.image || '',
        allergens: initialData.allergens ? initialData.allergens.join(';') : '',
        isvegetarian: initialData.isVegetarian || false,
        preptime: initialData.prepTime || '',
        popular: initialData.popular || false,
        agerestricted: initialData.ageRestricted || false
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-menu-gray-700">
              Item Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-menu-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-menu-accent-500 focus:border-menu-accent-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-menu-gray-700">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              disabled={loadingCategories}
              className="mt-1 block w-full bg-white border border-menu-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-menu-accent-500 focus:border-menu-accent-500 sm:text-sm disabled:opacity-50"
            >
              <option value="">
                {loadingCategories ? 'Loading categories...' : 'Select a category'}
              </option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-menu-gray-700">
              Price *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-menu-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full border border-menu-gray-300 rounded-md shadow-sm py-2 pl-7 pr-3 focus:outline-none focus:ring-menu-accent-500 focus:border-menu-accent-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-menu-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full border border-menu-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-menu-accent-500 focus:border-menu-accent-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description2" className="block text-sm font-medium text-menu-gray-700">
              Additional Description
            </label>
            <textarea
              id="description2"
              name="description2"
              rows={2}
              value={formData.description2}
              onChange={handleChange}
              className="mt-1 block w-full border border-menu-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-menu-accent-500 focus:border-menu-accent-500 sm:text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <ImageUpload 
              value={formData.image}
              onChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
              label="Menu Item Image"
            />
          </div>

          <div>
            <label htmlFor="allergens" className="block text-sm font-medium text-menu-gray-700">
              Allergens (separated by semicolons)
            </label>
            <input
              type="text"
              name="allergens"
              id="allergens"
              value={formData.allergens}
              onChange={handleChange}
              className="mt-1 block w-full border border-menu-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-menu-accent-500 focus:border-menu-accent-500 sm:text-sm"
              placeholder="Gluten;Dairy;Nuts"
            />
          </div>

          <div>
            <label htmlFor="preptime" className="block text-sm font-medium text-menu-gray-700">
              Preparation Time
            </label>
            <input
              type="text"
              name="preptime"
              id="preptime"
              value={formData.preptime}
              onChange={handleChange}
              className="mt-1 block w-full border border-menu-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-menu-accent-500 focus:border-menu-accent-500 sm:text-sm"
              placeholder="15 minutes"
            />
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <input
                  id="isvegetarian"
                  name="isvegetarian"
                  type="checkbox"
                  checked={formData.isvegetarian}
                  onChange={handleChange}
                  className="h-4 w-4 text-menu-accent-600 focus:ring-menu-accent-500 border-menu-gray-300 rounded"
                />
                <label htmlFor="isvegetarian" className="ml-2 block text-sm text-menu-gray-700">
                  Vegetarian
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="popular"
                  name="popular"
                  type="checkbox"
                  checked={formData.popular}
                  onChange={handleChange}
                  className="h-4 w-4 text-menu-accent-600 focus:ring-menu-accent-500 border-menu-gray-300 rounded"
                />
                <label htmlFor="popular" className="ml-2 block text-sm text-menu-gray-700">
                  Popular Item
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="agerestricted"
                  name="agerestricted"
                  type="checkbox"
                  checked={formData.agerestricted}
                  onChange={handleChange}
                  className="h-4 w-4 text-menu-accent-600 focus:ring-menu-accent-500 border-menu-gray-300 rounded"
                />
                <label htmlFor="agerestricted" className="ml-2 block text-sm text-menu-gray-700">
                  Age Restricted
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-menu-gray-50 text-right sm:px-6 flex justify-end space-x-3">
        <Link href="/admin/menu-items" className="inline-flex justify-center py-2 px-4 border border-menu-gray-300 shadow-sm text-sm font-medium rounded-md text-menu-gray-700 bg-white hover:bg-menu-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-menu-accent-500">
            Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-menu-accent-600 hover:bg-menu-accent-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-menu-accent-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}
