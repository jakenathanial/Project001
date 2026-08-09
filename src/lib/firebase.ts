import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore, collection, doc, addDoc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  onSnapshot, query, where, orderBy, limit, serverTimestamp, enableIndexedDbPersistence
} from 'firebase/firestore';
import {
  getDatabase, ref, set, get, push, update, remove, onValue, off
} from 'firebase/database';

export const firebaseConfig = {
  apiKey: "AIzaSyDlBIeNVDK5nBPpVFkFSxNY59e7gW-p18c",
  authDomain: "rentafruit-f57d9.firebaseapp.com",
  projectId: "rentafruit-f57d9",
  storageBucket: "rentafruit-f57d9.firebasestorage.app",
  messagingSenderId: "66702277537",
  appId: "1:66702277537:web:e7f210f38252ad4fd0e9e0",
  measurementId: "G-0J9TNJNEV5",
  databaseURL: "https://rentafruit-f57d9-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const dbFS = getFirestore(app);
export const dbRT = getDatabase(app);

// Enable offline persistence silently if supported
try {
  enableIndexedDbPersistence(dbFS).catch(() => {});
} catch (e) {
  // Ignore persistence errors
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export {
  signInWithPopup,
  fbSignOut as signOut,
  onAuthStateChanged,
  collection, doc, addDoc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  onSnapshot, query, where, orderBy, limit, serverTimestamp,
  ref, set, get, push, update, remove, onValue, off
};
export type { User };
