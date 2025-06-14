// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOOBZ_RH58w2_ytr6W_wsAgmGUbLrwyPE",
  authDomain: "alexis-911.firebaseapp.com",
  projectId: "alexis-911",
  storageBucket: "alexis-911.firebasestorage.app",
  messagingSenderId: "956984468617",
  appId: "1:956984468617:web:ece331af0f9b79b1a09258",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);

export default firebaseApp;
