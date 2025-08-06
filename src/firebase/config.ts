import { getAuth } from "firebase/auth";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseApp } from "../firebaseConfig";

// Use the existing Firebase app instead of initializing a new one
const app = firebaseApp;
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Enable offline persistence when possible
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn("Firebase persistence is only supported in one tab at a time");
    } else if (err.code === "unimplemented") {
      // The current browser does not support all of the features required
      console.warn("Firebase persistence is not supported in this browser");
    }
  });
} catch (error) {
  console.error("Error enabling offline persistence:", error);
}

export default app;
