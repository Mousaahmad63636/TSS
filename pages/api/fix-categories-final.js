import { getFirestoreDb } from '../../lib/firebase';
import categoriesService from '../../services/categoriesService';

const MENU_ITEMS_COLLECTION = 'menuItems';

// Map our item categories to the actual Firestore category structure
function mapToFirestoreCategory(itemCategory, categories) {
  // Create a mapping based on the actual categories in Firestore
  const categoryMap = {
    'food-pizza': 'food-pizza',
    'food-appetizers': 'food-appetizers', 
    'desserts-cakes': 'desserts-cakes',
    'beverages-cold-drinks': 'beverages-cold-drinks',
    'beverages-specialty-drinks': 'beverages-specialty-drinks'
  };
  
  // Find the actual category IDs from Firestore
  const actualCategories = {};
  categories.forEach(cat => {
    if (cat.subcategories) {
      cat.subcategories.forEach(sub => {
        const key = `${cat.id}-${sub.id}`;
        
        // Map based on subcategory names
        if (sub.name.toLowerCase().includes('pizza')) {
          actualCategories['food-pizza'] = key;
        } else if (sub.name.toLowerCase().includes('appetizer')) {
          actualCategories['food-appetizers'] = key;
        } else if (sub.name.toLowerCase().includes('cake')) {
          actualCategories['desserts-cakes'] = key;
        } else if (sub.name.toLowerCase().includes('cold')) {
          actualCategories['beverages-cold-drinks'] = key;
        } else if (sub.name.toLowerCase().includes('specialty')) {
          actualCategories['beverages-specialty-drinks'] = key;
        }
      });
    }
  });
  
  return actualCategories[itemCategory] || actualCategories['food-appetizers'] || `${categories[0]?.id}-${categories[0]?.subcategories?.[0]?.id}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting final category fix...');
    
    const db = getFirestoreDb();
    
    // Get all categories first
    const categories = await categoriesService.getAllCategories();
    console.log(`Found ${categories.length} categories`);
    
    if (categories.length === 0) {
      return res.status(400).json({ 
        error: 'No categories found. Please create default categories first.' 
      });
    }
    
    // Get all CSV imported items
    const snapshot = await db.collection(MENU_ITEMS_COLLECTION)
      .where('source', '==', 'csv-import')
      .get();
    
    if (snapshot.empty) {
      return res.status(404).json({ 
        error: 'No CSV imported items found to fix' 
      });
    }
    
    console.log(`Found ${snapshot.size} items to fix`);
    
    // Process items in batches
    const batchSize = 500;
    const batches = [];
    let currentBatch = db.batch();
    let batchCount = 0;
    
    const updates = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const currentCategory = data.category || 'food-appetizers';
      
      // Map to correct Firestore category
      const newCategory = mapToFirestoreCategory(currentCategory, categories);
      
      const updatedData = {
        ...data,
        category: newCategory,
        originalCategory: currentCategory,
        updatedAt: new Date()
      };
      
      currentBatch.update(doc.ref, updatedData);
      batchCount++;
      
      updates.push({
        id: doc.id,
        name: data.name,
        oldCategory: currentCategory,
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
    
    console.log('Final category fix completed successfully!');
    
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
      message: 'Categories fixed successfully',
      totalUpdated: updates.length,
      availableCategories: categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        subcategories: cat.subcategories?.map(sub => ({
          id: sub.id,
          name: sub.name,
          fullId: `${cat.id}-${sub.id}`
        })) || []
      })),
      categoryStats: categoryStats,
      sampleUpdates: updates.slice(0, 10)
    });
    
  } catch (error) {
    console.error('Error fixing categories:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
