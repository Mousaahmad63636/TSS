// Script to fix categories final
const http = require('http');

async function fixCategoriesFinal() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/fix-categories-final',
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
    console.log('🔧 Final category fix...');
    
    const result = await fixCategoriesFinal();
    
    if (result.status === 200) {
      console.log('✅ Categories fixed successfully!');
      console.log(`📊 Total items updated: ${result.data.totalUpdated}`);
      
      console.log('\n📂 Available categories:');
      result.data.availableCategories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.id})`);
        cat.subcategories.forEach(sub => {
          console.log(`     └─ ${sub.name} (${sub.fullId})`);
        });
      });
      
      console.log('\n📊 Items per category:');
      Object.entries(result.data.categoryStats).forEach(([category, info]) => {
        console.log(`   - ${category}: ${info.count} items`);
      });
      
      console.log('\n🎉 Menu should now display properly in customer view!');
      
    } else {
      console.error('❌ Fix failed:', result.data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
