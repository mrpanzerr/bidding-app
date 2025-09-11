import { useCalculator } from "./useCalculator";
import { useLine } from "./useLine";
import { useSection } from "./useSection";

/**
 * Custom hook for managing a Seven Field Calculator.
 *
 * Combines `useCalculator`, `useSection`, and `useLine` hooks
 * to provide a unified API for managing sections, lines, measurements,
 * and overall calculations for a specific calculator instance.
 *
 * @param {string} projectId - ID of the project the calculator belongs
 * @param {string} calculatorId - ID of the calculator
 *
 * @returns {Object} An object containing:
 *   - `calculator`: current calculator data
 *   - `loading`: boolean indicating if the calculator is loading
 *   - `error`: any error encountered during fetch or mutations
 *   - Section management methods: `addNewSection`, `deleteSection`, `renameSection`
 *   - Line management methods: `renameDescription`, `addLine`, `addTen`, `deleteOne`, `deleteTen`
 *   - Calculator-level methods: `deleteCalculatorFunction`, `calcMeasurement`, `sectionTotal`, `calculateGrandTotal`
 */
export function useSevenFieldCalculator(projectId, calculatorId) {
  const calc = useCalculator(projectId, calculatorId);
  const section = useSection(projectId, calculatorId, calc.performMutation);
  const line = useLine(projectId, calculatorId, calc.performMutation);

  return {
    calculator: calc.calculator,
    loading: calc.loading,
    error: calc.error,
    addNewSection: section.addNewSection,
    deleteSection: section.deleteSection,
    renameSection: section.renameSection,
    updateField: line.updateField,
    addLine: line.addLine,
    addTen: line.addTen,
    deleteOne: line.deleteOne,
    deleteTen: line.deleteTen,
    deleteCalculatorFunction: calc.deleteCalculatorFunction,
    sectionTotal: section.sectionTotal,
    calculateGrandTotal: calc.calculateGrandTotal,
  };
}
