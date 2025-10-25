import { useState, useEffect } from 'react';

export default function SimpleCategories() {
  const [message, setMessage] = useState('Loading...');
  
  useEffect(() => {
    // Test if we can load the categories service
    const testService = async () => {
      try {
        // Try to import the service
        const categoriesService = await import('../../services/categoriesService');
        
        // Try to fetch categories
        const categories = await categoriesService.default.getAllCategories();
        setMessage(`✅ Categories service working! Found ${categories.length} categories.`);
      } catch (error) {
        setMessage(`❌ Error: ${error.message}`);
      }
    };
    
    testService();
  }, []);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🔧 Simple Categories Test</h1>
      <p>{message}</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Manual Category Management</h2>
        <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px' }}>
          <h3>Add New Category</h3>
          <input type="text" placeholder="Category name" style={{ marginRight: '10px', padding: '5px' }} />
          <input type="text" placeholder="Description" style={{ marginRight: '10px', padding: '5px' }} />
          <select style={{ marginRight: '10px', padding: '5px' }}>
            <option>orange</option>
            <option>blue</option>
            <option>pink</option>
            <option>red</option>
            <option>green</option>
          </select>
          <button style={{ padding: '5px 15px' }}>Add Category</button>
        </div>
        
        <div style={{ border: '1px solid #ccc', padding: '15px' }}>
          <h3>Add New Subcategory</h3>
          <select style={{ marginRight: '10px', padding: '5px' }}>
            <option>Select parent category...</option>
            <option>Pizza</option>
            <option>Beverages</option>
            <option>Pasta</option>
            <option>Burgers</option>
          </select>
          <input type="text" placeholder="Subcategory name" style={{ marginRight: '10px', padding: '5px' }} />
          <input type="text" placeholder="Description" style={{ marginRight: '10px', padding: '5px' }} />
          <button style={{ padding: '5px 15px' }}>Add Subcategory</button>
        </div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Navigation:</h3>
        <p><a href="/admin/dashboard">← Back to Dashboard</a></p>
        <p><a href="/admin/categories">Full Categories Page</a></p>
        <p><a href="/admin/diagnostic">Diagnostic Page</a></p>
      </div>
      
      <div style={{ marginTop: '30px', backgroundColor: '#f0f0f0', padding: '10px' }}>
        <h3>Debug Info:</h3>
        <p>This page tests categories service without complex UI.</p>
        <p>Check the message above for service status.</p>
      </div>
    </div>
  );
}
