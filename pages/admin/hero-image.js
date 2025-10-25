import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminLayout from '../../components/AdminLayout';
import ImageUpload from '../../components/ImageUpload';
import { Image as ImageIcon } from 'lucide-react';

export default function HeroImageManager() {
  const [heroImage, setHeroImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageData, setImageData] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    loadHeroImage();
  }, []);

  const loadHeroImage = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hero-image');
      if (response.ok) {
        const data = await response.json();
        setHeroImage(data.image ? data : null);
      }
    } catch (err) {
      console.error('Error loading hero image:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!imageData) {
      setError('Please select an image first');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/hero-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonErr) {
          errorMessage = `Upload failed with status ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      setHeroImage(result.data);
      setSuccess('Hero image uploaded successfully!');
      setImageData('');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete the hero image?')) return;

    try {
      setUploading(true);
      setError(null);

      const response = await fetch('/api/hero-image', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete hero image');
      }

      setHeroImage(null);
      setSuccess('Hero image deleted successfully!');

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout title="Hero Image">
      <Head>
        <title>Hero Image Manager - </title>
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-menu-gray-900">Hero Image Manager</h1>
          <p className="mt-1 text-menu-gray-600">
            Upload and manage the hero image displayed on your homepage
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Hero Image */}
          <div className="bg-white rounded-xl shadow-sm border border-menu-gray-100 p-6">
            <h2 className="text-lg font-semibold text-menu-gray-900 mb-4">Current Hero Image</h2>
            
            {loading ? (
              <div className="aspect-video bg-menu-gray-100 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-menu-accent-500"></div>
              </div>
            ) : heroImage?.image ? (
              <div className="space-y-4">
                <div className="relative group">
                  <img
                    src={heroImage.image}
                    alt="Hero Image"
                    className="w-full aspect-video object-cover rounded-lg"
                  />
                  <button
                    onClick={handleDelete}
                    disabled={uploading}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-menu-gray-600">
                  <p>Uploaded: {new Date(heroImage.uploadedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-menu-gray-100 rounded-lg flex flex-col items-center justify-center text-menu-gray-400">
                <ImageIcon className="w-16 h-16 mb-2" />
                <p className="text-sm">No hero image uploaded</p>
              </div>
            )}
          </div>

          {/* Upload New Image */}
          <div className="bg-white rounded-xl shadow-sm border border-menu-gray-100 p-6">
            <h2 className="text-lg font-semibold text-menu-gray-900 mb-4">Upload New Image</h2>
            
            <div className="space-y-4">
              {/* ImageUpload Component */}
              <ImageUpload 
                value={imageData}
                onChange={setImageData}
                label="Hero Image"
                maxWidth={1920}
                maxHeight={1080}
                quality={0.92}
              />

              {/* Upload Button */}
              <button
                onClick={handleUpload}
                disabled={!imageData || uploading}
                className="w-full flex items-center justify-center px-4 py-3 bg-menu-accent-500 text-white rounded-lg hover:bg-menu-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload Hero Image
                  </>
                )}
              </button>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Image Guidelines</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Use high-quality images for best results</li>
                  <li>• Recommended dimensions: 1920x600px (16:5 ratio)</li>
                  <li>• Landscape orientation works best</li>
                  <li>• File size must be under 5MB</li>
                  <li>• Supported formats: JPG, PNG, GIF, WebP</li>
                  <li>• High quality compression (1920px, 92% quality)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-xl shadow-sm border border-menu-gray-100 p-6">
          <h2 className="text-lg font-semibold text-menu-gray-900 mb-4">How it looks on homepage</h2>
          <div className="bg-menu-gray-100 rounded-lg p-4">
            {heroImage?.image ? (
              <div className="relative">
                <img
                  src={heroImage.image}
                  alt="Hero Preview"
                  className="w-full h-48 md:h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent rounded-lg"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-medium">Preview on homepage</p>
                </div>
              </div>
            ) : (
              <div className="h-48 md:h-64 bg-menu-gray-200 rounded-lg flex items-center justify-center text-menu-gray-400">
                <p>No hero image to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
