import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, remove, update, orderByChild, equalTo, get, limitToFirst, startAt } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

export { database, ref, push, set, onValue, remove, update, storage, storageRef, uploadBytes, getDownloadURL, orderByChild, equalTo, get, limitToFirst, startAt };