// Import Firestore functions to work with your database:
// - collection: get reference to a collection
// - doc: get reference to a document
// - getDoc: get data from a single document
// - getDocs: get all documents in a collection
import { doc, getDoc } from "firebase/firestore";

// Import your Firestore database instance from your firebase config file
import { db } from "./firebase";

/**
 * Fetches data from a specific document in the 'titlePageData' collection.
 *
 * Since the collection only contains a single known document, it is accessed directly by ID.
 *
 * @returns {Promise<{ id: string, [key: string]: any }>} An object containing the document ID and its data fields.
 * @throws Will throw an error if the document doesn't exist or if fetching fails.
 */
export async function fetchTitlePageData() {
  try {
    // Since the titlePage collection has only one document, we can directly access it by its id.
    const docId = 'FdZnfElCBWh1hMd9uPEO'; // Replace with your actual document ID
    if (!docId) {
      throw new Error("Document ID is required to fetch title page data");
    }
    // Get a reference to the document using its ID
    // and fetch the document data
    const docRef = doc(db, "titlePageData", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Document does not exist");
    }
  } catch (error) {
    console.error("Error fetching title page data:", error);
    throw error;
  }
}
