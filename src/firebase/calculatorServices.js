import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { auth, db } from "./firebase";

const calculatorTemplates = {
  MeasurementCalculator: {
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
  },
  TwoFieldCalculator: {
    section: [
      {
        id: crypto.randomUUID(),
        title: "Section Title",
        lines: [
          {
            id: crypto.randomUUID(),
            description: "",
            amount: 0,
          },
        ],
        total: 0,
      },
    ],
    grandTotal: 0,
  },
};

/* =======================
   GENERAL CALCULATOR FUNCTIONS 
   ======================= */

/**
 * Fetch all guest calculator documents under a specific project.
 *
 * @param {string} projectId - Project ID.
 * @returns {Promise<Array>} Array of calculator objects.
 */
export async function getAllCalculators(projectId) {
  // Query Calculators where userId does not exist
  const q = query(
    collection(db, "projects", projectId, "calculators"),
    where("userId", "==", null)
  );
  const calculatorsSnapshot = await getDocs(q);

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
 * Add a new calculator document to a project (guest).
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

  const template = calculatorTemplates[type];

  await addDoc(calculatorsCollectionRef, {
    name,
    type,
    userId: null,
    createdAt: new Date(),
    ...template,
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

/* =======================
   USER-SPECIFIC CALCULATOR FUNCTIONS
   ======================= */

/**
 * Fetch all calculators owned by the current user
 * 
 * @param {string} projectId - Project ID.
 * @returns {Promise<Array>} Array of calculator objects.
 */
export async function fetchMyCalculators(projectId) {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");
  
  const q = query(
    collection(db, "projects", projectId, "calculators"),
    where("userId", "==", user.uid)
  );
  const calculatorsSnapshot = await getDocs(q);
  return calculatorsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Add a new calculator owned by the current user.
 *
 * @param {string} projectId - Project ID.
 * @param {string} name - Calculator name.
 * @returns {Promise<void>}
 */
export async function addMyCalculator(projectId, name, type) {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  const template = calculatorTemplates[type]?.() || {};

  const calculatorsCollectionRef = collection(
    doc(db, "projects", projectId),
    "calculators"
  );
  await addDoc(calculatorsCollectionRef, {
    name,
    type,
    createdAt: new Date(),
    userId: user.uid,
    ...template,
  });
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
