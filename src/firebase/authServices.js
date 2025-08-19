import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

/**
 * Signs up a new user with email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user account.
 * @returns {Promise<UserCredential>} - A promise that resolves with the user credential information.
 */
export async function signUp(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      createdAt: new Date(),
    });

    return userCredential;
  } catch (error) {
    console.error("SignUp Error:", error.code, error.message);
    throw error;
  }
}

/**
 * Signs in an existing user with email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user account.
 * @returns {Promise<UserCredential>} - A promise that resolves with the user credential information.
 */
export async function signIn(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    console.error("SignIn Error:", error.code, error.message);
    throw error;
  }
}

/**
 * Signs out the current user.
 *
 * @returns {Promise<void>} - A promise that resolves when the user is signed out.
 */
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout Error:", error.code, error.message);
    throw error;
  }
}

/**
 * Listens for changes to the user's authentication state.
 *
 * @param {function} callback - A callback function that receives the current user or null.
 * @returns {function} - Unsubscribe function to stop listening.
 */
export function listenToAuthChanges(callback) {
  try {
    return onAuthStateChanged(auth, callback);
  } catch (error) {
    console.error("Auth State Listener Error:", error.code, error.message);
    throw error;
  }
}
