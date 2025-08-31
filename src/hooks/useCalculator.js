import { useCallback, useEffect, useState } from "react";
import {
  addCalculator,
  deleteCalculator,
  getAllCalculators,
  getCalculatorData,
  grandTotal,
} from "../firebase/calculatorServices";
import {
  addOneLine,
  addTenLines,
  calculateMeasurement,
  deleteOneLine,
  deleteTenLines,
  updateDescriptionName,
} from "../firebase/lineServices";
import {
  addSection,
  deleteSectionById,
  sectionSum,
  updateSectionName,
} from "../firebase/sectionServices";

/**
 * Hook to manage the list of calculators for a project.
 * Handles fetching, loading state, error handling, and adding new calculators.
 *
 * @param {string} projectId - The ID of the project to load calculators for.
 * @returns {object} calculators data and manipulation functions.
 */
export function useCalculators(projectId) {
  const [calculators, setCalculators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Loads all calculators for the given project.
   * Memoized with useCallback to avoid unnecessary reloads.
   */
  const loadCalculators = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCalculators(projectId);
      setCalculators(data);
    } catch (e) {
      console.error("Error loading calculators:", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadCalculators();
  }, [loadCalculators]);

  /**
   * Adds a new calculator and reloads the list.
   *
   * @param {string} projectId
   * @param {string} name - Name of the calculator.
   * @param {string} type - Calculator type.
   */
  const addNewCalculator = async (projectId, name, type) => {
    if (!projectId || !name.trim()) return;
    try {
      await addCalculator(projectId, name, type);
      await loadCalculators();
    } catch (e) {
      console.error("Error adding calculator:", e);
      setError(e);
    }
  };

  return {
    calculators,
    loading,
    error,
    addNewCalculator,
    loadCalculators,
  };
}

/**
 * Hook to manage a single calculator's data and mutations.
 * Supports loading, error handling, optimistic UI updates, and common mutations.
 *
 * @param {string} projectId - The project ID.
 * @param {string} calculatorId - The calculator ID.
 * @param {function} [onError] - Optional error callback.
 * @returns {object} Calculator state and mutation functions.
 */
export function useCalculator(projectId, calculatorId, onError) {
  const [calculator, setCalculator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMutation, setLoadingMutation] = useState(false);
  const [error, setError] = useState(null);

  // Handles setting error state and invoking optional error callback.
  const handleError = useCallback(
    (e) => {
      setError(e);
      if (onError) onError(e);
    },
    [onError]
  );

  /**
   * Loads the calculator data.
   * Memoized to prevent unnecessary fetches.
   */
  const loadCalculator = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCalculatorData(projectId, calculatorId);
      if (data.exists()) {
        setCalculator({ id: data.id, ...data.data() });
      } else {
        console.warn("No calculator found for this ID");
        setCalculator(null);
      }
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }, [projectId, calculatorId, handleError]);

  // Fetch calculator data on mount and when dependencies change.
  useEffect(() => {
    if (!projectId || !calculatorId) return;

    let isMounted = true;
    (async () => {
      if (isMounted) await loadCalculator();
    })();

    return () => {
      isMounted = false;
    };
  }, [projectId, calculatorId, loadCalculator]);

  /**
   * Utility to perform mutations with optimistic UI update and error handling.
   *
   * @param {Function} mutateFn - Async mutation function to call.
   * @param {Function} optimisticUpdateFn - Function to update local state optimistically.
   */
  const performMutation = async (mutateFn, optimisticUpdateFn) => {
    setLoadingMutation(true);
    try {
      if (optimisticUpdateFn) {
        setCalculator((prev) => {
          if (!prev) return prev;
          const updatedSections = optimisticUpdateFn(prev.section || []);
          return { ...prev, section: updatedSections };
        });
      }
      await mutateFn();
      await loadCalculator();
    } catch (e) {
      handleError(e);
    } finally {
      setLoadingMutation(false);
    }
  };

  // Mutations with optimistic updates:

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

  const deleteCalculatorFunction = () =>
    performMutation(() => deleteCalculator(projectId, calculatorId));

  /**
   * Calculate measurement product and update line optimistically.
   *
   * @param {string} sectionId
   * @param {string} lineId
   * @param {string} measurement - Measurement string (e.g. "60 x 114").
   */
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

  /**
   * Calculate total for a section and update Firestore.
   *
   * @param {string} sectionId - ID of the section to total.
   */
  const sectionTotal = (sectionId) =>
    performMutation(() => sectionSum(projectId, calculatorId, sectionId));

  const calculateGrandTotal = () =>
    performMutation(() => grandTotal(projectId, calculatorId));

  return {
    calculator,
    loading,
    loadingMutation,
    error,
    addNewSection,
    deleteSection,
    renameSection,
    renameDescription,
    addLine,
    addTen,
    deleteOne,
    deleteTen,
    deleteCalculatorFunction,
    calcMeasurement,
    sectionTotal,
    calculateGrandTotal
  };
}
