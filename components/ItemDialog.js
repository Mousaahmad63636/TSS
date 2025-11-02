import React from 'react';
import Image from 'next/image';

const ItemDialog = ({ item, isOpen, onClose }) => {
  console.log('ItemDialog render - isOpen:', isOpen, 'item:', item?.name);
  if (!isOpen || !item) return null;

  const getDietaryBadgeColor = (dietary) => {
    const colors = {
      vegetarian: 'bg-green-100 text-green-800',
      vegan: 'bg-green-100 text-green-800',
      'gluten-free': 'bg-blue-100 text-blue-800',
      'gluten-free-options': 'bg-blue-100 text-blue-800'
    };
    return colors[dietary] || 'bg-gray-100 text-gray-800';
  };

  const formatDietary = (dietary) => {
    return dietary.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const buildDietaryInfo = () => {
    const dietaryInfo = [...(item.dietary || [])];
    if (item.isVegetarian) {
      dietaryInfo.push('vegetarian');
    }
    return [...new Set(dietaryInfo)];
  };

  const dietaryInfo = buildDietaryInfo();

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Item Image */}
        <div className="relative w-full h-64">
          <Image
            src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'}
            alt={item.name}
            fill
            className="object-cover rounded-t-2xl"
            priority
          />
          {item.popular && (
            <div className="absolute top-4 right-4 bg-menu-accent-500 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
              ★ Popular
            </div>
          )}
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Item Details */}
        <div className="p-6">
          {/* Name and Price */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-menu-gray-900 pr-4">
              {item.name}
            </h2>
            <span className="text-2xl font-bold text-menu-accent-600 flex-shrink-0">
              ${item.price}
            </span>
          </div>

          {/* Description */}
          <p className="text-base text-menu-gray-700 leading-relaxed mb-4">
            {item.description}
          </p>

          {item.description2 && (
            <p className="text-sm text-menu-gray-600 leading-relaxed mb-4">
              {item.description2}
            </p>
          )}

          {/* Prep Time and Dietary Info */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {item.prepTime && (
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                🕒 {item.prepTime}
              </span>
            )}
            
            {dietaryInfo.length > 0 && dietaryInfo.map((diet) => (
              <span
                key={diet}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${getDietaryBadgeColor(diet)}`}
              >
                {formatDietary(diet)}
              </span>
            ))}
          </div>

          {/* Allergens */}
          {item.allergens && item.allergens.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <span className="font-semibold">⚠️ Allergens:</span> {item.allergens.join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDialog;
