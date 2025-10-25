// This file should only be imported from server-side code (API routes)
// It contains Node.js specific code that won't work in the browser

import { google } from 'googleapis';

// Set up Google Sheets API
export const getGoogleSheetsClient = async () => {
  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Error creating Google Sheets client:', error);
    throw new Error('Failed to initialize Google Sheets client');
  }
};

// Transform sheet data to our app's format
export const transformRowToItem = (row, headers) => {
  if (!row || row.length === 0) return null;
  
  const item = {};
  headers.forEach((header, index) => {
    if (index < row.length) {
      item[header] = row[index];
    } else {
      item[header] = '';
    }
  });
  
  // Generate ID if not present
  if (!item.id) {
    item.id = item.name?.toLowerCase().replace(/\s+/g, '-') || `item-${Date.now()}`;
  }
  
  // Format specific fields
  if (item.price) {
    item.price = parseFloat(item.price).toFixed(2);
  }
  
  if (item.allergens) {
    item.allergens = item.allergens.split(';').filter(a => a && a !== 'none');
  } else {
    item.allergens = [];
  }
  
  // Convert string boolean values
  item.isVegetarian = item.isvegetarian === 'yes';
  item.popular = item.popular === 'yes';
  item.ageRestricted = item.agerestricted === 'yes';
  
  return item;
};

// Transform item object to row format for sheets
export const transformItemToRow = (item, headers) => {
  return headers.map(header => {
    switch (header) {
      case 'allergens':
        return Array.isArray(item[header]) ? item[header].join(';') : item[header];
      case 'isvegetarian':
      case 'popular':
      case 'agerestricted':
        return typeof item[header] === 'boolean' ? (item[header] ? 'yes' : 'no') : item[header];
      default:
        return item[header] || '';
    }
  });
};
