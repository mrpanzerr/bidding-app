// Import React hooks and utilities
import { useState } from "react";
// useNavigate lets you programmatically change pages (routes)
import { useNavigate } from "react-router-dom";

// Import UI components for modals and project items
import DeleteModal from "../components/deleteModal";
import NewProjectModal from "../components/newProjectModal";
import ProjectItem from "../components/projectItem";
import RenameModal from "../components/renameModal";

// Import your custom hook that handles project data and operations
import { useProjects } from "../hooks/useProjects";

/**
 * Dashboard page component
 * Shows a list of projects with options to add, rename, delete, and open projects.
 */
function Dashboard() {
  // Destructure project data and functions from your custom hook
  const {
    projects,
    loading,
    error,
    addNewProject,
    renameExistingProject,
    deleteExistingProject,
  } = useProjects();

  // State to track which modal is open: "rename" or "delete" (or null = no modal)
  const [modalType, setModalType] = useState(null);

  // State for controlling the "Add New Project" modal visibility
  const [newProject, setNewProject] = useState(false);
  // State for the name input when adding a new project
  const [projectName, setProjectName] = useState("");

  // State to track the currently selected project id (for rename/delete modals)
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  // State for the new name input when renaming a project
  const [newName, setNewName] = useState("");

  // State for storing the original name of a project (used in delete confirmation)
  const [originalName, setOriginalName] = useState("");
  // State for a delete name input (could be used to confirm deletion by typing name)
  const [deleteName, setDeleteName] = useState("");

  // Hook to navigate to different pages programmatically
  const navigate = useNavigate();

  // Sort projects by creation date (newest first)
  const sortedProjects = [...projects].sort((a, b) => {
    // Firestore timestamps need to be converted to JS Date objects before comparing
    const dateA = a.createdAt?.toDate() || new Date(0); // fallback to epoch start if missing
    const dateB = b.createdAt?.toDate() || new Date(0);
    return dateB - dateA; // newest first
  });

  /**
   * Open the modal to add a new project.
   * Stop event bubbling so this click doesn’t trigger other handlers.
   */
  const openNewProjectModal = (e) => {
    e.stopPropagation();
    setProjectName(projectName || ""); // reset project name input
    setNewProject(true);               // show new project modal
  };

  /**
   * Called when renaming a project is saved.
   * Calls hook function, then resets related state.
   */
  const handleRename = async () => {
    if (!selectedProjectId || !newName) return;  // prevent empty name or no selection
    await renameExistingProject(selectedProjectId, newName); // update project in Firebase
    setNewName("");                // clear input
    setSelectedProjectId(null);    // reset selection
  };

  /**
   * Called when adding a new project is saved.
   * Trims input, calls hook function, then resets state and hides modal.
   */
  const handleNewProject = async () => {
    const trimmed = projectName.trim();  // remove whitespace
    if (!trimmed) return;                 // do nothing if empty
    await addNewProject(trimmed);         // add project to Firebase
    setProjectName("");                   // clear input
    setNewProject(false);                 // hide new project modal
  };

  /**
   * Called when deleting a project is confirmed.
   * Calls hook function, then resets all relevant state.
   */
  const handleDeleteProject = async () => {
    if (!selectedProjectId) return;       // no project selected, do nothing
    await deleteExistingProject(selectedProjectId); // delete project in Firebase
    setSelectedProjectId("");             // clear selection
    setOriginalName("");                  // clear original name
    setDeleteName("");                    // clear delete confirmation input
  };

  /**
   * Called when user clicks on a project to open its page.
   * Uses React Router to navigate.
   */
  const openProject = (id) => {
    navigate(`/project/${id}`);
  };

  // Show loading or error messages while waiting for data
  if (loading) return <p>Loading projects...</p>;
  if (error) return <p>Error loading projects: {error.message}</p>;

  return (
    <div>
      <h1>Welcome, Gaetano</h1>
      <ul>
        {/* Render the list of projects, sorted by newest */}
        {sortedProjects.map((project) => (
          <ProjectItem
            key={project.id}               // unique React key
            project={project}              // project data passed to component
            onOpen={openProject}           // callback to open project
            onRename={(id, name) => {      // open rename modal for this project
              setSelectedProjectId(id);
              setNewName(name);
              setModalType("rename");
            }}
            onDelete={(id, name) => {      // open delete modal for this project
              setSelectedProjectId(id);
              setOriginalName(name);
              setModalType("delete");
            }}
          />
        ))}
      </ul>

      {/* Button to open "Add New Project" modal */}
      <button onClick={openNewProjectModal}>Add Project</button>

      {/* Conditionally show the NewProjectModal when adding a new project */}
      {newProject && (
        <NewProjectModal
          projectName={projectName}             // current input value
          setProjectName={setProjectName}       // function to update input
          onSave={handleNewProject}              // function to call when saving
          onCancel={() => {                      // function to call when cancelling
            setNewProject(false);
            setProjectName("");
          }}
        />
      )}

      {/* Conditionally show the RenameModal when renaming a project */}
      {selectedProjectId && modalType === "rename" && (
        <RenameModal
          modalType={modalType}         // type of modal (rename)
          newName={newName}             // current new name input
          setNewName={setNewName}       // function to update new name input
          onSave={handleRename}         // function to call when saving rename
          onCancel={() => {             // function to call when cancelling
            setSelectedProjectId(null);
            setNewName("");
            setModalType(null);
          }}
        />
      )}

      {/* Conditionally show the DeleteModal when deleting a project */}
      {selectedProjectId && modalType === "delete" && (
        <DeleteModal
          modalType={modalType}          // type of modal (delete)
          deleteName={deleteName}        // input for delete confirmation (if used)
          setDeleteName={setDeleteName}  // function to update delete confirmation input
          originalName={originalName}    // original project name to show in modal
          onSave={handleDeleteProject}   // function to call when confirming delete
          onCancel={() => {              // function to call when cancelling
            setSelectedProjectId(null);
            setOriginalName("");
            setDeleteName("");
            setModalType(null);
          }}
        />
      )}
    </div>
  );
}

// Export this component so it can be used by your app router
export default Dashboard;