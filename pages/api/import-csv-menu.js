import { getFirestoreDb } from '../../lib/firebase';
import fs from 'fs';
import path from 'path';

const MENU_ITEMS_COLLECTION = 'menuItems';

// Function to parse CSV data
function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  const items = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',');
    if (values.length >= 3) {
      const item = {
        name: values[0].trim(),
        category: values[1].trim(),
        price: parseFloat(values[2].trim()) || 0
      };
      
      // Skip items with no name or invalid data
      if (item.name && item.name !== 'ProductName') {
        items.push(item);
      }
    }
  }
  
  return items;
}

// Function to generate a clean ID from Arabic text
function generateId(name) {
  // Remove Arabic diacritics and normalize
  const cleanName = name
    .replace(/[\u064B-\u0652]/g, '') // Remove Arabic diacritics
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\w\s]/g, '') // Keep Arabic letters, numbers, and spaces
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase();
  
  // If the result is empty or too short, generate a timestamp-based ID
  if (!cleanName || cleanName.length < 2) {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  }
  
  return cleanName;
}

// Function to map Arabic categories to English equivalents
function mapCategory(arabicCategory) {
  const categoryMap = {
    'حلويات': 'desserts',
    'مشروبات': 'beverages', 
    'بيتزا': 'pizza',
    'مناقيش': 'manakish',
    'معجنات': 'pastries',
    'كعك قليتي': 'fried-pastries',
    'اكسترا': 'extras',
    'دزينات': 'dozens',
    'مشروحة': 'open-pastries',
    'طلبية بيت': 'home-orders',
    'طلبية': 'orders',
    'مناقيش سبسيال': 'special-manakish',
    'فطيرة سبانغ كبيرة': 'large-spinach-pie',
    'فطيرة بقلة': 'purslane-pie',
    'فطيرة زعتر بري': 'wild-thyme-pie',
    'علبة دبس رمان': 'pomegranate-molasses'
  };
  
  return categoryMap[arabicCategory] || 'other';
}

// Function to determine if item is vegetarian based on name
function isVegetarian(name) {
  const meatKeywords = ['لحمة', 'لحم', 'حبش', 'دجاج', 'كفتا', 'سجق', 'مرتديلا', 'ببروني', 'بيكون'];
  return !meatKeywords.some(keyword => name.includes(keyword));
}

// Function to format menu item for Firestore
function formatMenuItem(csvItem, index) {
  const id = generateId(csvItem.name);
  const uniqueId = `${id}-${index}`; // Add index to ensure uniqueness
  
  return {
    id: uniqueId,
    name: csvItem.name,
    nameArabic: csvItem.name, // Keep original Arabic name
    nameEnglish: '', // Can be filled later
    description: '',
    descriptionArabic: '',
    descriptionEnglish: '',
    price: csvItem.price,
    category: mapCategory(csvItem.category),
    categoryArabic: csvItem.category,
    image: '',
    allergens: [],
    isVegetarian: isVegetarian(csvItem.name),
    popular: false,
    ageRestricted: csvItem.category.includes('طلبية') ? false : false, // Can be updated later
    available: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'csv-import'
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting CSV import...');
    
    // Read the CSV file
    const csvPath = path.join(process.cwd(), 'khabaz menu.csv');
    
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ 
        error: 'CSV file not found',
        expectedPath: csvPath
      });
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    console.log('CSV file read successfully');
    
    // Parse CSV data
    const csvItems = parseCSV(csvContent);
    console.log(`Parsed ${csvItems.length} items from CSV`);
    
    if (csvItems.length === 0) {
      return res.status(400).json({ error: 'No valid items found in CSV' });
    }
    
    // Get Firestore database
    const db = getFirestoreDb();
    
    // Check if items already exist
    const existingSnapshot = await db.collection(MENU_ITEMS_COLLECTION)
      .where('source', '==', 'csv-import')
      .get();
    
    if (!existingSnapshot.empty) {
      return res.status(400).json({ 
        error: 'CSV items already imported',
        existingCount: existingSnapshot.size,
        message: 'Delete existing CSV imports first or use force=true parameter'
      });
    }
    
    // Format items for Firestore
    const menuItems = csvItems.map((item, index) => formatMenuItem(item, index));
    console.log(`Formatted ${menuItems.length} items for Firestore`);
    
    // Batch write to Firestore (Firestore batch limit is 500)
    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < menuItems.length; i += batchSize) {
      const batch = db.batch();
      const batchItems = menuItems.slice(i, i + batchSize);
      
      batchItems.forEach(item => {
        const docRef = db.collection(MENU_ITEMS_COLLECTION).doc(item.id);
        batch.set(docRef, item);
      });
      
      batches.push(batch);
    }
    
    // Execute all batches
    console.log(`Executing ${batches.length} batches...`);
    await Promise.all(batches.map(batch => batch.commit()));
    
    console.log('CSV import completed successfully!');
    
    // Group items by category for response
    const categoryStats = {};
    menuItems.forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { count: 0, arabicName: item.categoryArabic };
      }
      categoryStats[item.category].count++;
    });
    
    res.status(200).json({
      success: true,
      message: 'CSV menu items imported successfully',
      totalItems: menuItems.length,
      categories: categoryStats,
      sampleItems: menuItems.slice(0, 5).map(item => ({
        name: item.name,
        category: item.category,
        price: item.price
      }))
    });
    
  } catch (error) {
    console.error('Error importing CSV menu:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
