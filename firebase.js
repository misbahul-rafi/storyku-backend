
const { initializeApp } = require ("firebase/app");
const { getStorage } = require ("firebase/storage");
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