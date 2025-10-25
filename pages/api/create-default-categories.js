import { getFirestoreDb } from '../../lib/firebase';

const CATEGORIES_COLLECTION = 'categories';

// Default restaurant menu structure
const defaultCategories = [
  {
    id: 'food',
    name: 'Food',
    description: 'Delicious main courses and appetizers',
    color: '#EF4444',
    order: 1,
    isActive: true,
    subcategories: [
      {
        id: 'pizza',
        name: 'Pizza',
        description: 'Wood-fired pizzas with fresh ingredients',
        order: 1,
        isActive: true
      },
      {
        id: 'pasta',
        name: 'Pasta',
        description: 'Homemade pasta with authentic sauces',
        order: 2,
        isActive: true
      },
      {
        id: 'appetizers',
        name: 'Appetizers',
        description: 'Perfect starters to begin your meal',
        order: 3,
        isActive: true
      }
    ]
  },
  {
    id: 'beverages',
    name: 'Beverages',
    description: 'Refreshing drinks and specialty beverages',
    color: '#3B82F6',
    order: 2,
    isActive: true,
    subcategories: [
      {
        id: 'hot-drinks',
        name: 'Hot Drinks',
        description: 'Coffee, tea, and warm beverages',
        order: 1,
        isActive: true
      },
      {
        id: 'cold-drinks',
        name: 'Cold Drinks',
        description: 'Sodas, juices, and iced beverages',
        order: 2,
        isActive: true
      },
      {
        id: 'specialty-drinks',
        name: 'Specialty Drinks',
        description: 'Signature cocktails and unique beverages',
        order: 3,
        isActive: true
      }
    ]
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet treats and decadent desserts',
    color: '#F59E0B',
    order: 3,
    isActive: true,
    subcategories: [
      {
        id: 'cakes',
        name: 'Cakes',
        description: 'Fresh baked cakes and pastries',
        order: 1,
        isActive: true
      },
      {
        id: 'ice-cream',
        name: 'Ice Cream',
        description: 'Creamy ice cream and frozen treats',
        order: 2,
        isActive: true
      }
    ]
  },
  {
    id: 'tobacco',
    name: 'Tobacco',
    description: 'Premium tobacco products and accessories',
    color: '#8B5CF6',
    order: 4,
    isActive: true,
    subcategories: [
      {
        id: 'shisha',
        name: 'Shisha',
        description: 'Traditional hookah and flavored tobacco',
        order: 1,
        isActive: true
      },
      {
        id: 'cigarettes',
        name: 'Cigarettes',
        description: 'Premium cigarette brands',
        order: 2,
        isActive: true
      }
    ]
  }
];

async function createDefaultCategories() {
  try {
    console.log('Creating default categories...');
    const db = getFirestoreDb();
    
    // Check if categories already exist
    const snapshot = await db.collection(CATEGORIES_COLLECTION).get();
    if (!snapshot.empty) {
      console.log('Categories already exist, skipping default creation');
      return;
    }
    
    // Create default categories
    const batch = db.batch();
    
    defaultCategories.forEach(category => {
      const docRef = db.collection(CATEGORIES_COLLECTION).doc(category.id);
      batch.set(docRef, {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    await batch.commit();
    console.log('Default categories created successfully!');
    
    // Log created categories
    defaultCategories.forEach(cat => {
      console.log(`✅ ${cat.name} (${cat.subcategories.length} subcategories)`);
      cat.subcategories.forEach(sub => {
        console.log(`   - ${sub.name}`);
      });
    });
    
  } catch (error) {
    console.error('Error creating default categories:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await createDefaultCategories();
    
    res.status(200).json({ 
      success: true,
      message: 'Default categories created successfully',
      categories: defaultCategories.map(cat => ({
        name: cat.name,
        subcategories: cat.subcategories.length
      }))
    });
    
  } catch (error) {
    console.error('API error creating default categories:', error);
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
}
