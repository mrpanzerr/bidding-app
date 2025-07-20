import { useEffect, useState } from 'react';
import { fetchTitlePageData } from '../firebase/titlePageServices';

/**
 * Custom hook for managing title page data.
 * Handles data fetching, loading state, and error state.
 */
export function useTitlePage() {
    const [titlePageData, setTitlePageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTitlePageData();
    }, []);

    // Fetch title page data from the backend service.
    const loadTitlePageData = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchTitlePageData();
            setTitlePageData(data);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    // Expose data and utilities to components.
    return {
        titlePageData,
        loading,
        error,
        loadTitlePageData,
    };
}
