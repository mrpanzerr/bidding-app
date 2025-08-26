import { useState } from "react";
import { useNavigate } from "react-router";
import { logout } from "../firebase/authServices";
import { auth } from "../firebase/firebase";
import { useProjects } from "../hooks/useProjects";

function UserDashboard() {
  const {
    projects,
    loading,
    error,
    addNewProject,
    renameExistingProject,
    deleteExistingProject,
  } = useProjects();
  const [newName, setNewName] = useState("");

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      console.log("User logged out");

      // Add a delay (e.g., 1 second) before navigating
      await new Promise((resolve) => setTimeout(resolve, 1000));

      navigate("/"); // navigate to login page
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  if (!auth.currentUser) return <div>Please log in to view your projects.</div>;

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>User Dashboard</h1>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => addNewProject("Test Project")}>
          Add Project
        </button>
      </div>

      <ul>
        {projects.map((project) => (
          <li key={project.id} style={{ marginBottom: 10 }}>
            <span>{project.name}</span>{" "}
            <button
              onClick={() =>
                renameExistingProject(project.id, newName || "Renamed Project")
              }
            >
              Rename
            </button>{" "}
            <button onClick={() => deleteExistingProject(project.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => handleLogout()}>Logout</button>
    </div>
  );
}

export default UserDashboard;
