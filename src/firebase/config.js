import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore" 
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage , ref} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBueblU7El6DIUYcIUTluq3t6nzucTae4Q",
  authDomain: "nutricortes-830eb.firebaseapp.com",
  projectId: "nutricortes-830eb",
  storageBucket: "nutricortes-830eb.appspot.com",
  messagingSenderId: "141204608163",
  appId: "1:141204608163:web:9bdac398e785a996979b16"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

const storage = getStorage(app);

const storageEbooksRef = ref(storage, 'ebooks')

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export {app, db, storage, storageEbooksRef};

