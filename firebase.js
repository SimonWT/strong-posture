import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "strong-posture.firebaseapp.com",
    databaseURL: "https://strong-posture-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "strong-posture",
    storageBucket: "strong-posture.appspot.com",
    messagingSenderId: "811940161210",
    appId: "1:811940161210:web:cebac515e98ecf662d4483",
    measurementId: "G-BG5SLDYPH5"
  };

const app = initializeApp(firebaseConfig)
export const database = getDatabase(app);
