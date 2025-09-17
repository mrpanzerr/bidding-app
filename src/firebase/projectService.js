import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";

/* =======================
   GENERAL PROJECT FUNCTIONS (GUEST)
   ======================= */

/**
 * Fetch all guest projects (no userId field).
 */
export async function fetchProjects() {
  try {
    // Query projects where userId does not exist
    const q = query(collection(db, "projects"), where("userId", "==", null));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error("Error fetching guest projects:", e);
    return [];
  }
}

/**
 * Get a single project by ID
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
 * Add a project (guest)
 */
export async function addProject(projectName) {
  try {
    await addDoc(collection(db, "projects"), {
      total: 0,
      name: projectName,
      createdAt: Timestamp.now(),
      userId: null,
    });
  } catch (e) {
    console.error("Error adding project:", e);
  }
}

/**
 * Rename a project (guest)
 */
export async function renameProject(id, newName) {
  try {
    await setDoc(doc(db, "projects", id), { name: newName }, { merge: true });
  } catch (e) {
    console.error("Error updating project name:", e);
  }
}

/**
 * Delete a project (guest)
 */
export async function deleteProject(id) {
  try {
    await deleteDoc(doc(db, "projects", id));
  } catch (e) {
    console.error("Error deleting project:", e);
  }
}

/* =======================
   USER-SPECIFIC PROJECT FUNCTIONS
   ======================= */

/**
 * Fetch all projects owned by the current user
 */
export async function fetchMyProjects() {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const q = query(collection(db, "projects"), where("userId", "==", user.uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

/**
 * Add a new project for the current user
 */
export async function addMyProject(projectName) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  try {
    await addDoc(collection(db, "projects"), {
      userId: user.uid,
      name: projectName,
      createdAt: Timestamp.now(),
      dateSent: "",
      jobAddress: "",
      toAddress: "",
    });
  } catch (e) {
    console.error("Error adding user project:", e);
  }
}

/**
 * Rename a project owned by the current user
 */
export async function renameMyProject(id, newName) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().userId !== user.uid) {
      throw new Error("Project not found or not owned by user");
    }

    await setDoc(docRef, { name: newName }, { merge: true });
  } catch (e) {
    console.error("Error renaming user project:", e);
  }
}

/**
 * Delete a project owned by the current user
 */
export async function deleteMyProject(id) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().userId !== user.uid) {
      throw new Error("Project not found or not owned by user");
    }

    await deleteDoc(docRef);
  } catch (e) {
    console.error("Error deleting user project:", e);
  }
}
