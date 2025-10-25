import { getFirestoreDb } from '../../lib/firebase';

const CATEGORIES_COLLECTION = 'categories';

// Arabic restaurant menu structure
const arabicCategories = [
  {
    id: 'food',
    name: 'الطعام',
    nameEnglish: 'Food',
    description: 'أطباق رئيسية ومقبلات لذيذة',
    color: '#EF4444',
    order: 1,
    isActive: true,
    subcategories: [
      {
        id: 'pizza',
        name: 'بيتزا',
        nameEnglish: 'Pizza',
        description: 'بيتزا طازجة مخبوزة في الفرن',
        order: 1,
        isActive: true
      },
      {
        id: 'manakish',
        name: 'مناقيش',
        nameEnglish: 'Manakish',
        description: 'مناقيش طازجة على الطريقة التقليدية',
        order: 2,
        isActive: true
      },
      {
        id: 'pastries',
        name: 'معجنات',
        nameEnglish: 'Pastries',
        description: 'معجنات طازجة ومتنوعة',
        order: 3,
        isActive: true
      }
    ]
  },
  {
    id: 'beverages',
    name: 'المشروبات',
    nameEnglish: 'Beverages',
    description: 'مشروبات منعشة ومتنوعة',
    color: '#3B82F6',
    order: 2,
    isActive: true,
    subcategories: [
      {
        id: 'cold-drinks',
        name: 'مشروبات باردة',
        nameEnglish: 'Cold Drinks',
        description: 'مشروبات باردة ومنعشة',
        order: 1,
        isActive: true
      },
      {
        id: 'specialty-drinks',
        name: 'مشروبات خاصة',
        nameEnglish: 'Specialty Drinks',
        description: 'مشروبات مميزة وخاصة',
        order: 2,
        isActive: true
      }
    ]
  },
  {
    id: 'desserts',
    name: 'الحلويات',
    nameEnglish: 'Desserts',
    description: 'حلويات شرقية وغربية لذيذة',
    color: '#F59E0B',
    order: 3,
    isActive: true,
    subcategories: [
      {
        id: 'traditional',
        name: 'حلويات تقليدية',
        nameEnglish: 'Traditional Desserts',
        description: 'حلويات شرقية تقليدية',
        order: 1,
        isActive: true
      }
    ]
  }
];

async function createArabicCategories() {
  try {
    console.log('Creating Arabic categories...');
    const db = getFirestoreDb();
    
    // Delete existing categories first
    const existingSnapshot = await db.collection(CATEGORIES_COLLECTION).get();
    if (!existingSnapshot.empty) {
      console.log('Deleting existing categories...');
      const batch = db.batch();
      existingSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
    }
    
    // Create new Arabic categories
    const batch = db.batch();
    
    arabicCategories.forEach(category => {
      const docRef = db.collection(CATEGORIES_COLLECTION).doc(category.id);
      batch.set(docRef, {
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
    
    await batch.commit();
    console.log('Arabic categories created successfully!');
    
    return arabicCategories;
    
  } catch (error) {
    console.error('Error creating Arabic categories:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const categories = await createArabicCategories();
    
    res.status(200).json({ 
      success: true,
      message: 'Arabic categories created successfully',
      categories: categories.map(cat => ({
        name: cat.name,
        nameEnglish: cat.nameEnglish,
        subcategories: cat.subcategories.length
      }))
    });
    
  } catch (error) {
    console.error('API error creating Arabic categories:', error);
    res.status(500).json({ 
      success: false,
      error: error.message
    });
  }
}
