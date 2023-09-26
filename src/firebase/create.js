import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./config";

const createData = async (collectionName, newData) => {
    await setDoc(doc(collection(db, collectionName)), newData);
};




export {createData};