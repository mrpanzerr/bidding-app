import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Fetches a list of products from the Firestore database.
 *
 * @returns A list of products from the Firestore database.
 */
export async function fetchProducts() {
  const productsCol = collection(db, "products");
  const productSnapshot = await getDocs(productsCol);
  const productList = productSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return productList;
}

/**
 * Updates the data of a product in the Firestore database.
 *
 * @param {string} productId - The ID of the product to update.
 * @param {object} data - The data to update for the product.
 */
export async function updateProductData(productId, data) {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, data);
}

/**
 * Deletes a product from the Firestore database.
 *
 * @param {string} productId - The ID of the product to delete.
 */
export async function deleteProductById(productId) {
  const productRef = doc(db, "products", productId);
  await deleteDoc(productRef);
}

/**
 * Adds a new product to the Firestore database.
 *
 * @param {object} data - The data for the new product.
 * @returns {string} The ID of the newly created product.
 */
export async function addNewProduct(id, data) {
  const productRef = doc(db, "products", id);
  await setDoc(productRef, data);
  return id;
}

/**
 * Search product by code or name
 *
 * @param {string} query - The search query.
 * @returns A list of products matching the search query.
 */
export async function searchProducts(term) {
  if (!term) return [];

  const productsCol = collection(db, "products");

  // Query for names starting with term
  const qName = query(
    productsCol,
    where("name", ">=", term),
    where("name", "<=", term + "\uf8ff")
  );

  // Query for codes starting with term
  const qCode = query(
    productsCol,
    where("code", ">=", term),
    where("code", "<=", term + "\uf8ff")
  );

  const [nameSnap, codeSnap] = await Promise.all([
    getDocs(qName),
    getDocs(qCode),
  ]);

  const results = [];
  nameSnap.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
  codeSnap.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));

  // Remove duplicates if any
  const uniqueResults = Array.from(
    new Map(results.map((p) => [p.id, p])).values()
  );

  return uniqueResults;
}
