import { getFirestoreDb } from '../../lib/firebase';

const MENU_ITEMS_COLLECTION = 'menuItems';

// Generate descriptions based on item names and categories
function generateDescription(name, category) {
  const descriptions = {
    // Desserts
    'كستر': 'حلوى كريمية لذيذة مع طعم الفانيليا الرائع',
    'مهلبية': 'حلوى تقليدية بالحليب والسكر مع رشة من القرفة',
    'مغلي': 'حلوى شعبية محضرة بعناية مع المكونات الطازجة',
    'جلو': 'حلوى منعشة وخفيفة مثالية لجميع الأوقات',
    
    // Default descriptions by category
    desserts: 'حلوى لذيذة محضرة بأجود المكونات',
    beverages: 'مشروب منعش ولذيذ',
    pizza: 'بيتزا طازجة مخبوزة في الفرن مع أجود المكونات',
    manakish: 'مناقيش طازجة محضرة على الطريقة التقليدية',
    pastries: 'معجنات طازجة ولذيذة',
    'fried-pastries': 'كعك مقلي طازج ومقرمش',
    extras: 'إضافات لذيذة لتكملة وجبتك',
    dozens: 'دزينة من المعجنات الطازجة',
    'open-pastries': 'معجنات مشروحة طازجة ولذيذة',
    'home-orders': 'طلبات منزلية خاصة',
    orders: 'طلبات خاصة',
    'special-manakish': 'مناقيش سبيشال بمكونات مميزة',
    'large-spinach-pie': 'فطيرة سبانخ كبيرة طازجة',
    'purslane-pie': 'فطيرة بقلة طازجة ولذيذة',
    'wild-thyme-pie': 'فطيرة زعتر بري عطرة',
    'pomegranate-molasses': 'دبس رمان طبيعي عالي الجودة'
  };
  
  // Try specific item description first
  if (descriptions[name]) {
    return descriptions[name];
  }
  
  // Fall back to category description
  if (descriptions[category]) {
    return descriptions[category];
  }
  
  // Default description
  return 'طبق لذيذ محضر بعناية من أجود المكونات';
}

// Map categories to match the expected structure
function mapCategoryToSubcategory(category) {
  const categoryMapping = {
    'desserts': 'desserts-cakes',
    'beverages': 'beverages-cold-drinks',
    'pizza': 'food-pizza',
    'manakish': 'food-appetizers',
    'pastries': 'food-appetizers',
    'fried-pastries': 'food-appetizers',
    'extras': 'food-appetizers',
    'dozens': 'food-appetizers',
    'open-pastries': 'food-appetizers',
    'home-orders': 'food-appetizers',
    'orders': 'food-appetizers',
    'special-manakish': 'food-appetizers',
    'large-spinach-pie': 'food-appetizers',
    'purslane-pie': 'food-appetizers',
    'wild-thyme-pie': 'food-appetizers',
    'pomegranate-molasses': 'beverages-specialty-drinks'
  };
  
  return categoryMapping[category] || 'food-appetizers';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting menu items fix...');
    
    const db = getFirestoreDb();
    
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
      const itemName = data.name || data.nameArabic || '';
      const currentCategory = data.category || '';
      
      // Generate description if missing
      const description = data.description || generateDescription(itemName, currentCategory);
      
      // Map to proper subcategory
      const newCategory = mapCategoryToSubcategory(currentCategory);
      
      const updatedData = {
        ...data,
        description: description,
        descriptionArabic: description,
        descriptionEnglish: '', // Can be filled later
        category: newCategory,
        originalCategory: currentCategory, // Keep track of original
        updatedAt: new Date(),
        available: true // Ensure items are available
      };
      
      currentBatch.update(doc.ref, updatedData);
      batchCount++;
      
      updates.push({
        id: doc.id,
        name: itemName,
        oldCategory: currentCategory,
        newCategory: newCategory,
        description: description
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
    
    console.log('Menu items fix completed successfully!');
    
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
      message: 'Menu items fixed successfully',
      totalUpdated: updates.length,
      categories: categoryStats,
      sampleUpdates: updates.slice(0, 10)
    });
    
  } catch (error) {
    console.error('Error fixing menu items:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
