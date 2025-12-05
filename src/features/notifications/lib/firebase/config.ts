import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

let firebaseApp: FirebaseApp;
let firestoreDb: Firestore;
let analytics: Analytics | null = null;

/**
 * Initialize Firebase App
 * Uses singleton pattern to avoid re-initialization
 */
export const initializeFirebase = (): FirebaseApp => {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized');
  } else {
    firebaseApp = getApps()[0];
  }
  return firebaseApp;
};

/**
 * Get Firestore instance
 */
export const getFirestoreInstance = (): Firestore => {
  if (!firestoreDb) {
    const app = initializeFirebase();
    firestoreDb = getFirestore(app);
  }
  return firestoreDb;
};

/**
 * Get Firebase Analytics instance
 * Only available in browser environment
 */
export const getAnalyticsInstance = (): Analytics | null => {
  if (typeof window === 'undefined' || analytics) {
    return analytics;
  }

  try {
    const app = initializeFirebase();
    analytics = getAnalytics(app);
    console.log('✅ Firebase Analytics initialized');
    return analytics;
  } catch (error) {
    console.warn('⚠️ Firebase Analytics not available:', error);
    return null;
  }
};

/**
 * Check if Firebase is properly configured
 */
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
};
