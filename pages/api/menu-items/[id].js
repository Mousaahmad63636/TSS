import { getMenuItem, updateMenuItem, deleteMenuItem } from '../../../services/firestoreService';

export default async function handler(req, res) {
  const { id } = req.query;
  
  switch (req.method) {
    case 'GET':
      // Public access for menu viewing
      try {
        const item = await getMenuItem(id);
        
        if (!item) {
          return res.status(404).json({ error: 'Item not found' });
        }
        
        res.status(200).json(item);
      } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Failed to fetch menu item' });
      }
      break;
      
    case 'PUT':
    case 'DELETE':
      // TODO: Add Firebase authentication verification here
      
      if (req.method === 'PUT') {
        try {
          const result = await updateMenuItem(id, req.body);
          res.status(200).json({ success: true, ...result });
        } catch (error) {
          console.error('API error:', error);
          res.status(500).json({ error: 'Failed to update menu item' });
        }
      } else if (req.method === 'DELETE') {
        try {
          const result = await deleteMenuItem(id);
          res.status(200).json({ success: true, ...result });
        } catch (error) {
          console.error('API error:', error);
          res.status(500).json({ error: 'Failed to delete menu item' });
        }
      }
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
