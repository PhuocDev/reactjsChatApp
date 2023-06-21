import firebase from "firebase";
import 'firebase/analytics';
import 'firebase/auth'
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDGVp8sdzQJ8TJ_8meyHnDwRuiayQRGY38",
    authDomain: "chat-app1-8cd4f.firebaseapp.com",
    projectId: "chat-app1-8cd4f",
    storageBucket: "chat-app1-8cd4f.appspot.com",
    messagingSenderId: "539192708427",
    appId: "1:539192708427:web:69529e52e53db9a109ecce",
    measurementId: "G-TN4Q2J7PW8",
    databaseURL: "https://chat-app1-8cd4f-default-rtdb.asia-southeast1.firebasedatabase.app",
  };

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

export {db, auth};
export default firebase;
