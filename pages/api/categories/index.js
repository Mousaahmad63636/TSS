import categoriesService from '../../../services/categoriesService';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        try {
          const categories = await categoriesService.getAllCategories();
          res.status(200).json(categories);
        } catch (dbError) {
          console.error('Database error in categories API:', dbError);
          // Return empty array if no categories exist yet
          res.status(200).json([]);
        }
        break;

      case 'POST':
        const newCategory = await categoriesService.createCategory(req.body);
        res.status(201).json(newCategory);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Categories API error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
