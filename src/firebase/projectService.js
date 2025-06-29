// Import Firestore functions to work with your database:
// - addDoc: add a new document to a collection
// - collection: get reference to a collection
// - deleteDoc: delete a document
// - doc: get reference to a document
// - getDoc: get data from a single document
// - getDocs: get all documents in a collection
// - setDoc: update or create a document
// - Timestamp: get current time for createdAt fields
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, Timestamp } from 'firebase/firestore';

// Import your Firestore database instance from your firebase config file
import { db } from './firebase';

/**
 * Fetch all projects from the 'projects' collection.
 *
 * @returns {Promise<Array<{id: string, [key: string]: any}>>} An array of project objects including their document IDs and data.
 */

export async function fetchProjects() {
  // Get all documents in the 'projects' collection
  const querySnapshot = await getDocs(collection(db, 'projects'));
  
  // Map each document into an object with its id and data fields
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,     // Firestore document id (unique identifier)
    ...doc.data(),  // All other fields stored in the document
  }));
}

/**
 * Fetch data for a single project by its document ID.
 *
 * @param {string} id - The document ID of the project to retrieve.
 * @returns {Promise<import('firebase/firestore').DocumentSnapshot>} The document snapshot containing the project data.
 * @throws Will throw an error if the document cannot be retrieved.
 */
export async function getProjectData(id) {
  try {
    // Create a reference to the document with the given id in the 'projects' collection
    const docRef = doc(db, "projects", id);

    // Retrieve the document snapshot from Firestore
    const docSnap = await getDoc(docRef);
    
    // Return the document snapshot (you can later call docSnap.data() to get project data)
    return docSnap;
  } catch (e) {
    // Log any error that occurs during fetching
    console.error("Error fetching document", e);
    // Re-throw the error to be handled elsewhere if needed
    throw e;
  }
}

/**
 * Rename an existing project by updating its 'name' field.
 *
 * @param {string} id - The document ID of the project to rename.
 * @param {string} newName - The new name to assign to the project.
 * @returns {Promise<void>} Resolves when the update is complete.
 */
export async function renameProject(id, newName) {
  try {
    // Update the 'name' field of the project document with the given id
    await setDoc(doc(db, "projects", id), {
      name: newName
    }, { merge: true }); // merge: true keeps other fields intact
  } catch (e) {
    // Log error if something goes wrong during update
    console.error("Error updating project name: ", e);
  }
}

/**
 * Add a new project to the 'projects' collection.
 *
 * @param {string} projectName - The name of the new project.
 * @returns {Promise<void>} Resolves when the project has been added.
 */
export async function addProject(projectName) {
  try {
    // Add a new document with 'name' and 'createdAt' timestamp to 'projects' collection
    await addDoc(collection(db, "projects"), {
      name: projectName,
      createdAt: Timestamp.now(), // current server timestamp
      dateSent: "",
      jobAddress: "",
      toAddress: "",
    });
  } catch (e) {
    // Log error if something goes wrong during creation
    console.error("Error adding project: ", e);
  }
}

/**
 * Delete a project from the 'projects' collection by ID.
 *
 * @param {string} id - The ID of the project to delete.
 * @returns {Promise<void>} Resolves when the project is deleted.
 */
export async function deleteProject(id) {
  try {
    // Get a reference to the project document by id
    const docRef = doc(db, "projects", id);
    
    // Delete the document from Firestore
    await deleteDoc(docRef);
  } catch (e) {
    // Log error if something goes wrong during deletion
    console.error("Error deleting project:", e);
  }
}