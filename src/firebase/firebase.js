// sec/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Bidding application web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdfcR19ETRFAMW3As0c6DHB2L6b2ZXclw",
  authDomain: "bidding-application-b4a5b.firebaseapp.com",
  projectId: "bidding-application-b4a5b",
  storageBucket: "bidding-application-b4a5b.firebasestorage.app",
  messagingSenderId: "93926330181",
  appId: "1:93926330181:web:51a58d2dc9fff7bc6cf82c",
  measurementId: "G-9TPM8B1V2Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Cloud Firestore and get a reference to the service
export const db = getFirestore(app);