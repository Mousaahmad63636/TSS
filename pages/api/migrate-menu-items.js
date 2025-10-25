import { migrateMenuItems } from '../../services/firestoreService';

export default async function handler(req, res) {
  // TODO: Add Firebase authentication verification here
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const result = await migrateMenuItems();
    res.status(200).json(result);
  } catch (error) {
    console.error('Migration API error:', error);
    res.status(500).json({ error: 'Failed to migrate menu items' });
  }
}
