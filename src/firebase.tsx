import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"; // Import the Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyCjkDIPRX28Qaa8q8bp26g8xshBihZy1SY",
  authDomain: "bitbrawlofficial-f7a38.firebaseapp.com",
  databaseURL:
    "https://bitbrawlofficial-f7a38-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bitbrawlofficial-f7a38",
  storageBucket: "bitbrawlofficial-f7a38.appspot.com",
  messagingSenderId: "806427531487",
  appId: "1:806427531487:web:673c23533845dac351f16a",
  measurementId: "G-N1T0Y2B4KK",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp); // Pass the initialized app to getAnalytics

// Initialize Realtime Database
const db = getDatabase(firebaseApp); // Initialize the Realtime Database

export { db };
