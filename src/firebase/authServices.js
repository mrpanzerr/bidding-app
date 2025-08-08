import { createUserWithEmailAndPassword } from "firebase/auth";
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
