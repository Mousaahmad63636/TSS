import React from 'react';

const CompactCategoryNav = ({ categories, activeCategory, onCategoryChange }) => {
  const handleKeyDown = (e, categoryId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCategoryChange(categoryId);
    }
  };

  return (
    <nav className="bg-menu-gray-50 px-4 py-3">
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            onKeyDown={(e) => handleKeyDown(e, category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-menu-accent-500 focus:ring-offset-2 ${
              activeCategory === category.id
                ? 'bg-menu-accent-500 text-white shadow-sm'
                : 'bg-white text-menu-gray-600 hover:bg-menu-gray-50 border border-menu-gray-200'
            }`}
            aria-current={activeCategory === category.id ? 'page' : undefined}
          >
            {category.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CompactCategoryNav;