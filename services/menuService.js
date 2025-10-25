import categoriesService from './categoriesService';

// Transform API menu items and merge with Firestore categories
const transformMenuData = async (apiItems) => {
  try {
    // Fetch dynamic categories from Firestore
    const categories = await categoriesService.getAllCategories();
    
    // If no categories exist, return empty structure
    if (categories.length === 0) {
      return {
        restaurant: {
          name: "",
          description: "",
          location: "Downtown District"
        },
        mainCategories: []
      };
    }
    
    // Group menu items by category
    const categorizedItems = apiItems.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      
      // Transform item to match expected structure
      acc[category].push({
        id: item.id,
        name: item.name || 'Unknown Item',
        description: item.description || '',
        description2: item.description2 || '',
        price: item.price ? parseFloat(item.price).toFixed(2) : '0.00',
        image: item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
        allergens: Array.isArray(item.allergens) ? item.allergens : [],
        dietary: [],
        isVegetarian: Boolean(item.isVegetarian),
        prepTime: item.prepTime || '',
        popular: Boolean(item.popular),
        ageRestricted: Boolean(item.ageRestricted)
      });
      
      return acc;
    }, {});

    // Map Firestore categories to menu structure with items
    const mainCategories = categories.map(category => {
      const subcategoriesWithItems = (category.subcategories || []).map(subcategory => {
        // Find items that belong to this subcategory
        const subcategoryKey = `${category.id}-${subcategory.id}`;
        const items = categorizedItems[subcategoryKey] || [];
        
        return {
          id: subcategory.id,
          name: subcategory.name,
          description: subcategory.description || `Delicious ${subcategory.name.toLowerCase()} prepared with care`,
          items: items
        };
      });

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        color: category.color, // Include color for dynamic theming
        order: category.order,
        subcategories: subcategoriesWithItems
      };
    });

    // Sort categories by order
    mainCategories.sort((a, b) => (a.order || 0) - (b.order || 0));

    return {
      restaurant: {
        name: "",
        description: "",
        location: "Downtown District"
      },
      mainCategories: mainCategories
    };
  } catch (error) {
    console.error('Error transforming menu data:', error);
    // Return empty structure on error
    return {
      restaurant: {
        name: "",
        description: "",
        location: "Downtown District"
      },
      mainCategories: []
    };
  }
};

// Legacy function - get categories for forms/dropdowns
export const getCategoryOptions = async () => {
  try {
    const categories = await categoriesService.getAllCategories();
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
    
    return options;
  } catch (error) {
    console.error('Error fetching category options:', error);
    return [];
  }
};

// Fetch complete menu data (categories + items)
export const fetchMenuData = async (useStaticData = false) => {
  // Static data option for backward compatibility
  if (useStaticData) {
    const { menuData } = require('../data/menuData');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(menuData);
      }, 100);
    });
  }

  // Fetch from API (menu items) and Firestore (categories)
  try {
    const response = await fetch('/api/menu-items');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const apiItems = await response.json();
    const transformedData = await transformMenuData(apiItems);
    return transformedData;
  } catch (error) {
    // Fallback to static data if API fails
    console.warn('API failed, using static data:', error.message);
    const { menuData } = require('../data/menuData');
    return menuData;
  }
};

// Get categories only (for admin forms)
export const fetchCategories = async () => {
  try {
    return await categoriesService.getAllCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export default {
  fetchMenuData,
  fetchCategories,
  getCategoryOptions
};
