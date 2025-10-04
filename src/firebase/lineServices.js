import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Update description of a line item.
 *
 * @param {string} projectId - Project ID.
 * @param {string} calculatorId - Calculator ID.
 * @param {string} sectionId - Section ID.
 * @param {string} lineId - Line ID.
 * @param {string} value - New value.
 * @returns {Promise<void>}
 */
export async function updateLineField(
  projectId,
  calculatorId,
  sectionId,
  lineId,
  field,
  value
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
      line.id === lineId ? { ...line, [field]: value } : line
    );

    return { ...section, lines: updatedLines };
  });

  await updateDoc(calculatorRef, { section: updatedSections });
}

/**
 * Create a new line item.
 *
 * @param {string} calcType - Calculator type.
 * @returns {Object} - New line item.
 */
function createNewLine(calcType) {
  switch (calcType) {
    case "MeasurementCalculator":
      return {
        id: crypto.randomUUID(),
        description: "",
        measurement: "",
        amount: 0,
      };
    case "ThreeFieldCalculator":
      return {
        id: crypto.randomUUID(),
        description: "",
        pricePerUnit: 0,
        squarefoot: 0,
        amount: 0,
      };
    case "SevenFieldCalculator":
      return {
        id: crypto.randomUUID(),
        quantity: 0,
        productCode: "",
        price: 0,
        description: "",
        description2: "",
        description3: "",
        amount: 0,
      };
    default:
      throw new Error(`Unsupported calculator type: ${calcType}`);
  }
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

  const newLine = createNewLine(calculatorData.type);

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

  const newLines = Array.from({ length: 10 }, () =>
    createNewLine(calculatorData.type)
  );

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
 * Check if a product code exists in the database and return its info.
 *
 * @param {string} code - Product code to check.
 * @returns {Promise<{price: number, name?: string} | null>}
 */
export async function checkProductCode(code) {
  const docRef = doc(db, "products", code);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data(); // e.g., { price: 12.5, name: "concrete" }
  }

  return null; // not found
}
