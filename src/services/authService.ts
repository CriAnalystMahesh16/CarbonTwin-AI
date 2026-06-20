import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously,
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { auth, isMockFirebase } from "../lib/firebase";

export interface UserSession {
  uid: string;
  email: string | null;
  displayName?: string;
}

/**
 * Log in standard user via Email & Password with local sandbox fallbacks.
 */
export async function loginWithEmail(email: string, password: string): Promise<UserSession> {
  if (isMockFirebase) {
    return new Promise<UserSession>((resolve) => {
      setTimeout(() => {
        resolve({
          uid: `local-${email.replace(/[^a-zA-Z0-9]/g, "")}`,
          email: email,
          displayName: email.split("@")[0].toUpperCase(),
        });
      }, 500);
    });
  }

  if (!auth) {
    throw new Error("Firebase Authentication is not initialized.");
  }

  const credential = await signInWithEmailAndPassword(auth, email, password);
  return {
    uid: credential.user.uid,
    email: credential.user.email,
    displayName: credential.user.displayName || email.split("@")[0],
  };
}

/**
 * Register a new standard user via Email & Password with local sandbox fallbacks.
 */
export async function registerWithEmail(email: string, password: string): Promise<UserSession> {
  if (isMockFirebase) {
    return new Promise<UserSession>((resolve) => {
      setTimeout(() => {
        resolve({
          uid: `local-${email.replace(/[^a-zA-Z0-9]/g, "")}`,
          email: email,
          displayName: email.split("@")[0].toUpperCase(),
        });
      }, 500);
    });
  }

  if (!auth) {
    throw new Error("Firebase Authentication is not initialized.");
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return {
    uid: credential.user.uid,
    email: credential.user.email,
    displayName: email.split("@")[0],
  };
}

/**
 * Access local or cloud as anonymous credential session fallback.
 */
export async function loginAnonymously(): Promise<UserSession> {
  if (isMockFirebase) {
    return new Promise<UserSession>((resolve) => {
      setTimeout(() => {
        resolve({
          uid: "sandbox-anonymous-777",
          email: "anonymous@carbontwin.ai",
          displayName: "Eco Nomad",
        });
      }, 500);
    });
  }

  if (!auth) {
    throw new Error("Firebase Authentication is not initialized.");
  }

  const credential = await signInAnonymously(auth);
  return {
    uid: credential.user.uid,
    email: "anonymous@carbontwin.ai",
    displayName: "Anonymous Member",
  };
}

/**
 * Sign out session securely.
 */
export async function logoutUser(): Promise<void> {
  if (isMockFirebase || !auth) {
    return;
  }
  await signOut(auth);
}
