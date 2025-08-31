import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Fetch all calculator documents under a specific project.
 *
 * @param {string} projectId - Project ID.
 * @returns {Promise<Array<Object>>} Array of calculator objects with id and their data.
 */
export async function getAllCalculators(projectId) {
  const calculatorsSnapshot = await getDocs(
    collection(db, "projects", projectId, "calculators")
  );
  return calculatorsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Retrieve a single calculator document snapshot.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @returns {Promise<import("firebase/firestore").DocumentSnapshot>} Document snapshot.
 */
export async function getCalculatorData(projectId, calculatorId) {
  const calculatorRef = doc(
    db,
    "projects",
    projectId,
    "calculators",
    calculatorId
  );
  return getDoc(calculatorRef);
}

/**
 * Add a new calculator document to a project.
 *
 * @param {string} projectId - Project ID.
 * @param {string} name - Calculator name.
 * @param {string} type - Calculator type.
 * @returns {Promise<void>}
 */
export async function addCalculator(projectId, name, type) {
  const calculatorsCollectionRef = collection(
    doc(db, "projects", projectId),
    "calculators"
  );
  await addDoc(calculatorsCollectionRef, {
    name,
    type,
    createdAt: new Date(),
    section: [
      {
        id: crypto.randomUUID(),
        title: "Section Title",
        lines: [
          {
            id: crypto.randomUUID(),
            measurement: "",
            description: "",
            other: "",
            amount: 0,
          },
        ],
        total: 0,
      },
    ],
    grandTotal: 0,
  });
}

/**
 * Delete a calculator document.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @returns {Promise<void>}
 */
export async function deleteCalculator(projectId, calculatorId) {
  const calculatorRef = doc(
    db,
    "projects",
    projectId,
    "calculators",
    calculatorId
  );
  await deleteDoc(calculatorRef);
}

/**
 * Update calculator name.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @param {string} newName - New calculator name.
 * @returns {Promise<void>}
 */
export async function updateCalculatorName(projectId, calculatorId, newName) {
  const calculatorRef = doc(
    db,
    "projects",
    projectId,
    "calculators",
    calculatorId
  );
  const calculatorSnap = await getDoc(calculatorRef);
  if (!calculatorSnap.exists()) throw new Error("Calculator not found");

  await updateDoc(calculatorRef, { name: newName });
}

/**
 * Calculate grand total of all sections.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @returns {Promise<void>}
 */
export async function grandTotal(projectId, calculatorId) {
  const calculatorRef = doc(
    db,
    "projects",
    projectId,
    "calculators",
    calculatorId
  );
  const calculatorSnap = await getDoc(calculatorRef);
  if (!calculatorSnap.exists()) throw new Error("Calculator not found");

  const calculatorData = calculatorSnap.data();
  const existingSections = calculatorData.section || [];

  const grandTotal = existingSections.reduce((sum, section) => {
    return sum + (typeof section.total === "number" ? section.total : 0);
  }, 0);

  await updateDoc(calculatorRef, { grandTotal });
}
