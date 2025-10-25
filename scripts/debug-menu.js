// Script to debug menu structure
const http = require('http');

async function debugMenu() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/debug-menu',
    method: 'GET',
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
    console.log('🔍 Debugging menu structure...');
    
    const result = await debugMenu();
    
    if (result.status === 200) {
      const data = result.data;
      
      console.log(`📊 Total items: ${data.totalItems}`);
      console.log(`📂 Total categories: ${data.totalCategories}`);
      
      console.log('\n🏷️  Available categories:');
      data.categories.forEach(cat => {
        console.log(`   - ${cat.id} (${cat.name})`);
        cat.subcategories.forEach(sub => {
          console.log(`     └─ ${sub}`);
        });
      });
      
      console.log('\n📦 Items by category:');
      data.itemsByCategory.forEach(cat => {
        console.log(`   - ${cat.category}: ${cat.count} items`);
        cat.sampleItems.forEach(item => {
          console.log(`     └─ ${item.name} - $${item.price}`);
        });
      });
      
    } else {
      console.error('❌ Debug failed:', result.data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
