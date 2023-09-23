import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js"

const firebaseConfig = {
    apiKey: "AIzaSyA5Q469wRbDybSQHHpktny0uB5gp2J7lLI",
    authDomain: "my-web-415c3.firebaseapp.com",
    projectId: "my-web-415c3",
    storageBucket: "my-web-415c3.appspot.com",
    messagingSenderId: "839305854196",
    appId: "1:839305854196:web:767862b12c9f47201332a1"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, db, doc, setDoc, getDoc, updateDoc, storage, ref, uploadBytesResumable, getDownloadURL, collection, addDoc, serverTimestamp, query, where, getDocs ,deleteDoc};