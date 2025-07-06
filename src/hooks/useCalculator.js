import { useCallback, useEffect, useState } from "react";

import { addCalculator, getAllCalculators } from "../firebase/calculatorServices";

export function useCalculators(projectId) {
    const [calculators, setCalculators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);  

    const loadCalculators = useCallback(async () => {
        if (!projectId) return; // no project selected

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

    const addNewCalculator = async (type, name) => {
        if (!projectId || !name.trim()) return; // no project or empty name

        try {
            await addCalculator(projectId, type, name);
            await loadCalculators(); // refresh list after adding
        } catch (e) {
            console.error("Error adding calculator:", e);
            setError(e);
        }
    };

    return {
        calculators,          // Current list of calculators
        loading,              // Whether data is being loaded
        error,                // Any error encountered
        addNewCalculator,     // Function to add a new calculator
        loadCalculators,      // Function to manually reload calculators
    };
}