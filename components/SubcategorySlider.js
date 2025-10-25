import React, { useRef, useState, useEffect } from 'react';

const SubcategorySlider = ({ subcategories, activeSubcategory, onSubcategoryChange }) => {
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
  }, [subcategories]);

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

  const handleKeyDown = (e, subcategoryId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSubcategoryChange(subcategoryId);
    }
  };

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <nav className="bg-white sticky top-24 z-10 shadow-sm border-b border-menu-gray-200">
      <div className="relative px-4 py-3">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-r-full w-6 h-12 flex items-center justify-center border-r border-t border-b border-menu-gray-200 hover:bg-menu-gray-50 focus:outline-none focus:ring-2 focus:ring-menu-accent-500 transition-all duration-200"
            aria-label="Scroll subcategories left"
          >
            <svg 
              className="w-3 h-3 text-menu-gray-600" 
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
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-l-full w-6 h-12 flex items-center justify-center border-l border-t border-b border-menu-gray-200 hover:bg-menu-gray-50 focus:outline-none focus:ring-2 focus:ring-menu-accent-500 transition-all duration-200"
            aria-label="Scroll subcategories right"
          >
            <svg 
              className="w-3 h-3 text-menu-gray-600" 
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

        {/* Subcategories Container */}
        <div 
          ref={scrollContainerRef}
          className="flex space-x-3 overflow-x-auto scrollbar-hide px-1 justify-start"
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {subcategories.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => onSubcategoryChange(subcategory.id)}
              onKeyDown={(e) => handleKeyDown(e, subcategory.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-menu-accent-500 focus:ring-offset-2 border ${
                activeSubcategory === subcategory.id
                  ? 'bg-menu-accent-500 text-white shadow-sm border-menu-accent-500'
                  : 'bg-menu-gray-50 text-menu-gray-700 hover:bg-menu-accent-50 hover:text-menu-accent-700 hover:border-menu-accent-200 border-menu-gray-200'
              }`}
              aria-current={activeSubcategory === subcategory.id ? 'page' : undefined}
              title={`Jump to ${subcategory.name} section`}
            >
              {subcategory.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SubcategorySlider;