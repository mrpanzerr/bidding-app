import { useState } from "react";

/**
 * Custom hook for managing project modals and actions.
 * Encapsulates the state and logic for creating, renaming, and deleting projects.
 *
 * @param {Object} params - The project action handlers.
 * @param {function(string): Promise<void>} params.addNewProject - Function to add a new project.
 * @param {function(string, string): Promise<void>} params.renameExistingProject - Function to rename an existing project.
 * @param {function(string): Promise<void>} params.deleteExistingProject - Function to delete an existing project.
 *
 * @returns {Object} - An object containing modal state, project state, and handler functions.
 */
export function useProjectManagement({ addNewProject, renameExistingProject, deleteExistingProject }) {
  // Modal state: null, 'new', 'rename', or 'delete'
  const [modalType, setModalType] = useState(null);

  // Currently selected project ID for rename or delete operations
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Input states
  const [projectName, setProjectName] = useState(""); // New project name
  const [newName, setNewName] = useState("");         // Renamed project name
  const [originalName, setOriginalName] = useState(""); // Original project name before deletion/rename
  const [deleteName, setDeleteName] = useState("");   // Name confirmation for deletion modal

  /**
   * Opens the "New Project" modal and clears the input field.
   * @param {React.SyntheticEvent} e - The event object to prevent propagation.
   */
  const openNewProjectModal = (e) => {
    e.stopPropagation();
    setProjectName("");
    setModalType("new");
  };

  /**
   * Handles creating a new project using the provided name.
   * Clears input and closes modal upon completion.
   */
  const handleNewProject = async () => {
    const trimmed = projectName.trim();
    if (!trimmed) return;
    await addNewProject(trimmed);
    setProjectName("");
    setModalType(null);
  };

  /**
   * Handles renaming the selected project.
   * Clears input and resets selection/modal state upon completion.
   */
  const handleRename = async () => {
    if (!selectedProjectId || !newName) return;
    await renameExistingProject(selectedProjectId, newName);
    setNewName("");
    setSelectedProjectId(null);
    setModalType(null);
  };

  /**
   * Handles deleting the selected project.
   * Clears input and resets selection/modal state upon completion.
   */
  const handleDelete = async () => {
    if (!selectedProjectId) return;
    await deleteExistingProject(selectedProjectId);
    setSelectedProjectId(null);
    setOriginalName("");
    setDeleteName("");
    setModalType(null);
  };

  return {
    // State
    modalType, setModalType,
    selectedProjectId, setSelectedProjectId,
    projectName, setProjectName,
    newName, setNewName,
    originalName, setOriginalName,
    deleteName, setDeleteName,

    // Handlers
    openNewProjectModal,
    handleNewProject,
    handleRename,
    handleDelete,
  };
}
