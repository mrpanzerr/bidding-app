import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  addProject,
  fetchProjects,
  renameProject,
} from "../firebase/projectService";

/*  
    That page will hold nothing except the doc options initially, but anything made
    on those pages will persist. 
    We might want to rework the data set up. 
    Each project can have a title, labor, material and cost page associated. maybe multiple 
    maybe just one
*/

/*
  const sortedProjects = [...projects].sort((a, b) => {
  const dateA = a.createdAt?.toDate() || new Date(0); // fallback if missing
  const dateB = b.createdAt?.toDate() || new Date(0);

  return dateB - dateA; // descending: newest first
});

*/

function Dashboard() {
  // State to hold the list of projects
  const [projects, setProjects] = useState([]);
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // New Project
  const [newproject, setNewProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  // Rename
  // State to manage selected project id
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  // State to hold the new name of the project
  const [newName, setNewName] = useState("");

  // Get the navigate function from react-router-dom to programmatically change routes
  const navigate = useNavigate();

  // Function to handle opening a project by navigating to a specific route
  // Currently, it navigates to the "/blank" route regardless of the project id
  const openProject = (id) => {
    navigate(`/project/${id}`);
  };

  // useEffect runs once when the component mounts
  useEffect(() => {
    // Define an async function to fetch projects from Firestore
    async function loadProjects() {
      try {
        const projectList = await fetchProjects();
        // Update the state with the list of projects
        setProjects(projectList);
      } catch (error) {
        // Log any errors that occur during fetching
        console.error("Error fetching projects:", error);
      } finally {
        // Whether success or error, we're done loading
        setLoading(false);
      }
    }

    // Call the fetch function
    loadProjects();
  }, []); // Empty dependency array = only run on mount

  const handleRename = async () => {
    if (!selectedProjectId || !newName) return;
    await renameProject(selectedProjectId, newName);
    // Refresh the list after renaiming
    const projectList = await fetchProjects();
    setProjects(projectList);
    setNewName("");
    setSelectedProjectId(null);
  };

  const handleNewProject = async () => {
    if (!projectName) return;
    await addProject(projectName);
    // Refresh the list after adding project
    const projectList = await fetchProjects();
    setProjects(projectList);
    setProjectName("");
    setNewProject(false);
  };

  // If we're still loading, show a loading message
  if (loading) return <p>Loading projects...</p>;

  // Render the dashboard UI
  return (
    <div>
      <h1>Welcome, Gaetano</h1>
      <h2>Your Projects:</h2>

      {/* Loop through the projects and display each one */}
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            onClick={() => openProject(project.id)}
            tabIndex="0" /* makes the element focusable with keyboard (Tab key) */
            role="button" /* tells screen readers that an element behaves like a button */
            onKeyDown={(e) =>
              e.key === "Enter" && openProject(project.id)
            } /* adds support for keyboard activation - Enter) */
            style={{ cursor: "pointer", userSelect: "none" }}
          >
            {/* Show project name or fallback to its ID if no name exists */}
            <p>{project.name}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProjectId(project.id);
                setNewName(project.name || "");
              }}
            >
              Rename Project
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setProjectName(projectName || "");
          setNewProject(true);
        }}
      >
        {" "}
        Add Project
      </button>

      {newproject && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: "bold",
              }}
            >
              Name Project:
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter name"
                style={{ marginTop: "5px", padding: "5px" }}
              />
            </label>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button onClick={handleNewProject}>Save</button>
              <button
                onClick={() => {
                  setNewProject(false);
                  setProjectName("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedProjectId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                fontWeight: "bold",
              }}
            >
              Name Project:
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter name"
                style={{ marginTop: "5px", padding: "5px" }}
              />
            </label>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button onClick={handleRename}>Save</button>
              <button
                onClick={() => {
                  setSelectedProjectId(null);
                  setNewName("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard; // to App.
