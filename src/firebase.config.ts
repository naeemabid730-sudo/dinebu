import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { getFirestore } from "firebase/firestore"; // 👈 Ye line honi chahiye
// Aapki updated Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwG0jVdwk3uYg4shro768c2qqEs419he0",
  authDomain: "dinebu-8e705.firebaseapp.com",
  projectId: "dinebu-8e705",
  storageBucket: "dinebu-8e705.firebasestorage.app",
  messagingSenderId: "116841893564",
  appId: "1:116841893564:web:4b5c67153380a60db0cab9",
  measurementId: "G-DKZMN6RPJR"
};

// Firebase initialize karein
export const app = initializeApp(firebaseConfig);

// Messaging initialize karein
export const messaging = getMessaging(app);
export const db = getFirestore(app); // 👈 Ye line lazmi export honi chahiye
// Aapki updated VAPID Key (Web Push Certificate)
export const vapidKey = "BFUpQhG3i3jd_SPJ8GcX4x-oAt9zXzUMcdsRXStvO_lrj9phjV4Im1kzvqTcbhhQyG5HKDnFpbGrvFj3j957kNs";