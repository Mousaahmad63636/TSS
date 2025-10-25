// Test script for categories service
const { categoriesService } = require('../services/categoriesService');

async function testCategoriesService() {
  try {
    console.log('🧪 Testing Categories Service...');
    console.log('=================================\n');
    
    // Test 1: Fetch all categories
    console.log('📋 Test 1: Fetching all categories...');
    const categories = await categoriesService.getAllCategories();
    console.log(`✅ Found ${categories.length} categories`);
    
    if (categories.length > 0) {
      console.log('📊 Categories found:');
      categories.forEach(cat => {
        console.log(`  - ${cat.name} (${cat.subcategories?.length || 0} subcategories)`);
      });
    }
    console.log('');
    
    // Test 2: Get specific category
    if (categories.length > 0) {
      const firstCategory = categories[0];
      console.log(`📋 Test 2: Fetching category "${firstCategory.name}" by ID...`);
      const category = await categoriesService.getCategoryById(firstCategory.id);
      console.log(`✅ Retrieved: ${category.name}`);
      console.log(`   Description: ${category.description}`);
      console.log(`   Color: ${category.color}`);
      console.log(`   Subcategories: ${category.subcategories?.length || 0}`);
      console.log('');
    }
    
    // Test 3: Create test category
    console.log('📋 Test 3: Creating test category...');
    const testCategory = {
      name: 'Test Category',
      description: 'A test category for validation',
      color: 'purple',
      order: 999,
      subcategories: [
        {
          id: 'test-sub',
          name: 'Test Subcategory',
          description: 'A test subcategory',
          order: 1,
          active: true
        }
      ]
    };
    
    const createdCategory = await categoriesService.createCategory(testCategory);
    console.log(`✅ Created test category: ${createdCategory.name} (ID: ${createdCategory.id})`);
    console.log('');
    
    // Test 4: Update test category
    console.log('📋 Test 4: Updating test category...');
    await categoriesService.updateCategory(createdCategory.id, {
      description: 'Updated test category description'
    });
    console.log('✅ Test category updated successfully');
    console.log('');
    
    // Test 5: Add subcategory
    console.log('📋 Test 5: Adding subcategory...');
    await categoriesService.addSubcategory(createdCategory.id, {
      id: 'test-sub-2',
      name: 'Second Test Subcategory',
      description: 'Another test subcategory',
      order: 2
    });
    console.log('✅ Subcategory added successfully');
    console.log('');
    
    // Test 6: Clean up - delete test category
    console.log('📋 Test 6: Cleaning up test category...');
    await categoriesService.deleteCategory(createdCategory.id);
    console.log('✅ Test category deleted successfully');
    console.log('');
    
    console.log('🎉 All tests passed! Categories service is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  testCategoriesService();
}

module.exports = { testCategoriesService };
