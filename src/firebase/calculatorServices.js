import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Generic function to fetch a calculator document  ← Description of what the function does
 * 
 * @param {string} projectId - The ID of the parent project
 * @param {string} calculatorCollection - The subcollection name (e.g., "sqftCalculators")
 * @param {string} calculatorId - The ID of the calculator document
 * 
 * @returns {Promise<DocumentSnapshot>} - The fetched document snapshot
 */
export async function fetchCalculatorData(projectId, calculatorName, calculatorId) {
    try {
        const docRef = doc(db, "projects", projectId, calculatorName, calculatorId);
        const docSnap = await getDoc(docRef);

        return docSnap;
    } catch (e) {
        console.error("Error fetching sqft calculator data", e);
        throw e;
    }
}

