// Script to test the menu API
const http = require('http');

async function testMenuAPI() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/menu',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ status: res.statusCode, data: result });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function main() {
  try {
    console.log('🧪 Testing menu API...');
    
    const result = await testMenuAPI();
    
    if (result.status === 200) {
      console.log('✅ Menu API working!');
      console.log(`📊 Categories found: ${result.data.mainCategories.length}`);
      
      result.data.mainCategories.forEach(category => {
        console.log(`\n📂 ${category.name}:`);
        category.subcategories.forEach(sub => {
          console.log(`   - ${sub.name}: ${sub.items.length} items`);
          if (sub.items.length > 0) {
            console.log(`     Sample: ${sub.items[0].name} - $${sub.items[0].price}`);
          }
        });
      });
      
    } else {
      console.error('❌ Menu API failed:');
      console.error(`Status: ${result.status}`);
      console.error('Response:', result.data);
    }
    
  } catch (error) {
    console.error('❌ Error testing menu API:');
    console.error(error.message);
  }
}

main();
