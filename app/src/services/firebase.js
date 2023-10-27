// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-RKUpQJZLg_LKla0SJgW4wniVYDotSdk",
  authDomain: "etherquest-1baf2.firebaseapp.com",
  projectId: "etherquest-1baf2",
  storageBucket: "etherquest-1baf2.appspot.com",
  messagingSenderId: "759682773348",
  appId: "1:759682773348:web:0b99ea68d55e0c0415ca71",
  measurementId: "G-6HXTT94P8K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
