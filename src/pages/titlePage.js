// Import React hooks for managing state and side effects

// useParams lets you access URL parameters (like the project id from the route)
import { useParams } from "react-router-dom";

// Import function to fetch project data from Firebase
import { useProject } from "../hooks/useProjects";

// Import React Router's useNavigate to change pages programmatically

// Import component that displays title page's header
import TitlePageHeader from "../components/titlePageHeader";

/**
 * TitlePage component displays details for a single project.
 * It fetches the project data based on the "id" URL parameter.
 */
function TitlePage() {  
  // Extract the "id" parameter from the URL (e.g. /project/:id)
  const { id } = useParams();

  const { project, loading, error } = useProject(id);

  
  

  // While loading, show a simple loading message
  if (loading) return <p>Loading project...</p>;
  // If there's an error, show it (could be a network issue, etc.)
  if (error) return <p>Error loading project: {error.message}</p>;
  // If loading is done but project is null, show a "not found" message
  if (!project || project === false) return <p>Project not found.</p>;

  // Render the project details once data is loaded successfully
  return (
    <div>
      {/* Display project details */}
      <TitlePageHeader />
      <p>To: {project.toAddress}</p>
      <p>Job: {project.jobAddress}</p>
      <p>Date: {project.dateSent}</p>
      {/* Add more project details UI here */}
    </div>
  );
}

// Export this component for use in routing
export default TitlePage;
