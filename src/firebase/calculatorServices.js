import { addDoc, collection, doc, getDocs } from "firebase/firestore";
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

// export async function updateSectionName(projectId, calculatorName, calculatorId, sectionId, newName) {
//     try {
//         const docRef = doc(db, "projects", projectId, calculatorName, calculatorId, sectionId);
//         await setDoc(docRef, { name: newName }, { merge: true });
//     } catch (e) {
//         console.error("Error updating section name", e);
//         throw e;
//     }
// }

