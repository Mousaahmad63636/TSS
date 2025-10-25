import React from 'react';

const MenuHeader = ({ restaurant }) => {
  return (
    <header className="bg-white shadow-sm border-b border-menu-gray-200">
      <div className="px-4 py-3 flex items-center justify-center">
        {/* Restaurant name centered */}
        <div className="text-center">
          <h1 className="text-lg font-bold text-menu-gray-900">
            {restaurant.name}
          </h1>
        </div>
      </div>
    </header>
  );
};

export default MenuHeader;