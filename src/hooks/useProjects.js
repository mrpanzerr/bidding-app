// Import React hooks for managing state and side effects
import { useEffect, useState } from "react";

// Import functions that interact with your Firebase database
import { addProject, deleteProject, fetchProjects, getProjectData, renameProject } from "../firebase/projectService";

/**
 * Custom React hook to manage project data and related operations.
 * This hook handles loading projects, adding, renaming, and deleting projects,
 * and provides state variables for the UI to reflect loading and error states.
 */
export function useProjects() {
  // State to store the list of projects fetched from Firestore
  const [projects, setProjects] = useState([]);
  
  // State to track whether data is currently being loaded (to show spinners, disable buttons, etc.)
  const [loading, setLoading] = useState(true);
  
  // State to store any errors that happen during data fetching or mutations
  const [error, setError] = useState(null);

  /**
   * useEffect with empty dependency array runs once when the component using this hook mounts.
   * It triggers the loading of projects from Firestore.
   */
  useEffect(() => {
    loadProjects();
  }, []);

  /**
   * Async function to load all projects from Firestore.
   * Sets loading and error states accordingly, and stores fetched projects in state.
   */
  const loadProjects = async () => {
    setLoading(true);  // Indicate loading started
    setError(null);    // Clear any previous error

    try {
      const data = await fetchProjects();  // Fetch projects from Firebase
      setProjects(data);                    // Store projects in state for UI to render
    } catch (e) {
      setError(e);                         // Save error for UI to display
    } finally {
      setLoading(false);                   // Loading finished (whether success or error)
    }
  };

  /**
   * Add a new project with the given name.
   * After adding, reloads the project list to keep UI up to date.
   */
  const addNewProject = async (name) => {
    try {
      await addProject(name);  // Add project via Firebase
      await loadProjects();    // Refresh projects to include the new one
    } catch (e) {
      setError(e);             // Save error for UI display
    }
  };

  /**
   * Rename an existing project by ID.
   * After renaming, reloads the project list.
   */
  const renameExistingProject = async (id, newName) => {
    try {
      await renameProject(id, newName);  // Update project name in Firebase
      await loadProjects();               // Refresh project list to show updated name
    } catch (e) {
      setError(e);                       // Save error for UI display
    }
  };

  /**
   * Delete a project by ID.
   * After deletion, reloads the project list.
   */
  const deleteExistingProject = async (id) => {
    try {
      await deleteProject(id);  // Remove project in Firebase
      await loadProjects();     // Refresh project list to reflect deletion
    } catch (e) {
      setError(e);             // Save error for UI display
    }
  };

  // Return all state and functions so components can access projects and perform actions
  return {
    projects,                // Current list of projects
    loading,                 // Whether data is being loaded
    error,                   // Any error encountered
    addNewProject,           // Function to add a new project
    renameExistingProject,   // Function to rename an existing project
    deleteExistingProject,   // Function to delete a project
  };
}

// Hook for single project
export function useProject(id) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true; // declare here

    const loadProject = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProjectData(id);

        if (data.exists()) {
          if (isMounted) setProject({ id: data.id, ...data.data() });
        } else {
          if (isMounted) {
            console.warn("No document found for this ID");
            setProject(false);
          }
        }
      } catch (e) {
        if (isMounted) setError(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProject();

    return () => {
      isMounted = false; // cleanup on unmount
    };
  }, [id]);

  return {
    project,
    loading,
    error,
  };
}