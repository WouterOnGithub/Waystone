import { db } from "../firebase/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";

//get user data
const getUser = async (userId) => {
    try{
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    }catch(error){
        console.error("Error getting user:", error);
        return null;
    };
}

//set user data
const setUser = async (userId ,userData) => {
    try {
        const docRef = doc(db, "users", userId);
        //merge true to update existing fields
        await setDoc(docRef, userData, { merge: true }); 
        const updatedDoc = await getDoc(docRef);
        return updatedDoc.exists() ? updatedDoc.data() : null;
    } catch (error) {console.error("Error setting user:", error) };
}

export{getUser, setUser}