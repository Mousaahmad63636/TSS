import React from 'react';
import MenuItem from './MenuItem';

const MenuCategory = ({ category, isVisible }) => {
  if (!isVisible) return null;

  return (
    <section id={category.id} className="pb-6">
      <div className="px-4">
        <div className="bg-white rounded-lg shadow-sm border border-menu-gray-200 overflow-hidden">
          {category.items.map((item, index) => (
            <MenuItem 
              key={item.id} 
              item={item} 
              isLast={index === category.items.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuCategory;
