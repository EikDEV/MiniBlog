import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB-VI4Ch8JZ-oNKyZBT-JgLjEvTXWb4eUk",
  authDomain: "miniblog-9d623.firebaseapp.com",
  projectId: "miniblog-9d623",
  storageBucket: "miniblog-9d623.appspot.com",
  messagingSenderId: "756359029245",
  appId: "1:756359029245:web:003df55209d753e2493994"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };