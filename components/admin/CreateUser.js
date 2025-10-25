import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function CreateUser() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const result = await signUp(formData.email, formData.password);

    if (!result.success) {
      setError(result.error || 'Failed to create user');
    } else {
      setSuccess('User created successfully!');
      setFormData({ email: '', password: '' });
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Admin User</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-menu-accent-500 focus:border-menu-accent-500"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength="6"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-menu-accent-500 focus:border-menu-accent-500"
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}
        
        {success && (
          <div className="text-green-600 text-sm">{success}</div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-menu-accent-600 text-white py-2 px-4 rounded-md hover:bg-menu-accent-700 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}
