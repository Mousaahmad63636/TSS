import categoriesService from '../../../services/categoriesService';

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  try {
    switch (method) {
      case 'GET':
        const category = await categoriesService.getCategoryById(id);
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
        break;

      case 'PUT':
        const updatedCategory = await categoriesService.updateCategory(id, req.body);
        res.status(200).json(updatedCategory);
        break;

      case 'DELETE':
        await categoriesService.deleteCategory(id);
        res.status(204).end();
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Category API error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
