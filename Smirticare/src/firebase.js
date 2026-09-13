/**
 * firebase.js
 * Same idea as the old vanilla-JS version: paste your real project config
 * here from console.firebase.google.com → Project settings → your web app.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAgH4WfNecANK1CN-tjgygLX3v2F9aPUjo",
  authDomain: "smriticare-99886.firebaseapp.com",
  projectId: "smriticare-99886",
  storageBucket: "smriticare-99886.firebasestorage.app",
  messagingSenderId: "1005033420098",
  appId: "1:1005033420098:web:81e41400bc1530e1ab44db"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  console.warn("Offline persistence not enabled:", err.code);
});
