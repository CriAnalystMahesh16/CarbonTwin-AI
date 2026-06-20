import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Flag to determine if we are running in local sandbox fallback mode
export const isMockFirebase = 
  !firebaseConfig || 
  firebaseConfig.apiKey === "mock_api_key_placeholder" || 
  firebaseConfig.projectId === "mock-project-id";

let app;
let dbInstance: Firestore | null = null;
let authInstance: Auth | null = null;

try {
  if (!isMockFirebase) {
    app = initializeApp(firebaseConfig);
    dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    authInstance = getAuth();
  }
} catch (err) {
  console.warn("Firebase initialization failed, falling back to Local Static Sandbox Mode:", err);
}

export const db = dbInstance;
export const auth = authInstance;

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error Detailed: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
