// Import React hooks for managing state and side effects
import { useParams } from "react-router-dom";
// Import function to fetch project data from Firebase
import { useProject } from "../hooks/useProjects";

function SqftCalculator() {
  const { id } = useParams();
  const { project, loading, error } = useProject(id);

  // While loading, show a simple loading message
  if (loading) return <p>Loading project...</p>;
  // If there's an error, show it (could be a network issue, etc.)
  if (error) return <p>Error loading project: {error.message}</p>;
  // If loading is done but project is null, show a "not found" message
  if (!project || project === false) return <p>Project not found.</p>;

  return (
    <div>
      <h1>{project.name} Square Foot Calculator</h1>
      {/* Add calculator UI here */}
    </div>
  );
}

export default SqftCalculator;
