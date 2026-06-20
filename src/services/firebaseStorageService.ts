import { db, isMockFirebase, handleFirestoreError, OperationType } from "../lib/firebase";
import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, Firestore } from "firebase/firestore";
import { CarbonTwinState } from "../types";

/**
 * Loads the user's historical snapshot records from Firestore or fallback local storage.
 */
export async function loadHistory(uid: string): Promise<CarbonTwinState[]> {
  if (isMockFirebase || !db) {
    const localKey = `twins_history_${uid}`;
    const saved = localStorage.getItem(localKey);
    if (saved) {
      try {
        return JSON.parse(saved) as CarbonTwinState[];
      } catch {
        return [];
      }
    }
    return [];
  }

  try {
    const twinsColPath = `users/${uid}/twins`;
    const q = query(collection(db, twinsColPath), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const loaded: CarbonTwinState[] = [];
    querySnapshot.forEach((docSnap) => {
      loaded.push(docSnap.data() as CarbonTwinState);
    });
    return loaded;
  } catch (err) {
    console.warn("Could not query Firestore, falling back to local sandbox storage:", err);
    const localKey = `twins_history_${uid}`;
    const saved = localStorage.getItem(localKey);
    if (saved) {
      try {
        return JSON.parse(saved) as CarbonTwinState[];
      } catch {
        return [];
      }
    }
    return [];
  }
}

/**
 * Commits a new snapshot to Firestore or fallback local storage.
 */
export async function saveSnapshot(uid: string, snapshot: CarbonTwinState): Promise<void> {
  if (isMockFirebase || !db) {
    const localKey = `twins_history_${uid}`;
    const existing = await loadHistory(uid);
    const updated = [snapshot, ...existing];
    localStorage.setItem(localKey, JSON.stringify(updated));
    return;
  }

  try {
    const docPath = `users/${uid}/twins/${snapshot.id}`;
    await setDoc(doc(db, docPath), snapshot);
  } catch (err) {
    console.error("Firestore snapshot save crash:", err);
    // Write fallback snapshot locally to preserve user progress
    const localKey = `twins_history_${uid}`;
    const existing = await loadHistory(uid);
    const updated = [snapshot, ...existing];
    localStorage.setItem(localKey, JSON.stringify(updated));
  }
}

/**
 * Removes a historical snapshot record from Firestore or local storage.
 */
export async function deleteSnapshot(uid: string, snapshotId: string): Promise<void> {
  if (isMockFirebase || !db) {
    const localKey = `twins_history_${uid}`;
    const existing = await loadHistory(uid);
    const updated = existing.filter((item) => item.id !== snapshotId);
    localStorage.setItem(localKey, JSON.stringify(updated));
    return;
  }

  try {
    const docPath = `users/${uid}/twins/${snapshotId}`;
    await deleteDoc(doc(db, docPath));
  } catch (err) {
    console.error("Firestore delete snap crash, forcing local storage deletion:", err);
    const localKey = `twins_history_${uid}`;
    const existing = await loadHistory(uid);
    const updated = existing.filter((item) => item.id !== snapshotId);
    localStorage.setItem(localKey, JSON.stringify(updated));
  }
}
