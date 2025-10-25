import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-menu-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-menu-gray-200">
        <div className="px-4 py-3 flex items-center justify-center">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Hero Image Skeleton */}
      <div className="w-full h-48 md:h-64 lg:h-72 bg-gray-200 animate-pulse relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="h-8 w-48 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Navigation Skeleton */}
      <div className="bg-white border-b border-menu-gray-200 px-4 py-3">
        <div className="flex space-x-4 overflow-x-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
          ))}
        </div>
      </div>

      {/* Subcategory Slider Skeleton */}
      <div className="bg-white border-b border-menu-gray-200 px-4 py-2">
        <div className="flex space-x-3 overflow-x-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-6 w-16 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
          ))}
        </div>
      </div>

      {/* Menu Items Skeleton */}
      <div className="pb-8">
        {[1, 2, 3].map((section) => (
          <div key={section}>
            {/* Section Header */}
            <div className="bg-white border-b border-menu-gray-200 px-4 py-3">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            {/* Menu Items */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white border-b border-menu-gray-200 p-4">
                <div className="flex items-start space-x-3">
                  {/* Image Skeleton */}
                  <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                  
                  {/* Content Skeleton */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="flex space-x-2">
                      <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
