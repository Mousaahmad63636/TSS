import React from 'react';
import Image from 'next/image';

const MenuItem = React.memo(({ item }) => {
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

  // Build dietary array from various sources
  const buildDietaryInfo = () => {
    const dietaryInfo = [...(item.dietary || [])];
    
    if (item.isVegetarian) {
      dietaryInfo.push('vegetarian');
    }
    
    return [...new Set(dietaryInfo)]; // Remove duplicates
  };

  const dietaryInfo = buildDietaryInfo();

  return (
    <div className="bg-white border-b border-menu-gray-200 p-4 relative">
      <div className="flex items-start space-x-3">
        <div className="relative flex-shrink-0">
          <Image
            src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'}
            alt={item.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-lg object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rw="
            priority={false}
          />
          {item.popular && (
            <div className="absolute -top-1 -right-1 bg-menu-accent-500 text-white px-1.5 py-0.5 rounded-full text-xs font-medium">
              ★
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-semibold text-menu-gray-900 truncate pr-2">
              {item.name}
            </h3>
            <span className="text-lg font-bold text-menu-accent-600 flex-shrink-0">
              ${item.price}
            </span>
          </div>
          
          <p className="text-sm text-menu-gray-600 leading-relaxed mb-1 line-clamp-2">
            {item.description}
          </p>

          {item.description2 && (
            <p className="text-xs text-menu-gray-500 leading-relaxed mb-2 line-clamp-1">
              {item.description2}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1 mb-2">
            {item.prepTime && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                🕒 {item.prepTime}
              </span>
            )}
            
            {dietaryInfo.length > 0 && dietaryInfo.map((diet) => (
              <span
                key={diet}
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDietaryBadgeColor(diet)}`}
              >
                {formatDietary(diet)}
              </span>
            ))}
          </div>

          {item.allergens && item.allergens.length > 0 && (
            <div className="text-xs text-red-600">
              <span className="font-medium">Allergens:</span> {item.allergens.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default MenuItem;
