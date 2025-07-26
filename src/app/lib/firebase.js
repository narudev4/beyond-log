import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2fDzWsWN1gAKCXFqiei0qJYwioGfOVrQ",
  authDomain: "svwb-win-tracker.firebaseapp.com",
  projectId: "svwb-win-tracker",
  storageBucket: "svwb-win-tracker.firebasestorage.app",
  messagingSenderId: "712980378200",
  appId: "1:712980378200:web:7b58763e8d4521b70b102d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);