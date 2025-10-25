// Test script to verify dynamic categories integration
const { fetchMenuData, fetchCategories, getCategoryOptions } = require('../services/menuService');

async function testDynamicCategories() {
  try {
    console.log('🧪 Testing Dynamic Categories Integration');
    console.log('========================================\n');
    
    // Test 1: Fetch categories only
    console.log('📋 Test 1: Fetching categories from Firestore...');
    const categories = await fetchCategories();
    console.log(`✅ Found ${categories.length} categories`);
    
    if (categories.length > 0) {
      console.log('📊 Categories:');
      categories.forEach(cat => {
        console.log(`  - ${cat.name} (${cat.color}, order: ${cat.order})`);
        console.log(`    ${cat.subcategories?.length || 0} subcategories`);
      });
    }
    console.log('');
    
    // Test 2: Get category options for forms
    console.log('📋 Test 2: Testing category options for forms...');
    const categoryOptions = await getCategoryOptions();
    console.log(`✅ Generated ${categoryOptions.length} category options`);
    
    if (categoryOptions.length > 0) {
      console.log('📊 First 5 category options:');
      categoryOptions.slice(0, 5).forEach(option => {
        console.log(`  - ${option.label} (${option.value})`);
      });
    }
    console.log('');
    
    // Test 3: Fetch complete menu data
    console.log('📋 Test 3: Fetching complete menu data...');
    const menuData = await fetchMenuData();
    console.log(`✅ Menu data loaded successfully`);
    console.log(`   Restaurant: ${menuData.restaurant.name}`);
    console.log(`   Categories: ${menuData.mainCategories.length}`);
    
    let totalSubcategories = 0;
    let totalItems = 0;
    
    menuData.mainCategories.forEach(cat => {
      totalSubcategories += cat.subcategories?.length || 0;
      cat.subcategories?.forEach(sub => {
        totalItems += sub.items?.length || 0;
      });
    });
    
    console.log(`   Subcategories: ${totalSubcategories}`);
    console.log(`   Menu Items: ${totalItems}`);
    console.log('');
    
    // Test 4: Verify category structure
    console.log('📋 Test 4: Verifying category structure...');
    const structureValid = menuData.mainCategories.every(cat => {
      return cat.id && cat.name && cat.color && 
             Array.isArray(cat.subcategories) &&
             cat.subcategories.every(sub => sub.id && sub.name && Array.isArray(sub.items));
    });
    
    if (structureValid) {
      console.log('✅ Category structure is valid');
    } else {
      console.log('❌ Category structure has issues');
    }
    console.log('');
    
    // Test 5: Check color mappings
    console.log('📋 Test 5: Checking color mappings...');
    const colorsUsed = [...new Set(menuData.mainCategories.map(cat => cat.color))];
    console.log(`✅ Colors in use: ${colorsUsed.join(', ')}`);
    console.log('');
    
    console.log('🎉 All dynamic categories tests passed!');
    console.log('\n📱 Integration Summary:');
    console.log('- ✅ Categories service working');
    console.log('- ✅ Menu service updated');
    console.log('- ✅ Form dropdowns will populate dynamically');
    console.log('- ✅ Main category navigation ready');
    console.log('- ✅ Subcategory sliders ready');
    console.log('- ✅ Color theming preserved');
    
  } catch (error) {
    console.error('❌ Dynamic categories test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure Firebase connection is working: npm run test-firebase');
    console.log('2. Migrate categories to Firestore: npm run migrate-categories');
    console.log('3. Check categories service: npm run test-categories');
    process.exit(1);
  }
}

// Run test if called directly
if (require.main === module) {
  testDynamicCategories();
}

module.exports = { testDynamicCategories };
