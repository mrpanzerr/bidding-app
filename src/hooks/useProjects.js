import { useEffect, useState } from "react";
import { addProject, fetchProjects, renameProject } from "../firebase/projectService";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load projects once on mount
  useEffect(() => {
    loadProjects();
  }, []);

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

  const addNewProject = async (name) => {
    try {
      await addProject(name);
      await loadProjects();  // refresh list
    } catch (e) {
      setError(e);
    }
  };

  const renameExistingProject = async (id, newName) => {
    try {
      await renameProject(id, newName);
      await loadProjects();  // refresh list
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
  };
}
