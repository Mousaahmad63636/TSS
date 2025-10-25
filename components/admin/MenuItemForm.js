import { useState, useEffect } from 'react';
import ImageUpload from '../ImageUpload';

export default function MenuItemForm({ initialData, onSubmit, isSubmitting }) {
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
    name: initialData?.name || '',
    description: initialData?.description || '',
    description2: initialData?.description2 || '',
    category: initialData?.category || '',
    price: initialData?.price || '',
    image: initialData?.image || '',
    allergens: initialData?.allergens ? initialData.allergens.join(';') : '',
    isvegetarian: initialData?.isVegetarian ? 'yes' : 'no',
    preptime: initialData?.prepTime || '',
    popular: initialData?.popular ? 'yes' : 'no',
    agerestricted: initialData?.ageRestricted ? 'yes' : 'no',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear the error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Price must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-menu-gray-700">
            Item Name*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md ${
              errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-menu-gray-300 focus:border-menu-accent-500 focus:ring-menu-accent-500'
            } shadow-sm sm:text-sm`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-menu-gray-700">
            Category*
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loadingCategories}
            className={`mt-1 block w-full rounded-md ${
              errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-menu-gray-300 focus:border-menu-accent-500 focus:ring-menu-accent-500'
            } shadow-sm sm:text-sm disabled:opacity-50`}
          >
            <option value="">
              {loadingCategories ? 'Loading categories...' : 'Select a category...'}
            </option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-menu-gray-700">
            Price*
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md ${
              errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-menu-gray-300 focus:border-menu-accent-500 focus:ring-menu-accent-500'
            } shadow-sm sm:text-sm`}
            placeholder="0.00"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>

        <div>
          <ImageUpload 
            value={formData.image}
            onChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
            label="Menu Item Image"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-menu-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-menu-gray-300 focus:border-menu-accent-500 focus:ring-menu-accent-500 shadow-sm sm:text-sm"
        ></textarea>
      </div>

      <div>
        <label htmlFor="description2" className="block text-sm font-medium text-menu-gray-700">
          Additional Description
        </label>
        <textarea
          id="description2"
          name="description2"
          rows="2"
          value={formData.description2}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-menu-gray-300 focus:border-menu-accent-500 focus:ring-menu-accent-500 shadow-sm sm:text-sm"
        ></textarea>
      </div>

      <div>
        <label htmlFor="allergens" className="block text-sm font-medium text-menu-gray-700">
          Allergens (separated by semicolons)
        </label>
        <input
          type="text"
          id="allergens"
          name="allergens"
          value={formData.allergens}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-menu-gray-300 focus:border-menu-accent-500 focus:ring-menu-accent-500 shadow-sm sm:text-sm"
          placeholder="gluten;nuts;dairy"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="isvegetarian" className="block text-sm font-medium text-menu-gray-700">
            Vegetarian
          </label>
          <select
            id="isvegetarian"
            name="isvegetarian"
            value={formData.isvegetarian}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-menu-gray-300 focus:border-menu-accent-500 focus:ring-menu-accent-500 shadow-sm sm:text-sm"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label htmlFor="popular" className="block text-sm font-medium text-menu-gray-700">
            Popular Item
          </label>
          <select
            id="popular"
            name="popular"
            value={formData.popular}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-menu-gray-300 focus:border-menu-accent-500 focus:ring-menu-accent-500 shadow-sm sm:text-sm"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        <div>
          <label htmlFor="agerestricted" className="block text-sm font-medium text-menu-gray-700">
            Age Restricted
          </label>
          <select
            id="agerestricted"
            name="agerestricted"
            value={formData.agerestricted}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-menu-gray-300 focus:border-menu-accent-500 focus:ring-menu-accent-500 shadow-sm sm:text-sm"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="preptime" className="block text-sm font-medium text-menu-gray-700">
          Preparation Time
        </label>
        <input
          type="text"
          id="preptime"
          name="preptime"
          value={formData.preptime}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-menu-gray-300 focus:border-menu-accent-500 focus:ring-menu-accent-500 shadow-sm sm:text-sm"
          placeholder="10-15 minutes"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-menu-gray-300 rounded-md text-menu-gray-700 hover:bg-menu-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-menu-accent-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-menu-accent-500 text-white rounded-md hover:bg-menu-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-menu-accent-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}