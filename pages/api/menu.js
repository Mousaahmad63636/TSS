import categoriesService from '../../services/categoriesService';
import { fetchMenuItems } from '../../services/firestoreService';

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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Set cache headers for better performance
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    // Fetch raw menu items
    const menuItems = await fetchMenuItems();
    
    // Transform with categories
    const transformedData = await transformMenuData(menuItems);
    
    res.status(200).json(transformedData);
    
  } catch (error) {
    console.error('Menu API error:', error);
    
    // Return fallback data on error
    res.status(200).json({
      restaurant: {
        name: "",
        description: "",
        location: "Downtown District"
      },
      mainCategories: []
    });
  }
}
