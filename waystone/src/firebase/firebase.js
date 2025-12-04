import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";             // Authentication
import { getFirestore } from "firebase/firestore";   // Firestore DB
import { getStorage } from "firebase/storage";       // File storage
// Cloud Functions can be imported if needed:
import { getFunctions } from "firebase/functions";  

const firebaseConfig = {
  apiKey: "AIzaSyCRt1EZtBk_gDfQZMVRDcWtNOy5TmPR070",
  authDomain: "waystone-c5fac.firebaseapp.com",
  projectId: "waystone-c5fac",
  storageBucket: "waystone-c5fac.firebasestorage.app",
  messagingSenderId: "661224220848",
  appId: "1:661224220848:web:25494b69b0a498de9eb375"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
