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
 * @param {string} projectId - The ID of the project whose calculators to retrieve.
 * @returns {Promise<Array<Object>>} Array of calculator objects with `id` and their data.
 * @throws Throws if Firestore query fails.
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
 * @param {string} projectId - The parent project ID.
 * @param {string} calculatorId - The calculator document ID.
 * @returns {Promise<import("firebase/firestore").DocumentSnapshot>} Document snapshot.
 * @throws Throws if fetching the document fails.
 */
export async function getCalculatorData(projectId, calculatorId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    return await getDoc(calculatorRef);
  } catch (error) {
    console.error("Error fetching calculator data:", error);
    throw error;
  }
}

/**
 * Add a new calculator document to a project.
 * 
 * @param {string} projectId - The parent project ID.
 * @param {string} name - Name of the new calculator.
 * @param {string} type - Type of the new calculator.
 * @returns {Promise<void>}
 * @throws Throws if adding document fails.
 */
export async function addCalculator(projectId, name, type) {
  try {
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
  } catch (error) {
    console.error("Error adding calculator:", error);
    throw error;
  }
}

/**
 * Delete a calculator document.
 * 
 * @param {string} projectId - The parent project ID.
 * @param {string} calculatorId - The calculator document ID.
 * @returns {Promise<void>}
 * @throws Throws if deleting document fails.
 */
export async function deleteCalculator(projectId, calculatorId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    await deleteDoc(calculatorRef);
  } catch (error) {
    console.error("Error deleting calculator:", error);
    throw error;
  }
}

/**
 * Add a new section to a calculator document.
 * 
 * @param {string} projectId - The parent project ID.
 * @param {string} calculatorId - The calculator document ID.
 * @returns {Promise<void>}
 * @throws Throws if update fails or calculator not found.
 */
export async function addSection(projectId, calculatorId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
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
  } catch (error) {
    console.error("Error adding section:", error);
    throw error;
  }
}

/**
 * Delete a section from a calculator document by ID.
 * 
 * @param {string} projectId - The parent project ID.
 * @param {string} calculatorId - The calculator document ID.
 * @param {string} sectionId - The section ID to delete.
 * @returns {Promise<void>}
 * @throws Throws if update fails or calculator not found.
 */
export async function deleteSectionById(projectId, calculatorId, sectionId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    const calculatorSnap = await getDoc(calculatorRef);

    if (!calculatorSnap.exists()) throw new Error("Calculator not found");

    const calculatorData = calculatorSnap.data();
    const existingSections = calculatorData.section || [];

    const updatedSections = existingSections.filter(
      (section) => section.id !== sectionId
    );

    await updateDoc(calculatorRef, {
      section: updatedSections,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    throw error;
  }
}

/**
 * Update the title of a section.
 * 
 * @param {string} projectId - The parent project ID.
 * @param {string} calculatorId - The calculator document ID.
 * @param {string} sectionId - The section ID to update.
 * @param {string} newTitle - The new title for the section.
 * @returns {Promise<void>}
 * @throws Throws if update fails or calculator not found.
 */
export async function updateSectionName(projectId, calculatorId, sectionId, newTitle) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    const calculatorSnap = await getDoc(calculatorRef);

    if (!calculatorSnap.exists()) throw new Error("Calculator not found");

    const calculatorData = calculatorSnap.data();
    const existingSections = calculatorData.section || [];

    const updatedSections = existingSections.map((section) =>
      section.id === sectionId ? { ...section, title: newTitle } : section
    );

    await updateDoc(calculatorRef, {
      section: updatedSections,
    });
  } catch (error) {
    console.error("Error updating section name:", error);
    throw error;
  }
}

/**
 * Update the description of a line item within a section.
 * 
 * @param {string} projectId - The parent project ID.
 * @param {string} calculatorId - The calculator document ID.
 * @param {string} sectionId - The section containing the line.
 * @param {string} lineId - The line ID to update.
 * @param {string} newDescription - The new description text.
 * @returns {Promise<void>}
 * @throws Throws if update fails or calculator not found.
 */
