import React from 'react';

const MainCategoryNav = ({ mainCategories, activeMainCategory, onMainCategoryChange }) => {
  const handleKeyDown = (e, categoryId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onMainCategoryChange(categoryId);
    }
  };

  // Generate dynamic colors based on category color property
  const getCategoryColors = (category) => {
    const color = category.color || 'orange'; // Default to orange if no color specified
    
    const colorMap = {
      'orange': {
        active: 'bg-orange-500 text-white border-orange-500',
        inactive: 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50 hover:border-orange-300'
      },
      'blue': {
        active: 'bg-blue-500 text-white border-blue-500',
        inactive: 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300'
      },
      'pink': {
        active: 'bg-pink-500 text-white border-pink-500',
        inactive: 'bg-white text-pink-600 border-pink-200 hover:bg-pink-50 hover:border-pink-300'
      },
      'red': {
        active: 'bg-red-500 text-white border-red-500',
        inactive: 'bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300'
      },
      'green': {
        active: 'bg-green-500 text-white border-green-500',
        inactive: 'bg-white text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300'
      },
      'purple': {
        active: 'bg-purple-500 text-white border-purple-500',
        inactive: 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300'
      },
      'yellow': {
        active: 'bg-yellow-500 text-white border-yellow-500',
        inactive: 'bg-white text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300'
      },
      'indigo': {
        active: 'bg-indigo-500 text-white border-indigo-500',
        inactive: 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300'
      }
    };
    return colorMap[color] || colorMap['orange'];
  };

  // Professional SVG icons for categories with flexible mapping
  const getCategoryIcon = (category, className) => {
    const categoryName = category.name.toLowerCase();
    const categoryId = category.id;
    
    const iconMap = {
      'pizza': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l10 20-10-5-10 5L12 2z" />
        </svg>
      ),
      'beverages': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12V7a1 1 0 011-1h12a1 1 0 011 1v5M5 12l2 7h10l2-7M5 12h14" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V2M9 2h6" />
        </svg>
      ),
      'pasta': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 6v12M16 6v12" />
        </svg>
      ),
      'burgers': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 8h16a2 2 0 012 2v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 012-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12M8 16h8" />
        </svg>
      ),
      'salad': (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" />
        </svg>
      )
    };
    
    // Try to match by category ID first, then by name, then use default
    return iconMap[categoryId] || 
           iconMap[categoryName] ||
           // Default icon for unrecognized categories
           (
             <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
               <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
             </svg>
           );
  };

  return (
    <nav className="bg-white sticky top-0 z-20 shadow-lg border-b border-gray-200">
      <div className="px-3 py-4">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide pb-1 category-nav-container">
          {mainCategories.map((category) => {
            const categoryColors = getCategoryColors(category);
            const isActive = activeMainCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => onMainCategoryChange(category.id)}
                onKeyDown={(e) => handleKeyDown(e, category.id)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex-shrink-0 min-w-fit border-2 category-nav-item ${
                  isActive
                    ? `${categoryColors.active} shadow-lg transform scale-105 focus:ring-white`
                    : `${categoryColors.inactive} hover:scale-102 focus:ring-gray-300`
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="flex flex-col items-center space-y-1">
                  {getCategoryIcon(category, "w-5 h-5 stroke-current")}
                  <span className="text-xs font-medium">{category.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MainCategoryNav;