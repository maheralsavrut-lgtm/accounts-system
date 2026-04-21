import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Black Box AI Studio - Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKk5oIaE1LYOmoYMd2t6PnitXwXxHTSl4",
  authDomain: "black-box-c4847.firebaseapp.com", 
  projectId: "black-box-c4847",
  storageBucket: "black-box-c4847.firebasestorage.app",
  messagingSenderId: "824717519714",
  appId: "1:824717519714:web:5e18e347319cb337045a3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Authentication and Database with Types
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export default app;
