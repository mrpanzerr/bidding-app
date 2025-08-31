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
 * Add a new section to a calculator document.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @returns {Promise<void>}
 */
export async function addSection(projectId, calculatorId) {
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

  const newSection = {
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
  };

  await updateDoc(calculatorRef, {
    section: [...existingSections, newSection],
  });
}

/**
 * Delete a section by ID.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @param {string} sectionId - Section ID.
 * @returns {Promise<void>}
 */
export async function deleteSectionById(projectId, calculatorId, sectionId) {
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

  const updatedSections = existingSections.filter(
    (section) => section.id !== sectionId
  );
  await updateDoc(calculatorRef, { section: updatedSections });
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
 * Update section name.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @param {string} sectionId - Section ID.
 * @param {string} newTitle - New section title.
 * @returns {Promise<void>}
 */
export async function updateSectionName(
  projectId,
  calculatorId,
  sectionId,
  newTitle
) {
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

  const updatedSections = existingSections.map((section) =>
    section.id === sectionId ? { ...section, title: newTitle } : section
  );

  await updateDoc(calculatorRef, { section: updatedSections });
}

/**
 * Update description of a line item.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @param {string} sectionId - Section ID.
 * @param {string} lineId - Line ID.
 * @param {string} newDescription - New description.
 * @returns {Promise<void>}
 */
export async function updateDescriptionName(
  projectId,
  calculatorId,
  sectionId,
  lineId,
  newDescription
) {
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

  const updatedSections = existingSections.map((section) => {
    if (section.id !== sectionId) return section;

    const updatedLines = (section.lines || []).map((line) =>
      line.id === lineId ? { ...line, description: newDescription ?? "" } : line
    );

    return { ...section, lines: updatedLines };
  });

  await updateDoc(calculatorRef, { section: updatedSections });
}

/**
 * Add one line.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @param {string} sectionId - Section ID.
 * @returns {Promise<void>}
 */
export async function addOneLine(projectId, calculatorId, sectionId) {
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

  const newLine = {
    id: crypto.randomUUID(),
    description: "",
    measurement: "",
    amount: 0,
  };

  const updatedSections = existingSections.map((section) =>
    section.id === sectionId
      ? { ...section, lines: [...(section.lines || []), newLine] }
      : section
  );

  await updateDoc(calculatorRef, { section: updatedSections });
}

/**
 * Add ten lines.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @param {string} sectionId - Section ID.
 * @returns {Promise<void>}
 */
export async function addTenLines(projectId, calculatorId, sectionId) {
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

  const newLines = Array.from({ length: 10 }, () => ({
    id: crypto.randomUUID(),
    description: "",
    measurement: "",
    amount: 0,
  }));

  const updatedSections = existingSections.map((section) =>
    section.id === sectionId
      ? { ...section, lines: [...(section.lines || []), ...newLines] }
      : section
  );

  await updateDoc(calculatorRef, { section: updatedSections });
}

/**
 * Delete one line.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @param {string} sectionId - Section ID.
 * @param {string} lineId - Line ID.
 * @returns {Promise<void>}
 */
export async function deleteOneLine(
  projectId,
  calculatorId,
  sectionId,
  lineId
) {
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

  const updatedSections = existingSections.map((section) =>
    section.id === sectionId
      ? {
          ...section,
          lines: (section.lines || []).filter((line) => line.id !== lineId),
        }
      : section
  );

  await updateDoc(calculatorRef, { section: updatedSections });
}

/**
 * Delete up to 10 lines from a section.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @param {string} sectionId - Section ID.
 * @returns {Promise<void>}
 */
export async function deleteTenLines(projectId, calculatorId, sectionId) {
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

  const updatedSections = existingSections.map((section) => {
    if (section.id !== sectionId) return section;
    const lines = section.lines || [];
    const updatedLines = lines.slice(0, Math.max(lines.length - 10, 0));
    return { ...section, lines: updatedLines };
  });

  await updateDoc(calculatorRef, { section: updatedSections });
}

/**
 * Calculate and update measurement for a line.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @param {string} sectionId - Section ID.
 * @param {string} lineId - Line ID.
 * @param {string} measurement - Measurement string (e.g., "5x10").
 * @returns {Promise<void>}
 */
export async function calculateMeasurement(
  projectId,
  calculatorId,
  sectionId,
  lineId,
  measurement
) {
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
  const sections = calculatorData.section || [];

  const updatedSections = sections.map((section) => {
    if (section.id !== sectionId) return section;

    const updatedLines = section.lines.map((line) => {
      if (line.id !== lineId) return line;

      const parts = measurement?.split(/x/i).map((p) => p.trim());
      const nums = parts.map((p) => parseFloat(p));
      const product = nums[0] * nums[1] || 0;

      return { ...line, amount: product, measurement };
    });

    return { ...section, lines: updatedLines };
  });

  await updateDoc(calculatorRef, { section: updatedSections });
}

/**
 * Calculate section total.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @param {string} sectionId - Section ID.
 * @returns {Promise<void>}
 */
export async function sectionSum(projectId, calculatorId, sectionId) {
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

  const updatedSections = existingSections.map((section) => {
    if (section.id !== sectionId) return section;

    const total = (section.lines || []).reduce((sum, line) => {
      return sum + (typeof line.amount === "number" ? line.amount : 0);
    }, 0);

    return { ...section, total };
  });

  await updateDoc(calculatorRef, { section: updatedSections });
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
