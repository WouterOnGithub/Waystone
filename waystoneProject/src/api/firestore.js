import { db } from "../firebase/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";

//get user data
const getUser = async (userId) => {
    try{
        const docRef = doc(db, "Users", userId);
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
        const docRef = doc(db, "Users", userId);
        //merge true to update existing fields
        await setDoc(docRef, userData, { merge: true }); 
        const updatedDoc = await getDoc(docRef);
        return updatedDoc.exists() ? updatedDoc.data() : null;
    } catch (error) {console.error("Error setting user:", error) };
    return null;
}

export{getUser, setUser}

// Campaign subcollection 

//Create new campaign (campaign subtab)
const createCampaign = async (userId, campaignData) => {
    try {
        const collectionRef = collection(db, "Users", userId, "Campaigns");
        const docRef = await addDoc(collectionRef, campaignData);
        const newDoc = await getDoc(docRef);
        return newDoc.exists() ? { id: newDoc.id, ...newDoc.data() } : null;
    } catch (error) {
        console.error("Error creating campaign:", error);
        return null;
    }
};  


//get 1 campaign by userId + campaignId
const getCampaign = async (userId, campaignId) => {
    try {
        const docRef = doc(db, "Users", userId, "Campaigns", campaignId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
        console.error("Error getting campaign:", error);
        return null;
    }
};

//update camppaign info (name , genre, backstory)
const updateCampaignInfo = async (userId, campaignId, campaignInfo) => {
    try {
        const docRef = doc(db, "Users", userId, "Campaigns", campaignId);
        await setDoc(docRef, campaignInfo, { merge: true });
        const updatedDoc = await getDoc(docRef);
        return updatedDoc.exists() ? { id: updatedDoc.id, ...updatedDoc.data() } : null;
    } catch (error) {
        console.error("Error updating campaign info:", error);
        return null;
    }
};

//get all campaigns for a user
const getAllCampaigns = async (userId) => {
    try {
        const collectionRef = collection(db, "Users", userId, "Campaigns");
        const querySnapshot = await getDocs(collectionRef);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting all campaigns:", error);
        return [];
    }
};



export { createCampaign ,getCampaign, updateCampaignInfo, getAllCampaigns };