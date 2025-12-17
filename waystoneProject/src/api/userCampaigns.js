import {db} from "../firebase/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";



async function parseJson(res, fallbackMessage) {
    console.log("parseJson called, response status:", res.status); // debug

    if (!res.ok) {
        const text = await res.text();
       console.error("API response not ok:", text);
        throw new Error(text || fallbackMessage);
    } 

    const json = await res.json();
    console.log("API response json:", json); // debug: show returned data
    return json;
}

//create new campaign (campaign subtab)
export const createCampaign = async (userId, campaignData) => {
    console.log("createCampaign called with:", userId, campaignData);

    if (!campaignData.name) {
        throw new Error("Campaign name is required");
    }

    try {
        const collectionRef = collection(db, "Users", userId, "Campaigns");
        const docRef = await addDoc(collectionRef, campaignData);
        const newDoc = await getDoc(docRef);
        console.log("New campaign created with ID:", docRef.id);
        return newDoc.exists() ? { id: newDoc.id, ...newDoc.data() } : null;
    } catch (error) {
        console.error("Error creating campaign:", error);
        return null;
    }
};

// Get campaign data (Campaign subtab)
export const getCampaign = async (userId, campaignId) => {
    try {
        const docRef = doc(db, "Users", userId, "Campaigns", campaignId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } catch (error) {
        console.error("Error getting campaign:", error);
        return null;
    }
};

// Get all campaigns for a user
export const getAllCampaigns = async (userId) => {
    try {
        const collectionRef = collection(db, "Users", userId, "Campaigns");
        const querySnapshot = await getDocs(collectionRef);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error getting all campaigns:", error);
        return [];
    }
};

//update camppaign info (name , genre, backstory)
export const updateCampaignInfo = async (userId, campaignId, campaignInfo) => {
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
