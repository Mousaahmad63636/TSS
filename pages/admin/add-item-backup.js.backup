import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddItemBackup() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    image: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create menu item');
      }
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/menu-items');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🍕 Add New Menu Item</h1>
      
      {success && (
        <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
          ✅ Menu item created successfully! Redirecting...
        </div>
      )}
      
      {error && (
        <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', marginBottom: '20px', borderRadius: '5px' }}>
          ❌ Error: {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Item Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              maxWidth: '400px', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
            placeholder="e.g., Margherita Pizza"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              maxWidth: '400px', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          >
            <option value="">Select a category...</option>
            <option value="pizza-margherita">Pizza &gt; Margherita Pizzas</option>
            <option value="pizza-specialty">Pizza &gt; Specialty Pizzas</option>
            <option value="pizza-white">Pizza &gt; White Pizzas</option>
            <option value="pizza-vegan">Pizza &gt; Vegan Pizzas</option>
            <option value="beverages-hot">Beverages &gt; Hot Drinks</option>
            <option value="beverages-cold">Beverages &gt; Cold Drinks</option>
            <option value="beverages-wines">Beverages &gt; Wines &amp; Spirits</option>
            <option value="pasta-spaghetti">Pasta &gt; Spaghetti</option>
            <option value="pasta-penne">Pasta &gt; Penne</option>
            <option value="pasta-ravioli">Pasta &gt; Ravioli</option>
            <option value="burgers-classic">Burgers &gt; Classic Burgers</option>
            <option value="burgers-gourmet">Burgers &gt; Gourmet Burgers</option>
            <option value="burgers-chicken">Burgers &gt; Chicken Burgers</option>
            <option value="burgers-veggie">Burgers &gt; Veggie &amp; Vegan Burgers</option>
            <option value="salad-salads">Salad &gt; Salads</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Price * ($)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            style={{ 
              width: '100%', 
              maxWidth: '400px', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
            placeholder="19.95"
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            style={{ 
              width: '100%', 
              maxWidth: '400px', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
            placeholder="Delicious item description..."
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Image URL
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            style={{ 
              width: '100%', 
              maxWidth: '400px', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
            placeholder="https://images.unsplash.com/photo-..."
          />
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? '#ccc' : '#ff6b35',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              marginRight: '10px'
            }}
          >
            {isSubmitting ? 'Adding Item...' : 'Add Menu Item'}
          </button>
          
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Navigation:</h3>
        <p><a href="/admin/dashboard">← Back to Dashboard</a></p>
        <p><a href="/admin/menu-items">View All Menu Items</a></p>
        <p><a href="/admin/categories">Manage Categories</a></p>
      </div>
      
      <div style={{ marginTop: '20px', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '4px' }}>
        <h4>📝 Note:</h4>
        <p>This is a simplified version that works without complex components.</p>
        <p>Use this if the main add-item page has issues.</p>
      </div>
    </div>
  );
}
