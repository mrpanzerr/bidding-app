// Import React hooks for managing state and side effects
import { useEffect, useState } from "react";
// useParams lets you access URL parameters (like the project id from the route)
import { useParams } from "react-router-dom";

// Import function to get project data from Firebase
import { getProjectData } from "../firebase/projectService";

/**
 * PageTemplate component displays details for a single project.
 * It fetches the project data based on the "id" URL parameter.
 */
function PageTemplate() {
  // Extract the "id" parameter from the URL (e.g. /project/:id)
  const { id } = useParams();

  // State to hold the fetched project data
  const [project, setProject] = useState(null);

  // State to track whether the data is still loading (used to show loading message)
  const [loading, setLoading] = useState(true);

  /**
   * useEffect runs once when the component mounts or when the "id" changes.
   * It triggers an async function to fetch project data from Firebase.
   */
  useEffect(() => {
    async function fetchProject() {
      try {
        // Call Firebase service to get the document snapshot for this project id
        const doc = await getProjectData(id);

        // Check if the document exists in the database
        if (doc.exists()) {
          // If it exists, set project state with its data and id
          setProject({ id: doc.id, ...doc.data() });
        } else {
          // If no document found, warn in console (could show UI message too)
          console.warn("no document");
        }
      } catch (e) {
        // Log any error during fetching to the console
        console.error("error fetching project:", e);
      } finally {
        // Set loading to false to stop showing loading message
        setLoading(false);
      }
    }

    // Call the async fetch function
    fetchProject();
  }, [id]); // Dependency array means this effect runs again if id changes

  // While loading, show a simple loading message
  if (loading) return <p>Loading project...</p>;

  // If loading is done but project is null, show a "not found" message
  if (!project) return <p>Project not found.</p>;

  // Render the project details once data is loaded successfully
  return (
    <div>
      <h1>Project: {project.name}</h1>
      <p>ID: {project.id}</p>
      {/* Add more project details UI here as needed */}
    </div>
  );
}

// Export this component for use in routing
export default PageTemplate;
