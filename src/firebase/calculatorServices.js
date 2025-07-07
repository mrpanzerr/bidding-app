import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Generic function to fetch a calculator document  ← Description of what the function does
 * 
 * @param {string} projectId - The ID of the parent project
 * @param {string} calculatorId - The ID of the calculator document
 * 
 * @returns {Promise<DocumentSnapshot>} - The fetched document snapshot
 * @throws Will throw an error if the document cannot be retrieved
 */
export async function getAllCalculators(projectId) {
    const calculatorsRef = await getDocs(collection(db, "projects", projectId, "calculators"));
    return calculatorsRef.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function getCalculator(projectId, calculatorId) {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    const calculatorSnap = await getDoc(calculatorRef);
    if (!calculatorSnap.exists()) {
        throw new Error("Calculator not found");
    }
    return {
        id: calculatorSnap.id,
        ...calculatorSnap.data(),
    };
}

export async function addCalculator(projectId, calculatorType, name) {
    try {
        const calculatorRef = collection(doc(db, "projects", projectId), "calculators");

        await addDoc(calculatorRef, {
            type: calculatorType,
            name: name,
            createdAt: new Date(),
        });
    } catch (e) {
        console.error("Error adding calculator", e);
        throw e;
    }
}