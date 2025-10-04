import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Create a new section item.
 *
 * @param {string} calcType - Calculator type.
 * @returns {Object} - New section item.
 */
function createNewSection(calcType) {
  const sectionDefault = {
    id: crypto.randomUUID(),
    title: "Section Title",
    total: 0,
  };

  switch (calcType) {
    case "MeasurementCalculator":
      return {
        ...sectionDefault,
        lines: [
          {
            id: crypto.randomUUID(),
            measurement: "",
            description: "",
            amount: 0,
          },
        ],
      };
    case "ThreeFieldCalculator":
      return {
        ...sectionDefault,
        lines: [
          {
            id: crypto.randomUUID(),
            description: "",
            pricePerUnit: 0,
            squarefoot: 0,
            amount: 0,
          },
        ],
      };
    case "SevenFieldCalculator":
      return {
        ...sectionDefault,
        lines: [
          {
            id: crypto.randomUUID(),
            quantity: 0,
            productCode: "",
            price: 0,
            description: "",
            description2: "",
            description3: "",
            amount: 0,
          },
        ],
      };
    default:
      throw new Error(`Unsupported calculator type: ${calcType}`);
  }
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

  const newSection = createNewSection(calculatorData.type);

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
