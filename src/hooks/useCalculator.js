import { useCallback, useEffect, useState } from "react";

import {
  addCalculator,
  addOneLine,
  addSection,
  addTenLines,
  calculateMeasurement,
  deleteCalculator,
  deleteOneLine,
  deleteSectionById,
  deleteTenLines,
  getAllCalculators,
  getCalculatorData,
  updateDescriptionName,
  updateSectionName,
} from "../firebase/calculatorServices";

/**
 * Custom hook to manage the list of calculators for a project.
 * Handles loading state, error state, and data fetching.
 * Provides methods to add new calculators.
 *
 * @param {string} projectId - The project ID to fetch calculators for.
 * @returns {object} - calculators array, loading/error states, and methods.
 */
export function useCalculators(projectId) {
  const [calculators, setCalculators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches all calculators for the project.
   * Uses useCallback to memoize and avoid unnecessary reloads.
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

  // Load calculators on mount or when projectId changes
  useEffect(() => {
    loadCalculators();
  }, [loadCalculators]);

  /**
   * Adds a new calculator to the project.
   * After adding, reloads the calculators list.
   *
   * @param {string} projectId - Project ID.
   * @param {string} name - Name of the new calculator.
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
 * Custom hook to manage a single calculator's data and mutations.
 * Handles loading, error, and mutation states.
 * Supports optimistic UI updates.
 *
 * @param {string} projectId - The project ID.
 * @param {string} calculatorId - The calculator ID.
 * @param {function} onError - Optional callback for error handling.
 * @returns {object} - Calculator data, loading states, error, and mutation methods.
 */
export function useCalculator(projectId, calculatorId, onError) {
  const [calculator, setCalculator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMutation, setLoadingMutation] = useState(false);
  const [error, setError] = useState(null);

  // Unified error handler: sets error state and calls external callback
  const handleError = useCallback(
    (e) => {
      setError(e);
      if (onError) onError(e);
    },
    [onError]
  );

  /**
   * Loads calculator data from backend.
   * Uses useCallback to avoid unnecessary reloads.
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

  // Load calculator data on mount and when dependencies change
  useEffect(() => {
    if (!projectId || !calculatorId) return;

    let isMounted = true;

    const loadIfMounted = async () => {
      if (isMounted) await loadCalculator();
    };

    loadIfMounted();

    return () => {
      isMounted = false;
    };
  }, [projectId, calculatorId, loadCalculator]);

  /**
   * Helper to perform mutation with optimistic UI update.
   *
   * @param {Function} mutateFn - The async function performing the mutation.
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

  // Mutation methods with optimistic updates:

  const addNewSection = () =>
    performMutation(
      () => addSection(projectId, calculatorId),
      (sections) => [
        ...sections,
        {
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
        },
      ]
    );

  const deleteSection = (sectionId) =>
    performMutation(
      () => deleteSectionById(projectId, calculatorId, sectionId),
      (sections) => sections.filter((section) => section.id !== sectionId)
    );

  const renameSection = (sectionId, newTitle) =>
    performMutation(
      () => updateSectionName(projectId, calculatorId, sectionId, newTitle),
      (sections) =>
        sections.map((section) =>
          section.id === sectionId ? { ...section, title: newTitle } : section
        )
    );

  const renameDescription = (sectionId, lineId, newDescription) =>
    performMutation(
      () =>
        updateDescriptionName(projectId, calculatorId, sectionId, lineId, newDescription),
      (sections) =>
        sections.map((section) => {
          if (section.id !== sectionId) return section;

          const updatedLines = (section.lines || []).map((line) =>
            line.id === lineId ? { ...line, description: newDescription ?? "" } : line
          );

          return { ...section, lines: updatedLines };
        })
    );

  const addLine = (sectionId) =>
    performMutation(
      () => addOneLine(projectId, calculatorId, sectionId),
      (sections) =>
        sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                lines: [
                  ...(section.lines || []),
                  {
                    id: crypto.randomUUID(),
                    description: "description",
                    measurement: "ex 60 x 114",
                    amount: 0,
                  },
                ],
              }
            : section
        )
    );

  const addTen = (sectionId) =>
    performMutation(
      () => addTenLines(projectId, calculatorId, sectionId),
      (sections) =>
        sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                lines: [
                  ...(section.lines || []),
                  ...Array.from({ length: 10 }, () => ({
                    id: crypto.randomUUID(),
                    description: "description",
                    measurement: "ex 60 x 114",
                    amount: 0,
                  })),
                ],
              }
            : section
        )
    );

  const deleteOne = (sectionId, lineId) =>
    performMutation(
      () => deleteOneLine(projectId, calculatorId, sectionId, lineId),
      (sections) =>
        sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                lines: (section.lines || []).filter((line) => line.id !== lineId),
              }
            : section
        )
    );

  const deleteTen = (sectionId) =>
    performMutation(
      () => deleteTenLines(projectId, calculatorId, sectionId),
      (sections) =>
        sections.map((section) => {
          if (section.id !== sectionId) return section;

          const lines = section.lines || [];
          const updatedLines = lines.slice(0, Math.max(lines.length - 10, 0));
          return { ...section, lines: updatedLines };
        })
    );

  const deleteCalculatorFunction = () =>
    performMutation(() => deleteCalculator(projectId, calculatorId));

  /**
   * Calculates measurement product and updates line optimistically.
   *
   * @param {string} sectionId
   * @param {string} lineId
   * @param {string} measurement - e.g. "60 x 114"
   */
  const calcMeasurement = (sectionId, lineId, measurement) =>
    performMutation(
      () => calculateMeasurement(projectId, calculatorId, sectionId, lineId, measurement),
      (sections) =>
        sections.map((section) => {
          if (section.id !== sectionId) return section;

          const updatedLines = (section.lines || []).map((line) => {
            if (line.id !== lineId) return line;

            const parts = measurement?.split(/x/i).map((p) => p.trim());
            const nums = parts.map((p) => parseFloat(p));
            const product = nums[0] * nums[1] || 0;

            return { ...line, amount: product, measurement };
          });

          return { ...section, lines: updatedLines };
        })
    );

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
  };
}
