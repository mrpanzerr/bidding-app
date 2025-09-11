import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import {
  addMyProject,
  addProject,
  deleteMyProject,
  deleteProject,
  fetchMyProjects,
  fetchProjects,
  getProjectData,
  renameMyProject,
  renameProject,
} from "../firebase/projectService";

/**
 * Custom hook for managing projects.
 * Automatically switches between guest and user-specific projects.
 */
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      const data = user ? await fetchMyProjects() : await fetchProjects();
      setProjects(data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const addNewProject = async (name) => {
    try {
      const user = auth.currentUser;
      user ? await addMyProject(name) : await addProject(name);
      await loadProjects();
    } catch (e) {
      setError(e);
    }
  };

  const renameExistingProject = async (id, newName) => {
    try {
      const user = auth.currentUser;
      user
        ? await renameMyProject(id, newName)
        : await renameProject(id, newName);
      await loadProjects();
    } catch (e) {
      setError(e);
    }
  };

  const deleteExistingProject = async (id) => {
    try {
      const user = auth.currentUser;
      user ? await deleteMyProject(id) : await deleteProject(id);
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
 * Works for both guest and user projects.
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
