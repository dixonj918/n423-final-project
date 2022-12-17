// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBvniaaqUoO48Z5PTuR8GOASxTyQATuUI",
  authDomain: "n423-final-project.firebaseapp.com",
  projectId: "n423-final-project",
  storageBucket: "n423-final-project.appspot.com",
  messagingSenderId: "388659864055",
  appId: "1:388659864055:web:54e709c8b5065d31814ef2",
  measurementId: "G-6YC7DD8Q9P",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
export { db };