export async function updateDescriptionName(
  projectId,
  calculatorId,
  sectionId,
  lineId,
  newDescription
) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
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

    await updateDoc(calculatorRef, {
      section: updatedSections,
    });
  } catch (error) {
    console.error("Error updating description:", error);
    throw error;
  }
}

/**
 * Add a single line item to a section.
 * 
 * @param {string} projectId - The parent project ID.
 * @param {string} calculatorId - The calculator document ID.
 * @param {string} sectionId - The section ID to add the line to.
 * @returns {Promise<void>}
 * @throws Throws if update fails or calculator not found.
 */
export async function addOneLine(projectId, calculatorId, sectionId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
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

    await updateDoc(calculatorRef, {
      section: updatedSections,
    });
  } catch (error) {
    console.error("Error adding one line:", error);
    throw error;
  }
}

/**
 * Add ten new line items to a section.
 * 
 * @param {string} projectId - The parent project ID.
 * @param {string} calculatorId - The calculator document ID.
 * @param {string} sectionId - The section ID to add lines to.
 * @returns {Promise<void>}
 * @throws Throws if update fails or calculator not found.
 */
export async function addTenLines(projectId, calculatorId, sectionId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
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

    await updateDoc(calculatorRef, {
      section: updatedSections,
    });
  } catch (error) {
    console.error("Error adding ten lines:", error);
    throw error;
  }
}

/**
 * Delete a single line item from a section.
 * 
 * @param {string} projectId - The parent project ID.
 * @param {string} calculatorId - The calculator document ID.
 * @param {string} sectionId - The section ID containing the line.
 * @param {string} lineId - The line ID to delete.
 * @returns {Promise<void>}
 * @throws Throws if update fails or calculator not found.
 */
export async function deleteOneLine(projectId, calculatorId, sectionId, lineId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    const calculatorSnap = await getDoc(calculatorRef);

    if (!calculatorSnap.exists()) throw new Error("Calculator not found");

    const calculatorData = calculatorSnap.data();
    const existingSections = calculatorData.section || [];

    const updatedSections = existingSections.map((section) =>
      section.id === sectionId
        ? { ...section, lines: (section.lines || []).filter((line) => line.id !== lineId) }
        : section
    );

    await updateDoc(calculatorRef, {
      section: updatedSections,
    });
  } catch (error) {
    console.error("Error deleting one line:", error);
    throw error;
  }
}

/**
 * Delete up to ten lines from the end of a section.
 * 
 * @param {string} projectId - The parent project ID.
 * @param {string} calculatorId - The calculator document ID.
 * @param {string} sectionId - The section ID to delete lines from.
 * @returns {Promise<void>}
 * @throws Throws if update fails or calculator not found.
 */
export async function deleteTenLines(projectId, calculatorId, sectionId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
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

    await updateDoc(calculatorRef, {
      section: updatedSections,
    });
  } catch (error) {
    console.error("Error deleting ten lines:", error);
    throw error;
  }
}

/**
 * Calculate and update the amount for a line based on measurement string.
 * Expects measurement in the format "number x number" (e.g., "60 x 114").
 * 
 * @param {string} projectId - The parent project ID.
 * @param {string} calculatorId - The calculator document ID.
 * @param {string} sectionId - The section ID containing the line.
 * @param {string} lineId - The line ID to update.
 * @param {string} measurement - Measurement string to parse and calculate.
 * @returns {Promise<void>}
 * @throws Throws if update fails or calculator not found.
 */
export async function calculateMeasurement(
  projectId,
  calculatorId,
  sectionId,
  lineId,
  measurement
) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    const calculatorSnap = await getDoc(calculatorRef);

    if (!calculatorSnap.exists()) {
      console.error("Calculator not found");
      return;
    }

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

    await updateDoc(calculatorRef, {
      section: updatedSections,
    });
  } catch (error) {
    console.error("Error calculating measurement:", error);
    throw error;
  }
}
