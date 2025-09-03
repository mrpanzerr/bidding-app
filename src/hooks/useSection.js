import {
  addSection,
  deleteSectionById,
  sectionSum,
  updateSectionName,
} from "../firebase/sectionServices";

/**
 * Hook for managing sections within a calculator.
 * Provides functions to add, delete, rename sections, and calculate section totals.
 *
 * @param {string} projectId - ID of the project the calculator belongs to
 * @param {string} calculatorId - ID of the calculator
 * @param {function} performMutation - Wrapper for async mutations with optimistic UI updates and error handling
 *
 * @returns {object} Section management API:
 *   - `addNewSection()`: adds a new section
 *   - `deleteSection(sectionId)`: deletes a section by ID
 *   - `renameSection(sectionId, newTitle)`: updates a section's name
 *   - `sectionTotal(sectionId)`: calculates the total value of a section
 */
export function useSection(projectId, calculatorId, performMutation) {
  const addNewSection = () =>
    performMutation(() => addSection(projectId, calculatorId));

  const deleteSection = (sectionId) =>
    performMutation(() =>
      deleteSectionById(projectId, calculatorId, sectionId)
    );

  const renameSection = (sectionId, newTitle) =>
    performMutation(() =>
      updateSectionName(projectId, calculatorId, sectionId, newTitle)
    );

  const sectionTotal = (sectionId) =>
    performMutation(() => sectionSum(projectId, calculatorId, sectionId));

  return {
    addNewSection,
    deleteSection,
    renameSection,
    sectionTotal,
  };
}
