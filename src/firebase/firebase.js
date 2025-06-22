// sec/firebase/firebase.js

// Import necessary functions from Firebase SDK.
// initializeApp connects your app to Firebase with your config.
// getFirestore allows you to use Firestore (Firebase's database service).
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// This object contains all the important credentials and identifiers
// that Firebase needs to connect your app to your specific Firebase project.
// These are provided when you set up your project on the Firebase Console.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app with the config above.
// This connects your React app to Firebase services.
const app = initializeApp(firebaseConfig);

// Initialize Firestore database service, using the Firebase app you just initialized.
// Export this so other parts of your app can use Firestore to read/write data.
export const db = getFirestore(app);
