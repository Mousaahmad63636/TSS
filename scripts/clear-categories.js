// Clear all categories and start fresh
const { getFirestoreDb } = require('../lib/firebase');

async function clearAllCategories() {
  try {
    console.log('🧹 Clearing all categories from Firestore...');
    
    const db = getFirestoreDb();
    const snapshot = await db.collection('categories').get();
    
    const deletePromises = [];
    snapshot.forEach(doc => {
      deletePromises.push(doc.ref.delete());
    });
    
    await Promise.all(deletePromises);
    
    console.log(`✅ Deleted ${deletePromises.length} categories`);
    console.log('');
    console.log('🎯 Fresh Start Ready!');
    console.log('Your system now has 0 categories.');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('1. Go to: http://localhost:3000/admin/categories');
    console.log('2. Click "Add Category" to create your first category');
    console.log('3. Add subcategories to organize your menu items');
    console.log('4. Start adding menu items to your custom categories');
    console.log('');
    console.log('✨ This gives you complete control over your menu structure!');
    
  } catch (error) {
    console.error('❌ Error clearing categories:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  clearAllCategories();
}

module.exports = { clearAllCategories };
