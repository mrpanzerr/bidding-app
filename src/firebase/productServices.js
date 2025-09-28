import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
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
 * @param {string} productId - The ID of the product to update.
 * @param {object} data - The data to update for the product.
 */
export async function updateProductData(productId, data) {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, data);
}

/**
 * Deletes a product from the Firestore database.
 * @param {string} productId - The ID of the product to delete.
 */
export async function deleteProductById(productId) {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
}

/**
 * Adds a new product to the Firestore database.
 * @param {object} data - The data for the new product.
 * @returns {string} The ID of the newly created product.
 */
export async function addNewProduct(data) {
  const productsCol = collection(db, "products");
  const docRef = await addDoc(productsCol, data);
  return docRef.id;
}