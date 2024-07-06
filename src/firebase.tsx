import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database'; // Import the Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyChieGJYU9TGzBlUljWjVqYF2Erb3w2ncE",
  authDomain: "test404track.firebaseapp.com",
  databaseURL: "https://test404track-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test404track",
  storageBucket: "test404track.appspot.com",
  messagingSenderId: "23062101949",
  appId: "1:23062101949:web:b402111fc08f76cf90dcd4",
  measurementId: "G-214Z3KHXPD"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp); // Pass the initialized app to getAnalytics

// Initialize Realtime Database
const db = getDatabase(firebaseApp); // Initialize the Realtime Database

export { db };
