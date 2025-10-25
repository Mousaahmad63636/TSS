import React from 'react';

const CategoryTitle = ({ categories, activeCategory }) => {
  const currentCategory = categories.find(cat => cat.id === activeCategory);
  
  if (!currentCategory) return null;

  return (
    <div className="bg-white border-b border-menu-gray-200 px-4 py-3">
      <h2 className="text-lg font-semibold text-menu-gray-900 text-center">
        {currentCategory.name}
      </h2>
    </div>
  );
};

export default CategoryTitle;