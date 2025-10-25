import { getHeroImage, saveHeroImage, clearHeroImage } from '../../services/heroImageService';

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      // Set cache headers for hero images (longer cache since they change less frequently)
      res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
      
      // Fetch current hero image
      const heroData = await getHeroImage();
      return res.status(200).json(heroData || { image: null });
    }

    if (method === 'POST') {
      // Save hero image (base64 string)
      const { image } = req.body;

      if (!image) {
        return res.status(400).json({ error: 'No image data provided' });
      }

      // Validate base64 image format
      if (!image.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Invalid image format. Must be base64 encoded image.' });
      }

      // Save to Firestore
      const heroData = await saveHeroImage(image);

      return res.status(200).json({
        success: true,
        data: heroData,
      });
    }

    if (method === 'DELETE') {
      // Delete hero image
      await clearHeroImage();
      return res.status(200).json({ success: true });
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
