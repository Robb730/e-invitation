import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBR0yr-Bm1V4B2KLdCY0M-ilGcSYAaxeFk",
  authDomain: "reese-s-invitation.firebaseapp.com",
  projectId: "reese-s-invitation",
  storageBucket: "reese-s-invitation.firebasestorage.app",
  messagingSenderId: "1032364879293",
  appId: "1:1032364879293:web:6d6e53a6c8e9b1542db6d4"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
