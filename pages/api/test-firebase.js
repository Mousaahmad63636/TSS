import { getFirestoreDb } from '../../lib/firebase';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Testing Firebase connection...');
    
    // Test Firebase connection
    const db = getFirestoreDb();
    console.log('Firebase db instance created successfully');
    
    // Test a simple operation - list collections
    const collections = await db.listCollections();
    console.log('Collections found:', collections.map(c => c.id));
    
    res.status(200).json({ 
      success: true,
      message: 'Firebase connection successful',
      collections: collections.map(c => c.id),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Firebase test error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
