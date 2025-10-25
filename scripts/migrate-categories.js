// Migration script to move categories from menuData.js to Firestore
const { categoriesService } = require('../services/categoriesService');
const { menuData } = require('../data/menuData');

async function migrateCategoriestoFirestore() {
  try {
    console.log('🔄 Starting category migration to Firestore...');
    
    const categories = menuData.mainCategories;
    const colorMap = {
      'pizza': 'orange',
      'beverages': 'blue', 
      'pasta': 'pink',
      'burgers': 'red',
      'salad': 'green'
    };
    
    let migrated = 0;
    
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      
      console.log(`📋 Migrating category: ${category.name}`);
      
      const categoryData = {
        name: category.name,
        description: category.description,
        color: colorMap[category.id] || 'gray',
        order: i + 1,
        subcategories: category.subcategories.map((sub, index) => ({
          id: sub.id,
          name: sub.name,
          description: sub.description,
          order: index + 1,
          active: true
        }))
      };
      
      try {
        // Create category with specific ID
        const { getFirestoreDb } = require('../lib/firebase');
        const db = getFirestoreDb();
        await db.collection('categories').doc(category.id).set({
          ...categoryData,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        console.log(`✅ Migrated: ${category.name} with ${category.subcategories.length} subcategories`);
        migrated++;
      } catch (error) {
        console.error(`❌ Failed to migrate ${category.name}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Migration complete! ${migrated}/${categories.length} categories migrated`);
    console.log('\n📊 Migration Summary:');
    categories.forEach(cat => {
      console.log(`- ${cat.name}: ${cat.subcategories.length} subcategories`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateCategoriestoFirestore();
}

module.exports = { migrateCategoriestoFirestore };
