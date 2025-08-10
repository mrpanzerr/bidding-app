import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

/**
 * Signs up a new user with email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user account.
 * @returns {Promise<UserCredential>} - A promise that resolves with the user credential information.
 */
export function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

/**
 * Signs in an existing user with email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user account.
 * @returns {Promise<UserCredential>} - A promise that resolves with the user credential information.
 */
export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Signs out the current user.
 *
 * @returns {Promise<void>} - A promise that resolves when the user is signed out.
 */
export function logout() {
  return signOut(auth);
}

/**
 * Listens for changes to the user's authentication state.
 *
 * @param {function} callback - A callback function that receives the current user or null.
 */
export function listenToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}