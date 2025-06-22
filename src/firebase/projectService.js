import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export async function fetchProjects() {
  const querySnapshot = await getDocs(collection(db, 'projects'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function getProjectData(id) {
    try {
        const docRef = await doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        return docSnap;
    } catch (e) {
        console.error("Error fetching document", e);
        throw e;
    }
}

export async function renameProject(id, newName) {
    try {
        await setDoc(doc(db, "projects", id), {
            name: newName
        }, { merge: true });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function addProject(projectName) {
    try {
        await addDoc(collection(db, "projects"), {
            name: projectName,
            createdAt: Timestamp.now(),
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export async function deleteProject(id) {
    try {
        const docRef = doc(db, "projects", id);
        await deleteDoc(docRef);
    } catch (e) {
        console.error("Error deleting project:", e);
    }
}