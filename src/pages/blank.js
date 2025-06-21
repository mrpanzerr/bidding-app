import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectData } from "../firebase/projectService";

function PageTemplate() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const doc = await getProjectData(id);
        if (doc.exists()) {
          setProject({ id: doc.id, ...doc.data() });
        } else {
          console.warn("no document");
        }
      } catch (e) {
        console.error("error fetching project:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  if (loading) return <p>Loading project...</p>;

  if (!project) return <p>Project not found.</p>;

  return (
    <div>
      <h1>Project: {project.name}</h1>
      <p>ID: {project.id}</p>
      {/* add more project detail UI here */}
    </div>
  );
}

export default PageTemplate;
