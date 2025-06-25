// Import React hooks for managing state and side effects
import { useEffect, useState } from 'react';

// Import function to fetch title page data from your Firebase service
import { fetchTitlePageData } from '../firebase/titlePageServices';

export function useTitlePage() {
    const [titlePageData, setTitlePageData] = useState(null); // State to hold title page data
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to hold any error

    useEffect(() => {
        loadTitlePageData();
    }, []);

    const loadTitlePageData = async () => {
        setLoading(true); // Set loading to true before fetching data
        setError(null); // Clear any previous error

        try {
            const data = await fetchTitlePageData(); // Fetch title page data from Firebase
            setTitlePageData(data); // Store the fetched data in state
        } catch (e) {
            setError(e); // Set error state if fetching fails
        } finally {
            setLoading(false); // Set loading to false after fetching is done
        }
    };

    // Return a;; state and data needed by components using this hook
    return {
        titlePageData, // The fetched title page data
        loading, // Loading status
        error, // Any error that occurred during fetching
        loadTitlePageData, // Function to manually reload title page data
    };
}