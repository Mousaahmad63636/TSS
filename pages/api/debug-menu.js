import { fetchMenuItems } from '../../services/firestoreService';
import categoriesService from '../../services/categoriesService';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all menu items
    const menuItems = await fetchMenuItems();
    
    // Get all categories
    const categories = await categoriesService.getAllCategories();
    
    // Group items by category
    const itemsByCategory = {};
    menuItems.forEach(item => {
      const cat = item.category || 'unknown';
      if (!itemsByCategory[cat]) {
        itemsByCategory[cat] = [];
      }
      itemsByCategory[cat].push({
        name: item.name,
        price: item.price,
        description: item.description
      });
    });
    
    res.status(200).json({
      totalItems: menuItems.length,
      totalCategories: categories.length,
      categories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        subcategories: cat.subcategories?.map(sub => sub.id) || []
      })),
      itemsByCategory: Object.keys(itemsByCategory).map(cat => ({
        category: cat,
        count: itemsByCategory[cat].length,
        sampleItems: itemsByCategory[cat].slice(0, 3)
      }))
    });
    
  } catch (error) {
    console.error('Debug API error:', error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
