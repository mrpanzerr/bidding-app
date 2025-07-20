import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Fetches the single document from the 'titlePageData' collection.
 * 
 * Assumes only one known document exists, accessed directly by its fixed ID.
 *
 * @returns {Promise<{ id: string, [key: string]: any }>} The document ID and its data.
 * @throws Throws if the document does not exist or on fetch errors.
 */
export async function fetchTitlePageData() {
  try {
    const docId = 'FdZnfElCBWh1hMd9uPEO'; // Use your actual doc ID here

    if (!docId) {
      throw new Error("Document ID is required to fetch title page data");
    }

    const docRef = doc(db, "titlePageData", docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Title page document does not exist");
    }

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error fetching title page data:", error);
    throw error;
  }
}
