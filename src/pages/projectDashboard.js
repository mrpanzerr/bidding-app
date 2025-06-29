// Import React hooks for managing state and side effects

// useParams lets you access URL parameters (like the project id from the route)
import { useNavigate, useParams } from "react-router-dom";

import { useProject } from "../hooks/useProjects";

/**
 * TitlePage component displays details for a single project.
 * It fetches the project data based on the "id" URL parameter.
 */
function ProjectDashboard() {
  // Extract the "id" parameter from the URL (e.g. /project/:id)
  const { id } = useParams();

  // State to hold the fetched project data
  const { project, loading, error } = useProject(id);

  const navigate = useNavigate();

  const openTitlePage = () => navigate(`/project/${id}/titlePage`);

  const openSectionForm = () => navigate(`/project/${id}/sqftCalculator`);

  // While loading, show a simple loading message
  if (loading) return <p>Loading project...</p>;
  // If there's an error, show it (could be a network issue, etc.)
  if (error) return <p>Error loading project: {error.message}</p>;
  // If loading is done but project is null, show a "not found" message
  if (!project || project === false) return <p>Project not found.</p>;

  return (
    <div>
      <h1>{project.name} Dashboard</h1>
      {/* Square Foot Calculator button */}
      <button onClick={() => openTitlePage(project.id)}>Title Page</button>
      <button onClick={() => openSectionForm(project.id)}>
        Square Foot Calculator
      </button>
      {/* Add more project dashboard UI here */}
    </div>
  );
}

// Export this componenet for use in routing
export default ProjectDashboard;
