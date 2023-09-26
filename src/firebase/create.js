import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "./config";

const createData = async (collectionName, newData) => {
    await setDoc(doc(collection(db, collectionName)), newData);
};

const createImage = async (images) => {
    try {
        Object.keys(images).forEach(async i => {
            const storageRef = firebase.storage().ref('galery');
            const archivoPath = storageRef.child(images[i].name);
            await archivoPath.put(images[i])
            await archivoPath.getDownloadURL()
                .then(async (url) => {
                    return url
                });
        })
    }
    catch (e) {
        console.log(e);
    }
};


export {createData, createImage};