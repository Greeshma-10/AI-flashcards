// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRQCTvDvU3bYzMwf2x0pRA__K2ETbl-FE",
  authDomain: "flashcard-f46a8.firebaseapp.com",
  projectId: "flashcard-f46a8",
  storageBucket: "flashcard-f46a8.appspot.com",
  messagingSenderId: "192665008797",
  appId: "1:192665008797:web:80a411c980b4d43bfd7274"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };