// Server-side hero image service (uses Firebase Admin)
import { getFirestoreDb } from '../lib/firebase';

const HERO_DOC_ID = 'homepage-hero';
const HERO_COLLECTION = 'siteSettings';

/**
 * Get current hero image data
 * Returns base64 image string and metadata
 */
export async function getHeroImage() {
  try {
    const db = getFirestoreDb();
    const docRef = db.collection(HERO_COLLECTION).doc(HERO_DOC_ID);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error fetching hero image:', error);
    throw new Error('Failed to fetch hero image: ' + error.message);
  }
}

/**
 * Save hero image to Firestore
 * Image is stored as base64 string (same as menu items)
 * @param {string} imageBase64 - Base64 encoded image string
 */
export async function saveHeroImage(imageBase64) {
  try {
    const db = getFirestoreDb();
    const docRef = db.collection(HERO_COLLECTION).doc(HERO_DOC_ID);
    
    const heroData = {
      image: imageBase64, // Store base64 string directly
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await docRef.set(heroData, { merge: true });
    
    return heroData;
  } catch (error) {
    console.error('Error saving hero image:', error);
    throw new Error('Failed to save hero image: ' + error.message);
  }
}

/**
 * Clear hero image from Firestore
 */
export async function clearHeroImage() {
  try {
    const db = getFirestoreDb();
    const docRef = db.collection(HERO_COLLECTION).doc(HERO_DOC_ID);
    
    await docRef.set({
      image: null,
      uploadedAt: null,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Error clearing hero image:', error);
    throw new Error('Failed to clear hero image: ' + error.message);
  }
}
