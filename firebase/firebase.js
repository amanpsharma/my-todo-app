// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6slWAgJLHYEr6D4VUYJyparGWcNETUJk",
  authDomain: "todo-apps-cc7fb.firebaseapp.com",
  projectId: "todo-apps-cc7fb",
  storageBucket: "todo-apps-cc7fb.appspot.com",
  messagingSenderId: "518854998430",
  appId: "1:518854998430:web:38c74f31e5258c60c9be8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);