import { getFirestoreDb } from '../../lib/firebase';

const MENU_ITEMS_COLLECTION = 'menuItems';

// Function to round to nearest 5000
function roundToNearest5000(price) {
  return Math.round(price / 5000) * 5000;
}

// Function to update price
function updatePrice(currentPrice) {
  const numericPrice = parseFloat(currentPrice) || 0;
  const newPrice = numericPrice * 90000;
  const roundedPrice = roundToNearest5000(newPrice);
  return roundedPrice;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting price update...');
    
    const db = getFirestoreDb();
    
    // Get all CSV imported items
    const snapshot = await db.collection(MENU_ITEMS_COLLECTION)
      .where('source', '==', 'csv-import')
      .get();
    
    if (snapshot.empty) {
      return res.status(404).json({ 
        error: 'No CSV imported items found to update prices' 
      });
    }
    
    console.log(`Found ${snapshot.size} items to update prices`);
    
    // Process items in batches
    const batchSize = 500;
    const batches = [];
    let currentBatch = db.batch();
    let batchCount = 0;
    
    const updates = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const currentPrice = data.price || 0;
      const newPrice = updatePrice(currentPrice);
      
      const updatedData = {
        ...data,
        price: newPrice,
        originalPrice: currentPrice, // Keep track of original price
        updatedAt: new Date(),
        priceUpdated: true
      };
      
      currentBatch.update(doc.ref, updatedData);
      batchCount++;
      
      updates.push({
        id: doc.id,
        name: data.name,
        oldPrice: currentPrice,
        newPrice: newPrice,
        multiplier: 90000
      });
      
      // Create new batch if current one is full
      if (batchCount >= batchSize) {
        batches.push(currentBatch);
        currentBatch = db.batch();
        batchCount = 0;
      }
    });
    
    // Add the last batch if it has items
    if (batchCount > 0) {
      batches.push(currentBatch);
    }
    
    // Execute all batches
    console.log(`Executing ${batches.length} batches...`);
    await Promise.all(batches.map(batch => batch.commit()));
    
    console.log('Price update completed successfully!');
    
    // Calculate statistics
    const priceStats = {
      totalUpdated: updates.length,
      minPrice: Math.min(...updates.map(u => u.newPrice)),
      maxPrice: Math.max(...updates.map(u => u.newPrice)),
      avgPrice: Math.round(updates.reduce((sum, u) => sum + u.newPrice, 0) / updates.length)
    };
    
    res.status(200).json({
      success: true,
      message: 'Prices updated successfully',
      totalUpdated: updates.length,
      priceStats: priceStats,
      sampleUpdates: updates.slice(0, 15).map(update => ({
        name: update.name,
        oldPrice: `$${update.oldPrice}`,
        newPrice: `${update.newPrice.toLocaleString()} LL`,
        calculation: `${update.oldPrice} × 90,000 = ${(update.oldPrice * 90000).toLocaleString()} → ${update.newPrice.toLocaleString()}`
      }))
    });
    
  } catch (error) {
    console.error('Error updating prices:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
