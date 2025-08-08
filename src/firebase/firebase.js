// sec/firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase project configuration object.
 * Uses environment variables to keep sensitive info secure.
 * Replace these variables with your actual Firebase config values if needed.
 *
 * @constant {object}
 * @property {string} apiKey - API key for Firebase project.
 * @property {string} authDomain - Authentication domain for Firebase.
 * @property {string} projectId - Project ID for Firebase.
 * @property {string} storageBucket - Storage bucket URL.
 * @property {string} messagingSenderId - Messaging sender ID.
 * @property {string} appId - Application ID.
 * @property {string} measurementId - Measurement ID for analytics.
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

/**
 * Initializes and exports the Firebase app instance.
 * Connects the React app to Firebase services using the provided config.
 *
 * @constant {FirebaseApp} app - Initialized Firebase app instance.
 */
const app = initializeApp(firebaseConfig);

/**
 * Initializes Firebase Authentication and gets a reference to the service.
 *
 * @constant {Auth} auth - Firebase Authentication instance.
 */
export const auth = getAuth(app);

/**
 * Initializes and exports the Firestore database instance.
 * Used to read and write data to the Firestore database.
 *
 * @constant {Firestore} db - Firestore database instance.
 */
export const db = getFirestore(app);
