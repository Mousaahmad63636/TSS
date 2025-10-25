// Script to categorize menu items properly
const http = require('http');

async function categorizeMenuItems() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/categorize-menu-items',
    method: 'POST',
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    console.log('🏷️  Categorizing menu items...');
    
    const result = await categorizeMenuItems();
    
    if (result.status === 200) {
      console.log('✅ Menu items categorized successfully!');
      console.log(`📊 Total items updated: ${result.data.totalUpdated}`);
      
      console.log('\n📂 Available categories:');
      result.data.availableCategories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.nameEnglish})`);
        cat.subcategories.forEach(sub => {
          console.log(`     └─ ${sub.name} (${sub.nameEnglish}) - ${sub.fullId}`);
        });
      });
      
      console.log('\n📊 Items per category:');
      Object.entries(result.data.categoryStats).forEach(([category, info]) => {
        console.log(`   - ${category}: ${info.count} items`);
      });
      
      console.log('\n🔍 Sample updates:');
      result.data.sampleUpdates.forEach(update => {
        console.log(`   - ${update.name}: ${update.originalCategory} → ${update.newCategory}`);
      });
      
      console.log('\n🎉 Menu should now display properly organized in customer view!');
      
    } else {
      console.error('❌ Categorization failed:', result.data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
