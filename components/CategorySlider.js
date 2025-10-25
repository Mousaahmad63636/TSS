import React, { useRef, useState, useEffect } from 'react';

const CategorySlider = ({ categories, activeCategory, onCategoryChange }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position and update arrow visibility
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [categories]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  const handleKeyDown = (e, categoryId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onCategoryChange(categoryId);
    }
  };

  return (
    <nav className="bg-white sticky top-0 z-10 shadow-sm border-b border-menu-gray-200">
      <div className="relative px-4 py-3">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white shadow-lg rounded-full w-8 h-8 flex items-center justify-center border border-menu-gray-200 hover:bg-menu-gray-50 focus:outline-none focus:ring-2 focus:ring-menu-accent-500 transition-all duration-200"
            aria-label="Scroll categories left"
          >
            <svg 
              className="w-4 h-4 text-menu-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white shadow-lg rounded-full w-8 h-8 flex items-center justify-center border border-menu-gray-200 hover:bg-menu-gray-50 focus:outline-none focus:ring-2 focus:ring-menu-accent-500 transition-all duration-200"
            aria-label="Scroll categories right"
          >
            <svg 
              className="w-4 h-4 text-menu-gray-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        )}

        {/* Categories Container */}
        <div 
          ref={scrollContainerRef}
          className="flex space-x-3 overflow-x-auto scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              onKeyDown={(e) => handleKeyDown(e, category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-menu-accent-500 focus:ring-offset-2 ${
                activeCategory === category.id
                  ? 'bg-menu-accent-500 text-white shadow-sm'
                  : 'bg-menu-gray-100 text-menu-gray-600 hover:bg-menu-gray-200'
              }`}
              aria-current={activeCategory === category.id ? 'page' : undefined}
            >
              <span className="flex items-center space-x-1">
                {category.icon && <span className="text-xs">{category.icon}</span>}
                <span>{category.name}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategorySlider;