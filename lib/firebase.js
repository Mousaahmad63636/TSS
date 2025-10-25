// Firebase configuration - server-side only
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
const initFirebase = () => {
  if (getApps().length === 0) {
    console.log('Initializing Firebase Admin SDK...');
    
    // Check if required environment variables are present
    const requiredEnvVars = [
      'FIREBASE_PROJECT_ID',
      'FIREBASE_PRIVATE_KEY_ID', 
      'FIREBASE_PRIVATE_KEY',
      'FIREBASE_CLIENT_EMAIL',
      'FIREBASE_CLIENT_ID'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing Firebase environment variables: ${missingVars.join(', ')}`);
    }
    
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
    };

    console.log('Firebase config - Project ID:', process.env.FIREBASE_PROJECT_ID);
    console.log('Firebase config - Client Email:', process.env.FIREBASE_CLIENT_EMAIL);

    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    
    console.log('Firebase Admin SDK initialized successfully');
  }
};

// Get Firestore instance
export const getFirestoreDb = () => {
  try {
    // Skip Firebase initialization during build time if env vars are missing
    if (process.env.NODE_ENV === 'production' && !process.env.FIREBASE_PROJECT_ID) {
      console.warn('Firebase not initialized - missing environment variables during build');
      return null;
    }
    
    initFirebase();
    return getFirestore();
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    
    // During build time, return null instead of throwing
    if (process.env.NODE_ENV === 'production') {
      console.warn('Firebase initialization failed during build, returning null');
      return null;
    }
    
    throw new Error(`Firebase initialization failed: ${error.message}`);
  }
};

// Collection name
export const MENU_ITEMS_COLLECTION = 'menuItems';
