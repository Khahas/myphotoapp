import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzfDXndwvP3-1PZK9BXDvnwYMoToaJJDw",
  authDomain: "myphotoapp-457a6.firebaseapp.com",
  projectId: "myphotoapp-457a6",
  storageBucket: "myphotoapp-457a6.appspot.com",
  messagingSenderId: "24257401885",
  appId: "1:24257401885:web:02ab4df6e94c45753be2f4",
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);


export const storage = getStorage(app)

export { app as default, auth };
