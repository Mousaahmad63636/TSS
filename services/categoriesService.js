// Categories service - Firebase Firestore operations for category management
import { getFirestoreDb } from '../lib/firebase';

const CATEGORIES_COLLECTION = 'categories';

// Data structure for categories:
// {
//   id: "pizza",
//   name: "Pizza", 
//   description: "Authentic wood-fired pizzas with fresh ingredients",
//   color: "orange", // For UI theming
//   order: 1, // Display order
//   active: true,
//   subcategories: [
//     {
//       id: "margherita",
//       name: "Margherita Pizzas",
//       description: "Classic Italian pizzas with tomato, mozzarella, and fresh basil",
//       order: 1,
//       active: true
//     }
//   ],
//   createdAt: timestamp,
//   updatedAt: timestamp
// }

export const categoriesService = {
  // Fetch all categories with subcategories
  async getAllCategories() {
    try {
      const db = getFirestoreDb();
      
      // Return empty array if database is not available (during build)
      if (!db) {
        console.warn('Database not available, returning empty categories');
        return [];
      }
      
      const snapshot = await db.collection(CATEGORIES_COLLECTION).get();
      
      const categories = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        categories.push({
          id: doc.id,
          ...data
        });
      });
      
      // Sort by order field, defaulting to 0 if not set
      categories.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Fetch single category by ID
  async getCategoryById(categoryId) {
    try {
      const db = getFirestoreDb();
      const doc = await db.collection(CATEGORIES_COLLECTION).doc(categoryId).get();
      
      if (!doc.exists) {
        throw new Error('Category not found');
      }
      
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // Create new category
  async createCategory(categoryData) {
    try {
      const db = getFirestoreDb();
      const now = new Date();
      
      const category = {
        ...categoryData,
        subcategories: categoryData.subcategories || [],
        active: true,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await db.collection(CATEGORIES_COLLECTION).add(category);
      
      return {
        id: docRef.id,
        ...category
      };
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Update existing category
  async updateCategory(categoryId, updates) {
    try {
      const db = getFirestoreDb();
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await db.collection(CATEGORIES_COLLECTION).doc(categoryId).update(updateData);
      
      return await this.getCategoryById(categoryId);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category (soft delete)
  async deleteCategory(categoryId) {
    try {
      const db = getFirestoreDb();
      await db.collection(CATEGORIES_COLLECTION).doc(categoryId).update({
        active: false,
        updatedAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Add subcategory to existing category
  async addSubcategory(categoryId, subcategoryData) {
    try {
      const category = await this.getCategoryById(categoryId);
      const subcategories = category.subcategories || [];
      
      const newSubcategory = {
        id: subcategoryData.id || Date.now().toString(),
        ...subcategoryData,
        active: true,
        order: subcategoryData.order || subcategories.length + 1
      };
      
      subcategories.push(newSubcategory);
      
      return await this.updateCategory(categoryId, { subcategories });
    } catch (error) {
      console.error('Error adding subcategory:', error);
      throw error;
    }
  },

  // Update subcategory
  async updateSubcategory(categoryId, subcategoryId, updates) {
    try {
      const category = await this.getCategoryById(categoryId);
      const subcategories = category.subcategories || [];
      
      const subcategoryIndex = subcategories.findIndex(sub => sub.id === subcategoryId);
      if (subcategoryIndex === -1) {
        throw new Error('Subcategory not found');
      }
      
      subcategories[subcategoryIndex] = {
        ...subcategories[subcategoryIndex],
        ...updates
      };
      
      return await this.updateCategory(categoryId, { subcategories });
    } catch (error) {
      console.error('Error updating subcategory:', error);
      throw error;
    }
  },

  // Remove subcategory
  async removeSubcategory(categoryId, subcategoryId) {
    try {
      const category = await this.getCategoryById(categoryId);
      const subcategories = category.subcategories || [];
      
      const filteredSubcategories = subcategories.filter(sub => sub.id !== subcategoryId);
      
      return await this.updateCategory(categoryId, { subcategories: filteredSubcategories });
    } catch (error) {
      console.error('Error removing subcategory:', error);
      throw error;
    }
  }
};

export default categoriesService;
