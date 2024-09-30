import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3I9samkeM-QAGqZVJK6Dz04AM9in0yCk",
  authDomain: "todoapp-f2d8b.firebaseapp.com",
  projectId: "todoapp-f2d8b",
  storageBucket: "todoapp-f2d8b.appspot.com",
  messagingSenderId: "67439559056",
  appId: "1:67439559056:web:c2f0c42c42ea30ad1a7315",
  measurementId: "G-VPT1RGK2NS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)


export {db}