import { useState, useRef } from 'react';
import { compressImage, validateImageFile } from '../utils/imageUtils';

export default function ImageUpload({ 
  value, 
  onChange, 
  label = "Image", 
  className = "",
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.8
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    setErrors([]);
    
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsProcessing(true);
    
    try {
      const compressedImage = await compressImage(file, maxWidth, maxHeight, quality);
      onChange(compressedImage);
    } catch (error) {
      setErrors(['Failed to process image: ' + error.message]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const clearImage = () => {
    onChange('');
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-menu-gray-700 mb-2">
        {label}
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center hover:border-menu-accent-400 transition-colors ${
          dragActive ? 'border-menu-accent-500 bg-menu-accent-50' : 'border-menu-gray-300'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="space-y-3">
            <img
              src={value}
              alt="Preview"
              className="mx-auto h-32 w-32 object-cover rounded-lg border"
            />
            <div className="flex justify-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm text-menu-accent-600 hover:text-menu-accent-700 font-medium"
              >
                Change Image
              </button>
              <span className="text-menu-gray-300">|</span>
              <button
                type="button"
                onClick={clearImage}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto h-12 w-12 text-menu-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-menu-accent-600 hover:text-menu-accent-700 font-medium"
              >
                Upload an image
              </button>
              <p className="text-menu-gray-500">or drag and drop</p>
            </div>
            <p className="text-xs text-menu-gray-400">
              PNG, JPG, GIF, WebP up to 5MB
            </p>
          </div>
        )}
        
        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-menu-accent-500"></div>
              <span className="text-sm text-menu-gray-600">Compressing...</span>
            </div>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileInput}
      />
      
      {errors.length > 0 && (
        <div className="mt-2 space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
