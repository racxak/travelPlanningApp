// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRICP9__vpgha2YkstcgoU1MUyU-Kspj8",
  authDomain: "travel-planning-app-4b277.firebaseapp.com",
  projectId: "travel-planning-app-4b277",
  storageBucket: "travel-planning-app-4b277.appspot.com",
  messagingSenderId: "179620975279",
  appId: "1:179620975279:web:00d23e754790c9ded0fa5a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

