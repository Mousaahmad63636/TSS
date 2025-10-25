// Script to update menu prices
const http = require('http');

async function updatePrices() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/update-prices',
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
    console.log('💰 Updating menu prices...');
    console.log('📊 Formula: Current Price × 90,000 → Round to nearest 5,000');
    console.log('');
    
    const result = await updatePrices();
    
    if (result.status === 200) {
      console.log('✅ Prices updated successfully!');
      console.log(`📊 Total items updated: ${result.data.totalUpdated}`);
      
      console.log('\n📈 Price Statistics:');
      console.log(`   - Minimum price: ${result.data.priceStats.minPrice.toLocaleString()} LL`);
      console.log(`   - Maximum price: ${result.data.priceStats.maxPrice.toLocaleString()} LL`);
      console.log(`   - Average price: ${result.data.priceStats.avgPrice.toLocaleString()} LL`);
      
      console.log('\n🔍 Sample price updates:');
      result.data.sampleUpdates.forEach(update => {
        console.log(`   - ${update.name}`);
        console.log(`     ${update.oldPrice} → ${update.newPrice}`);
        console.log(`     Calculation: ${update.calculation}`);
        console.log('');
      });
      
      console.log('🎉 All prices have been updated to Lebanese Lira!');
      
    } else {
      console.error('❌ Price update failed:', result.data);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
