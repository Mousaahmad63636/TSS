// Script to fix menu items with descriptions and proper categories
const http = require('http');

async function fixMenu() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/fix-menu-items',
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
    console.log('🔧 Starting menu items fix...');
    console.log('📍 Make sure your Next.js development server is running on localhost:3000');
    console.log('');
    
    const result = await fixMenu();
    
    if (result.status === 200) {
      console.log('✅ Fix successful!');
      console.log(`📊 Total items updated: ${result.data.totalUpdated}`);
      console.log('📂 Updated categories:');
      
      Object.entries(result.data.categories).forEach(([category, info]) => {
        console.log(`   - ${category}: ${info.count} items`);
      });
      
      console.log('\n🔍 Sample updates:');
      result.data.sampleUpdates.forEach(update => {
        console.log(`   - ${update.name}`);
        console.log(`     Category: ${update.oldCategory} → ${update.newCategory}`);
        console.log(`     Description: ${update.description.substring(0, 50)}...`);
        console.log('');
      });
      
      console.log('🎉 Menu items should now appear in the customer view!');
      
    } else {
      console.error('❌ Fix failed:');
      console.error(`Status: ${result.status}`);
      console.error('Response:', result.data);
    }
    
  } catch (error) {
    console.error('❌ Error during fix:');
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
