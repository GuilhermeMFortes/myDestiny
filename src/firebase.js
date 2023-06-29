import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAft8TEkCjrkOw8fOMB7Dd2mv9e3bXa1m0",
  authDomain: "mydestiny-1d639.firebaseapp.com",
  projectId: "mydestiny-1d639",
  storageBucket: "mydestiny-1d639.appspot.com",
  messagingSenderId: "464016703970",
  appId: "1:464016703970:web:aef90e1365aab34674f9bb"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };