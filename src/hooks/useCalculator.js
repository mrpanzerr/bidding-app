import { useCallback, useEffect, useState } from "react";
import {
  addCalculator,
  addMyCalculator,
  deleteCalculator,
  fetchMyCalculators,
  getAllCalculators,
  getCalculatorData,
  grandTotal,
  projectTotal,
} from "../firebase/calculatorServices";
import { auth } from "../firebase/firebase";

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
      const user = auth.currentUser;
      const data = user
        ? await fetchMyCalculators(projectId)
        : await getAllCalculators(projectId);
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
      const user = auth.currentUser;
      user
        ? await addMyCalculator(projectId, name, type)
        : await addCalculator(projectId, name, type);
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
 * Hook for managing a single calculator instance.
 * Supports loading, error handling, mutations, and optimistic UI updates.
 *
 * @param {string} projectId - Project ID
 * @param {string} calculatorId - Calculator ID
 * @param {function} [onError] - Optional callback for handling errors
 * @returns {object}
 *   - `calculator`: current calculator data
 *   - `setCalculator`: setter for calculator state
 *   - `performMutation`: function to perform optimistic mutations
 *   - `loading`: boolean for data fetch state
 *   - `loadingMutation`: boolean for mutation state
 *   - `error`: any error encountered
 *   - `deleteCalculatorFunction`: function to delete this calculator
 *   - `calculateGrandTotal`: function to calculate the calculator’s total
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

  const deleteCalculatorFunction = () =>
    performMutation(() => deleteCalculator(projectId, calculatorId));

  const calculateGrandTotal = () =>
    performMutation(() => grandTotal(projectId, calculatorId));

  const calculateProjectTotal = () =>
    performMutation(() => projectTotal(projectId));

  return {
    calculator,
    setCalculator,
    performMutation,
    loading,
    loadingMutation,
    error,
    deleteCalculatorFunction,
    calculateGrandTotal,
    calculateProjectTotal,
  };
}
