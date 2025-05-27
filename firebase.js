// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSP0EVVaVTmGZEfJtR-NKzFgb_KZ_JZbc",
  authDomain: "adv102-finalproject-f0dce.firebaseapp.com",
  projectId: "adv102-finalproject-f0dce",
  storageBucket: "adv102-finalproject-f0dce.appspot.com",
  messagingSenderId: "718555348194",
  appId: "1:718555348194:web:0911e0c4d8e287fbb3f2bb",
  measurementId: "G-LF886674QE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and db for use in the app
export const auth = getAuth(app);
export const db = getFirestore(app);