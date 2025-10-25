// Script to create Arabic categories
const http = require('http');

async function createArabicCategories() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/create-arabic-categories',
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
    console.log('🏗️  Creating Arabic categories...');
    
    const result = await createArabicCategories();
    
    if (result.status === 200) {
      console.log('✅ Arabic categories created successfully!');
      console.log('📂 Categories:');
      
      result.data.categories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.nameEnglish}): ${cat.subcategories} subcategories`);
      });
      
    } else {
      console.error('❌ Failed to create categories:', result.data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
