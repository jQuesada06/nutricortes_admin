import {doc, deleteDoc } from "firebase/firestore";
import { db } from "./config";

const deleteDocument = async (collectionName, documentId) => {
    await deleteDoc(doc(db, "cities", "DC"));
}

export {deleteDocument}