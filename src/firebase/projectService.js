import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";

import { db } from "./firebase";

/**
 * Fetch all projects from the 'projects' collection.
 *
 * @async
 * @returns {Promise<Array<{ id: string; [key: string]: any }>>}  
 *          Array of project objects including their document IDs and data.
 */
export async function fetchProjects() {
  const querySnapshot = await getDocs(collection(db, "projects"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/**
 * Fetch data for a single project by its document ID.
 *
 * @async
 * @param {string} id - The document ID of the project to retrieve.
 * @returns {Promise<import("firebase/firestore").DocumentSnapshot>}  
 *          Document snapshot containing the project data.
 * @throws Will throw an error if fetching the document fails.
 */
export async function getProjectData(id) {
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    return docSnap;
  } catch (e) {
    console.error("Error fetching document", e);
    throw e;
  }
}

/**
 * Rename an existing project by updating its 'name' field.
 *
 * @async
 * @param {string} id - The document ID of the project to rename.
 * @param {string} newName - The new name to assign to the project.
 * @returns {Promise<void>} Resolves when the update is complete.
 * @throws Will log an error if update fails.
 */
export async function renameProject(id, newName) {
  try {
    await setDoc(
      doc(db, "projects", id),
      { name: newName },
      { merge: true }
    );
  } catch (e) {
    console.error("Error updating project name:", e);
  }
}

/**
 * Add a new project to the 'projects' collection.
 *
 * @async
 * @param {string} projectName - The name of the new project.
 * @returns {Promise<void>} Resolves when the project has been added.
 * @throws Will log an error if creation fails.
 */
export async function addProject(projectName) {
  try {
    await addDoc(collection(db, "projects"), {
      name: projectName,
      createdAt: Timestamp.now(),
      dateSent: "",
      jobAddress: "",
      toAddress: "",
    });
  } catch (e) {
    console.error("Error adding project:", e);
  }
}

/**
 * Delete a project from the 'projects' collection by ID.
 *
 * @async
 * @param {string} id - The ID of the project to delete.
 * @returns {Promise<void>} Resolves when the project is deleted.
 * @throws Will log an error if deletion fails.
 */
export async function deleteProject(id) {
  try {
    const docRef = doc(db, "projects", id);
    await deleteDoc(docRef);
  } catch (e) {
    console.error("Error deleting project:", e);
  }
}
