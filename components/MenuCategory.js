import React, { useState } from 'react';
import MenuItem from './MenuItem';
import ItemDialog from './ItemDialog';

const MenuCategory = ({ category, isVisible }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemClick = (item) => {
    console.log('Item clicked:', item.name);
    setSelectedItem(item);
    setIsDialogOpen(true);
    console.log('Dialog state set to true');
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

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
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      </div>

      <ItemDialog 
        item={selectedItem}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </section>
  );
};

export default MenuCategory;
