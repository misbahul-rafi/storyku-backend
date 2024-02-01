// Import the functions you need from the SDKs you need
const { initializeApp } = require ("firebase/app");
const { getStorage } = require ("firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkfBqIDTXZQnJuEC8lK-74Pbi5gsFrFFE",
  authDomain: "storyku-misbahulrafi.firebaseapp.com",
  projectId: "storyku-misbahulrafi",
  storageBucket: "storyku-misbahulrafi.appspot.com",
  messagingSenderId: "184250690183",
  appId: "1:184250690183:web:aa4b36bd0dd94da0f6a622"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = { storage };