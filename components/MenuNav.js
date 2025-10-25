import React from 'react';

const MenuNav = ({ categories, activeCategory, onCategoryChange }) => {
  const handleKeyDown = (e, categoryId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCategoryChange(categoryId);
    }
  };

  return (
    <nav className="bg-white sticky top-0 z-10 shadow-sm border-b border-menu-gray-200">
      <div className="px-4 py-2">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              onKeyDown={(e) => handleKeyDown(e, category.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-menu-accent-500 focus:ring-offset-2 ${
                activeCategory === category.id
                  ? 'bg-menu-accent-500 text-white'
                  : 'bg-menu-gray-100 text-menu-gray-600 hover:bg-menu-gray-200'
              }`}
              aria-current={activeCategory === category.id ? 'page' : undefined}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default MenuNav;