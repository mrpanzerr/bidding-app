import {
  addOneLine,
  addTenLines,
  calculateMeasurement,
  deleteOneLine,
  deleteTenLines,
  updateDescriptionName,
} from "../firebase/lineServices";

/**
 * Hook for managing lines within a calculator section.
 * Provides functions to add, delete, rename lines, and calculate measurements.
 *
 * @param {string} projectId - ID of the project the calculator belongs to
 * @param {string} calculatorId - ID of the calculator
 * @param {function} performMutation - Wrapper for async mutations with optimistic UI updates and error handling
 *
 * @returns {object} Line management API:
 *   - `addLine(sectionId)`: adds a single line to a section
 *   - `addTen(sectionId)`: adds ten lines to a section
 *   - `deleteOne(sectionId, lineId)`: deletes a single line from a section
 *   - `deleteTen(sectionId)`: deletes ten lines from a section
 *   - `renameDescription(sectionId, lineId, newDescription)`: updates a line’s description
 *   - `calcMeasurement(sectionId, lineId, measurement)`: calculates and updates a line’s measurement
 */
export function useLine(projectId, calculatorId, performMutation) {
  const addLine = (sectionId) =>
    performMutation(() => addOneLine(projectId, calculatorId, sectionId));

  const addTen = (sectionId) =>
    performMutation(() => addTenLines(projectId, calculatorId, sectionId));

  const deleteOne = (sectionId, lineId) =>
    performMutation(() =>
      deleteOneLine(projectId, calculatorId, sectionId, lineId)
    );

  const deleteTen = (sectionId) =>
    performMutation(() => deleteTenLines(projectId, calculatorId, sectionId));

  const renameDescription = (sectionId, lineId, newDescription) =>
    performMutation(() =>
      updateDescriptionName(
        projectId,
        calculatorId,
        sectionId,
        lineId,
        newDescription
      )
    );

  const calcMeasurement = (sectionId, lineId, measurement) =>
    performMutation(() =>
      calculateMeasurement(
        projectId,
        calculatorId,
        sectionId,
        lineId,
        measurement
      )
    );

  return {
    addLine,
    addTen,
    deleteOne,
    deleteTen,
    renameDescription,
    calcMeasurement,
  };
}
