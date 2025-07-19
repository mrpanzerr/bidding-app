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
 * Fetches all calculator documents under a specific project.
 * 
 * @param {string} projectId - The ID of the project whose calculators to retrieve.
 * @returns {Promise<Array<Object>>} Array of calculator objects with `id` and their data.
 * @throws Throws error if Firestore query fails.
 */
export async function getAllCalculators(projectId) {
  // Reference to calculators subcollection of the project
  const calculatorsSnapshot = await getDocs(
    collection(db, "projects", projectId, "calculators")
  );

  // Map each document snapshot to an object with id and data fields
  return calculatorsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Retrieves a single calculator document snapshot.
 * 
 * @param {string} projectId - The ID of the parent project.
 * @param {string} calculatorId - The ID of the calculator document.
 * @returns {Promise<DocumentSnapshot>} Firestore document snapshot.
 * @throws Throws error if fetching the document fails.
 */
export async function getCalculatorData(projectId, calculatorId) {
  try {
    // Reference to specific calculator document
    const calculatorRef = doc(
      db,
      "projects",
      projectId,
      "calculators",
      calculatorId
    );

    // Fetch the document snapshot
    const calculatorSnap = await getDoc(calculatorRef);
    return calculatorSnap;
  } catch (error) {
    console.error("Error fetching calculator data:", error);
    throw error;
  }
}

/**
 * Adds a new calculator document to a project.
 * 
 * @param {string} projectId - The ID of the parent project.
 * @param {string} name - The name of the new calculator.
 * @returns {Promise<void>}
 * @throws Throws error if adding document fails.
 */
export async function addCalculator(projectId, name, type) {
  try {
    const calculatorsCollectionRef = collection(
      doc(db, "projects", projectId),
      "calculators"
    );

    // Add new calculator document with initial data
    await addDoc(calculatorsCollectionRef, {
      name,
      type: type,
      createdAt: new Date(),
      section: [
        {
          id: crypto.randomUUID(),
          title: "Section Title",
          lines: [
            {
              id: crypto.randomUUID(), // generate pseudo-unique id for line
              measurement: "ex 60 x 114",
              description: "description",
              other: "other",
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
 * Deletes a calculator document.
 * 
 * @param {string} projectId - The ID of the parent project.
 * @param {string} calculatorId - The ID of the calculator document to delete.
 * @returns {Promise<void>}
 * @throws Throws error if deleting document fails.
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
 * Adds a new section to a calculator document.
 * 
 * @param {string} projectId - The ID of the parent project.
 * @param {string} calculatorId - The calculator document ID.
 * @returns {Promise<void>}
 * @throws Throws error if update fails or calculator not found.
 */
export async function addSection(projectId, calculatorId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    const calculatorSnap = await getDoc(calculatorRef);

    if (!calculatorSnap.exists()) {
      throw new Error("Calculator not found");
    }

    const calculatorData = calculatorSnap.data();
    const existingSections = calculatorData.section || [];

    const newSection = {
      id: crypto.randomUUID(),
      title: "Section Title",
      lines: [
        {
          id: crypto.randomUUID(),
          measurement: "ex 60 x 114",
          description: "description",
          other: "other",
          amount: 0,
        },
      ],
      total: 0,
    };

    // Update sections array by appending new section
    await updateDoc(calculatorRef, {
      section: [...existingSections, newSection],
    });
  } catch (error) {
    console.error("Error adding section:", error);
    throw error;
  }
}

/**
 * Deletes a section from a calculator document by ID.
 * 
 * @param {string} projectId - The ID of the parent project.
 * @param {string} calculatorId - The calculator document ID.
 * @param {number} sectionId - The ID of the section to delete.
 * @returns {Promise<void>}
 * @throws Throws error if update fails or calculator not found.
 */
export async function deleteSectionById(projectId, calculatorId, sectionId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    const calculatorSnap = await getDoc(calculatorRef);

    if (!calculatorSnap.exists()) {
      throw new Error("Calculator not found");
    }

    const calculatorData = calculatorSnap.data();
    const existingSections = calculatorData.section || [];

    // Remove section matching the given ID
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
 * Updates the title of a section within a calculator document.
 * 
 * @param {string} projectId - The ID of the parent project.
 * @param {string} calculatorId - The calculator document ID.
 * @param {number} sectionId - The section ID to update.
 * @param {string} newTitle - The new title for the section.
 * @returns {Promise<void>}
 * @throws Throws error if update fails or calculator not found.
 */
export async function updateSectionName(projectId, calculatorId, sectionId, newTitle) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    const calculatorSnap = await getDoc(calculatorRef);

    if (!calculatorSnap.exists()) {
      throw new Error("Calculator not found");
    }

    const calculatorData = calculatorSnap.data();
    const existingSections = calculatorData.section || [];

    // Update matching section's title
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
 * Updates the description of a line item within a section.
 * 
 * @param {string} projectId - The ID of the parent project.
 * @param {string} calculatorId - The calculator document ID.
 * @param {number} sectionId - The section containing the line.
 * @param {number} lineId - The line ID to update.
 * @param {string} newDescription - The new description text.
 * @returns {Promise<void>}
 * @throws Throws error if update fails or calculator not found.
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

    if (!calculatorSnap.exists()) {
      throw new Error("Calculator not found");
    }

    const calculatorData = calculatorSnap.data();
    const existingSections = calculatorData.section || [];

    // Update line description within the matching section and line
    const updatedSections = existingSections.map((section) => {
      if (section.id !== sectionId) return section;

      const updatedLines = (section.lines || []).map((line) =>
        line.id === lineId ? { ...line, description: newDescription ?? "" } : line
      );

      return {
        ...section,
        lines: updatedLines,
      };
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
 * Adds a single line item to a section.
 * 
 * @param {string} projectId - The ID of the parent project.
 * @param {string} calculatorId - The calculator document ID.
 * @param {number} sectionId - The section ID to add the line to.
 * @returns {Promise<void>}
 * @throws Throws error if update fails or calculator not found.
 */
export async function addOneLine(projectId, calculatorId, sectionId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    const calculatorSnap = await getDoc(calculatorRef);

    if (!calculatorSnap.exists()) {
      throw new Error("Calculator not found");
    }

    const calculatorData = calculatorSnap.data();
    const existingSections = calculatorData.section || [];

    // Create new line item with pseudo-unique id
    const newLine = {
      id: crypto.randomUUID(),
      description: "description",
      measurement: "ex 60 x 114",
      amount: 0,
    };

    const updatedSections = existingSections.map((section) => {
      if (section.id !== sectionId) return section;

      return {
        ...section,
        lines: [...(section.lines || []), newLine],
      };
    });

    await updateDoc(calculatorRef, {
      section: updatedSections,
    });
  } catch (error) {
    console.error("Error adding one line:", error);
    throw error;
  }
}

/**
 * Adds ten new line items to a section.
 * 
 * @param {string} projectId - The ID of the parent project.
 * @param {string} calculatorId - The calculator document ID.
 * @param {number} sectionId - The section ID to add lines to.
 * @returns {Promise<void>}
 * @throws Throws error if update fails or calculator not found.
 */
export async function addTenLines(projectId, calculatorId, sectionId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    const calculatorSnap = await getDoc(calculatorRef);

    if (!calculatorSnap.exists()) {
      throw new Error("Calculator not found");
    }

    const calculatorData = calculatorSnap.data();
    const existingSections = calculatorData.section || [];

    // Create array of 10 new line items
    const newLines = Array.from({ length: 10 }, () => ({
      id: crypto.randomUUID(),
      description: "description",
      measurement: "ex 60 x 114",
      amount: 0,
    }));

    const updatedSections = existingSections.map((section) => {
      if (section.id !== sectionId) return section;

      return {
        ...section,
        lines: [...(section.lines || []), ...newLines],
      };
    });

    await updateDoc(calculatorRef, {
      section: updatedSections,
    });
  } catch (error) {
    console.error("Error adding ten lines:", error);
    throw error;
  }
}

/**
 * Deletes a single line item from a section.
 * 
 * @param {string} projectId - The ID of the parent project.
 * @param {string} calculatorId - The calculator document ID.
 * @param {number} sectionId - The section ID containing the line.
 * @param {number} lineId - The line ID to delete.
 * @returns {Promise<void>}
 * @throws Throws error if update fails or calculator not found.
 */
export async function deleteOneLine(projectId, calculatorId, sectionId, lineId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    const calculatorSnap = await getDoc(calculatorRef);

    if (!calculatorSnap.exists()) {
      throw new Error("Calculator not found");
    }

    const calculatorData = calculatorSnap.data();
    const existingSections = calculatorData.section || [];

    const updatedSections = existingSections.map((section) => {
      if (section.id !== sectionId) return section;

      return {
        ...section,
        lines: (section.lines || []).filter((line) => line.id !== lineId),
      };
    });

    await updateDoc(calculatorRef, {
      section: updatedSections,
    });
  } catch (error) {
    console.error("Error deleting one line:", error);
    throw error;
  }
}

/**
 * Deletes up to ten lines from the end of a section.
 * 
 * @param {string} projectId - The ID of the parent project.
 * @param {string} calculatorId - The calculator document ID.
 * @param {number} sectionId - The section ID to delete lines from.
 * @returns {Promise<void>}
 * @throws Throws error if update fails or calculator not found.
 */
export async function deleteTenLines(projectId, calculatorId, sectionId) {
  try {
    const calculatorRef = doc(db, "projects", projectId, "calculators", calculatorId);
    const calculatorSnap = await getDoc(calculatorRef);

    if (!calculatorSnap.exists()) {
      throw new Error("Calculator not found");
    }

    const calculatorData = calculatorSnap.data();
    const existingSections = calculatorData.section || [];

    const updatedSections = existingSections.map((section) => {
      if (section.id !== sectionId) return section;

      const lines = section.lines || [];

      // Remove last 10 lines, or all if fewer than 10
      const updatedLines = lines.slice(0, Math.max(lines.length - 10, 0));

      return {
        ...section,
        lines: updatedLines,
      };
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
 * Calculates the amount for a line based on measurement string.
 * Format assumed: "number x number" (e.g., "60 x 114").
 * Updates the amount field with the product.
 * 
 * @param {string} projectId - The ID of the parent project.
 * @param {string} calculatorId - The calculator document ID.
 * @param {number} sectionId - The section ID containing the line.
 * @param {number} lineId - The line ID to update.
 * @param {string} measurement - Measurement string to parse.
 * @returns {Promise<void>}
 * @throws Throws error if update fails or calculator not found.
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

    // Parse measurement string and calculate amount
    const updatedSections = sections.map((section) => {
      if (section.id !== sectionId) return section;

      const updatedLines = section.lines.map((line) => {
        if (line.id !== lineId) return line;

        // Split by 'x' or 'X' and parse floats
        const parts = measurement?.split(/x/i).map((p) => p.trim());
        const nums = parts.map((p) => parseFloat(p));
        const product = nums[0] * nums[1] || 0;

        return {
          ...line,
          amount: product,
          measurement, // Update measurement string as well
        };
      });

      return {
        ...section,
        lines: updatedLines,
      };
    });

    await updateDoc(calculatorRef, {
      section: updatedSections,
    });
  } catch (error) {
    console.error("Error calculating measurement:", error);
    throw error;
  }
}
