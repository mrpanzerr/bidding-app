import { useState } from "react";

/**
 * Custom hook for managing project modals and related actions.
 * Centralizes state and logic for creating, renaming, and deleting projects.
 *
 * @param {Object} params - The project action handlers.
 * @param {function(string): Promise<void>} params.addNewProject - Adds a new project with the given name.
 * @param {function(string, string): Promise<void>} params.renameExistingProject - Renames a project by ID and new name.
 * @param {function(string): Promise<void>} params.deleteExistingProject - Deletes a project by ID.
 *
 * @returns {Object} - Modal state, project state, and handler functions for project management.
 */
export function useProjectManagement({
  addNewProject,
  renameExistingProject,
  deleteExistingProject,
}) {
  // Tracks which modal is open: null, "new", "rename", or "delete"
  const [modalType, setModalType] = useState(null);

  // The project currently targeted for rename or delete
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Input states for different modals
  const [projectName, setProjectName] = useState(""); // For creating a new project
  const [newName, setNewName] = useState(""); // For renaming a project
  const [originalName, setOriginalName] = useState(""); // Original project name (useful for rename/delete confirmation UIs)
  const [deleteName, setDeleteName] = useState(""); // Name typed by user to confirm deletion

  /**
   * Opens the "New Project" modal.
   * Resets the project name input to ensure a clean state.
   *
   * @param {React.SyntheticEvent} e - Event object (propagation is stopped).
   */
  const openNewProjectModal = (e) => {
    e.stopPropagation();
    setProjectName("");
    setModalType("new");
  };

  /**
   * Creates a new project if the input name is valid.
   * Resets input and closes modal on success.
   */
  const handleNewProject = async () => {
    const trimmed = projectName.trim();
    if (!trimmed) return;
    await addNewProject(trimmed);
    setProjectName("");
    setModalType(null);
  };

  /**
   * Renames the currently selected project.
   * Resets input and modal state on success.
   */
  const handleRename = async () => {
    if (!selectedProjectId || !newName) return;
    await renameExistingProject(selectedProjectId, newName);
    setNewName("");
    setSelectedProjectId(null);
    setModalType(null);
  };

  /**
   * Deletes the currently selected project.
   * Resets selection and modal state on success.
   */
  const handleDelete = async () => {
    if (!selectedProjectId) return;
    await deleteExistingProject(selectedProjectId);
    setSelectedProjectId(null);
    setModalType(null);
  };

  return {
    // State
    modalType,
    setModalType,
    selectedProjectId,
    setSelectedProjectId,
    projectName,
    setProjectName,
    newName,
    setNewName,
    originalName,
    setOriginalName,
    deleteName,
    setDeleteName,

    // Handlers
    openNewProjectModal,
    handleNewProject,
    handleRename,
    handleDelete,
  };
}
