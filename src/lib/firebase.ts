// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBOmpseYlEfdwEIXvOoaUJ2nvueMjbnWMQ",
    authDomain: "time-card-3cf04.firebaseapp.com",
    projectId: "time-card-3cf04",
    storageBucket: "time-card-3cf04.firebasestorage.app",
    messagingSenderId: "1093803634601",
    appId: "1:1093803634601:web:40ed088fc9222bef31deb8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;