// Script to create default categories
const http = require('http');

async function createCategories() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/create-default-categories',
    method: 'POST',
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
    console.log('📂 Creating default categories...');
    
    const result = await createCategories();
    
    if (result.status === 200) {
      console.log('✅ Categories created successfully!');
      console.log('📊 Categories:');
      
      result.data.categories.forEach(cat => {
        console.log(`   - ${cat.name}: ${cat.subcategories} subcategories`);
      });
      
    } else {
      console.log('ℹ️  Categories response:');
      console.log(`Status: ${result.status}`);
      console.log('Response:', result.data);
    }
    
  } catch (error) {
    console.error('❌ Error creating categories:');
    console.error(error.message);
  }
}

main();
