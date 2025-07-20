// React Router hook to access URL parameters.
import { useParams } from "react-router-dom";

// Custom hook to fetch project data from Firebase.
import { useProject } from "../hooks/useProjects";

// Component for displaying the title page header.
import TitlePageHeader from "../components/titlePageHeader";

/**
 * Displays details for a single project based on URL params.
 */
function TitlePage() {  
  // Extract project ID from URL.
  const { id } = useParams();

  const { project, loading, error } = useProject(id);

  // Show loading state.
  if (loading) return <p>Loading project...</p>;
  
  // Show error state.
  if (error) return <p>Error loading project: {error.message}</p>;
  
  // Handle missing project.
  if (!project || project === false) return <p>Project not found.</p>;

  // Render project details.
  return (
    <div>
      <TitlePageHeader />
      <p>To: {project.toAddress}</p>
      <p>Job: {project.jobAddress}</p>
      <p>Date: {project.dateSent}</p>
      {/* Additional project details go here */}
    </div>
  );
}

// Export for routing.
export default TitlePage;
