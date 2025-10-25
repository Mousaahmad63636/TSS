// Client-side data fetcher for menu items
// This is safe to import in React components as it uses fetch API instead of direct Google API calls

// Fetch all menu items
export const fetchMenuItems = async () => {
  try {
    const response = await fetch('/api/menu-items');
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch menu items:', error);
    throw error;
  }
};

// Fetch a single menu item by ID
export const fetchMenuItem = async (id) => {
  try {
    const response = await fetch(`/api/menu-items/${id}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch menu item ${id}:`, error);
    throw error;
  }
};

// Create a new menu item
export const createMenuItem = async (item) => {
  try {
    const response = await fetch('/api/menu-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to create menu item:', error);
    throw error;
  }
};

// Update an existing menu item
export const updateMenuItem = async (id, item) => {
  try {
    const response = await fetch(`/api/menu-items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to update menu item ${id}:`, error);
    throw error;
  }
};

// Delete a menu item
export const deleteMenuItem = async (id) => {
  try {
    const response = await fetch(`/api/menu-items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to delete menu item ${id}:`, error);
    throw error;
  }
};
