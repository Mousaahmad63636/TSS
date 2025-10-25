import { getFirestoreDb } from '../../lib/firebase';
import categoriesService from '../../services/categoriesService';

const MENU_ITEMS_COLLECTION = 'menuItems';

// Map original categories to new Arabic category structure
function mapToArabicCategory(originalCategory, categories) {
  const mapping = {
    // Pizza items
    'pizza': 'food-pizza',
    'food-pizza': 'food-pizza',
    
    // Manakish and pastries
    'manakish': 'food-manakish',
    'pastries': 'food-pastries',
    'fried-pastries': 'food-pastries',
    'open-pastries': 'food-manakish',
    'special-manakish': 'food-manakish',
    'dozens': 'food-pastries',
    'extras': 'food-pastries',
    'food-appetizers': 'food-manakish',
    'large-spinach-pie': 'food-pastries',
    'purslane-pie': 'food-pastries',
    'wild-thyme-pie': 'food-pastries',
    
    // Beverages
    'beverages': 'beverages-cold-drinks',
    'beverages-cold-drinks': 'beverages-cold-drinks',
    'beverages-specialty-drinks': 'beverages-specialty-drinks',
    'pomegranate-molasses': 'beverages-specialty-drinks',
    
    // Desserts
    'desserts': 'desserts-traditional',
    'desserts-cakes': 'desserts-traditional',
    
    // Orders
    'home-orders': 'food-pastries',
    'orders': 'food-pastries'
  };
  
  const targetCategory = mapping[originalCategory] || 'food-manakish';
  
  // Find the actual category ID in Firestore
  for (const cat of categories) {
    if (cat.subcategories) {
      for (const sub of cat.subcategories) {
        const fullId = `${cat.id}-${sub.id}`;
        if (fullId === targetCategory) {
          return fullId;
        }
      }
    }
  }
  
  // Fallback to first available category
  return categories[0] ? `${categories[0].id}-${categories[0].subcategories?.[0]?.id}` : 'food-manakish';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting menu items categorization...');
    
    const db = getFirestoreDb();
    
    // Get all categories
    const categories = await categoriesService.getAllCategories();
    console.log(`Found ${categories.length} categories`);
    
    if (categories.length === 0) {
      return res.status(400).json({ 
        error: 'No categories found. Please create Arabic categories first.' 
      });
    }
    
    // Get all CSV imported items
    const snapshot = await db.collection(MENU_ITEMS_COLLECTION)
      .where('source', '==', 'csv-import')
      .get();
    
    if (snapshot.empty) {
      return res.status(404).json({ 
        error: 'No CSV imported items found to categorize' 
      });
    }
    
    console.log(`Found ${snapshot.size} items to categorize`);
    
    // Process items in batches
    const batchSize = 500;
    const batches = [];
    let currentBatch = db.batch();
    let batchCount = 0;
    
    const updates = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const originalCategory = data.originalCategory || data.category || 'food-manakish';
      
      // Map to correct Arabic category
      const newCategory = mapToArabicCategory(originalCategory, categories);
      
      const updatedData = {
        ...data,
        category: newCategory,
        updatedAt: new Date()
      };
      
      currentBatch.update(doc.ref, updatedData);
      batchCount++;
      
      updates.push({
        id: doc.id,
        name: data.name,
        originalCategory: originalCategory,
        newCategory: newCategory
      });
      
      // Create new batch if current one is full
      if (batchCount >= batchSize) {
        batches.push(currentBatch);
        currentBatch = db.batch();
        batchCount = 0;
      }
    });
    
    // Add the last batch if it has items
    if (batchCount > 0) {
      batches.push(currentBatch);
    }
    
    // Execute all batches
    console.log(`Executing ${batches.length} batches...`);
    await Promise.all(batches.map(batch => batch.commit()));
    
    console.log('Menu items categorization completed successfully!');
    
    // Group updates by category for response
    const categoryStats = {};
    updates.forEach(update => {
      if (!categoryStats[update.newCategory]) {
        categoryStats[update.newCategory] = { count: 0, items: [] };
      }
      categoryStats[update.newCategory].count++;
      categoryStats[update.newCategory].items.push(update.name);
    });
    
    res.status(200).json({
      success: true,
      message: 'Menu items categorized successfully',
      totalUpdated: updates.length,
      availableCategories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        nameEnglish: cat.nameEnglish,
        subcategories: cat.subcategories?.map(sub => ({
          id: sub.id,
          name: sub.name,
          nameEnglish: sub.nameEnglish,
          fullId: `${cat.id}-${sub.id}`
        })) || []
      })),
      categoryStats: categoryStats,
      sampleUpdates: updates.slice(0, 15)
    });
    
  } catch (error) {
    console.error('Error categorizing menu items:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
