
// Import custom hook to manage title page data and loading state
import { useTitlePage } from '../hooks/useTitlePage';

import styles from "../styles/titlePageHeader.module.css";

function TitlePageHeader({
    company,
    companyAddress,
    contact1,
    contact2,
    companyEmail,
}) {
    // Use the custom hook to get title page data and loading state
    const { titlePageData, loading, error } = useTitlePage();

    // If loading, show a simple loading message
    if (loading) return <p>Loading title page...</p>;

    // If there's an error, display it
    if (error) return <p>Error loading title page: {error.message}</p>;

    // Render the title page header with company details
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