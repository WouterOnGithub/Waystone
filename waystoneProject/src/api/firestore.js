import { db } from "../firebase/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";

//get user data
const getUser = async (UserId) => {
    try{
        const docref = doc(db, "users", UserId);
        const docSnap = await getDoc(docref);
        return docSnap.exists() ? docSnap.data() : null;
    }catch(error){
        console.error("Error getting user:", error);
        return null;
    };
}

//set user data
const setUser = async (UserId ,userData) => {
    try {
        const docref = doc(db, "users", UserId);
        //merge true to update existing fields
        await setDoc(docref, userData, { merge: true }); 
        console.log("User set successfully");
    } catch (error) {console.error("Error setting user:", error) };
}

export{getUser, setUser, getplayerStats}