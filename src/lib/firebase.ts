import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAX-kbRlXH-_kCraxLONeSXUfms7ymU-00",
  authDomain: "my-saving-plan.firebaseapp.com",
  projectId: "my-saving-plan",
  storageBucket: "my-saving-plan.firebasestorage.app",
  messagingSenderId: "348980478859",
  appId: "1:348980478859:web:da246e94aae9a2060de58e",
  measurementId: "G-M0S5VM0T17"
};

// Initialize Firebase (prevent re-initialization in Next.js development)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
