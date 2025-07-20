// Import custom hook to manage title page data and loading state
import { useTitlePage } from '../hooks/useTitlePage';

import styles from "../styles/titlePageHeader.module.css";

/**
 * TitlePageHeader component displays company information in the title page header.
 * It uses the `useTitlePage` hook to fetch data and handle loading and error states.
 * 
 * @param {Object} props - Component props.
 * @param {string} props.company - Company name (unused, replaced by hook data).
 * @param {string} props.companyAddress - Company address (unused, replaced by hook data).
 * @param {string} props.contact1 - First contact number (unused, replaced by hook data).
 * @param {string} props.contact2 - Second contact number (unused, replaced by hook data).
 * @param {string} props.companyEmail - Company email (unused, replaced by hook data).
 * 
 * @returns {JSX.Element} The rendered title page header.
 */
function TitlePageHeader({
    company,
    companyAddress,
    contact1,
    contact2,
    companyEmail,
}) {
    // Use the custom hook to get title page data and loading state
    const { titlePageData, loading, error } = useTitlePage();

    if (loading) return <p>Loading title header...</p>;

    if (error) return <p>Error loading title page: {error.message}</p>;

    return (
        <div className={styles.titlePage}>
            <h1>{titlePageData.company}</h1>
            <p>{titlePageData.companyAddress}</p>
            <p>{titlePageData.contact1}</p>
            <p>{titlePageData.contact2}</p>
            <p>{titlePageData.companyEmail}</p>
        </div>
    );
}

export default TitlePageHeader;
