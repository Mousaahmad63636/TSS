// Script to import menu items from CSV
const https = require('https');
const http = require('http');

async function importMenu() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/import-csv-menu',
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
    console.log('🚀 Starting menu import from CSV...');
    console.log('📍 Make sure your Next.js development server is running on localhost:3000');
    console.log('');
    
    const result = await importMenu();
    
    if (result.status === 200) {
      console.log('✅ Import successful!');
      console.log(`📊 Total items imported: ${result.data.totalItems}`);
      console.log('📂 Categories:');
      
      Object.entries(result.data.categories).forEach(([category, info]) => {
        console.log(`   - ${category} (${info.arabicName}): ${info.count} items`);
      });
      
      console.log('\n🔍 Sample items:');
      result.data.sampleItems.forEach(item => {
        console.log(`   - ${item.name} (${item.category}) - $${item.price}`);
      });
      
    } else {
      console.error('❌ Import failed:');
      console.error(`Status: ${result.status}`);
      console.error('Response:', result.data);
    }
    
  } catch (error) {
    console.error('❌ Error during import:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure to start your Next.js development server first:');
      console.log('   npm run dev');
      console.log('   # or');
      console.log('   yarn dev');
    }
  }
}

main();
