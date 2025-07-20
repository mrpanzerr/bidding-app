import { useEffect, useState } from "react";
import {
  addProject,
  deleteProject,
  fetchProjects,
  getProjectData,
  renameProject,
} from "../firebase/projectService";

/**
 * Custom hook for managing all projects.
 * Provides state for loading, error handling, and project list management.
 */
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  // Fetch all projects and update state
  const loadProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  // Add a new project and reload projects
  const addNewProject = async (name) => {
    try {
      await addProject(name);
      await loadProjects();
    } catch (e) {
      setError(e);
    }
  };

  // Rename an existing project and reload projects
  const renameExistingProject = async (id, newName) => {
    try {
      await renameProject(id, newName);
      await loadProjects();
    } catch (e) {
      setError(e);
    }
  };

  // Delete a project and reload projects
  const deleteExistingProject = async (id) => {
    try {
      await deleteProject(id);
      await loadProjects();
    } catch (e) {
      setError(e);
    }
  };

  return {
    projects,
    loading,
    error,
    addNewProject,
    renameExistingProject,
    deleteExistingProject,
  };
}

/**
 * Custom hook for fetching a single project's data by ID.
 * Provides state for loading, error handling, and fetched data.
 */
export function useProject(id) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const loadProject = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getProjectData(id);
        if (isMounted) {
          if (data.exists()) {
            setProject({ id: data.id, ...data.data() });
          } else {
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
      isMounted = false;
    };
  }, [id]);

  return {
    project,
    loading,
    error,
  };
}
