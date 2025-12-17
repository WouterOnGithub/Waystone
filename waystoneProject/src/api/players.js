import{db} from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";


export const getPlayers = async (userId, campaignId) => {
    const snapshot = await getDocs(collection(db, "Users", userId, "Campaigns", campaignId, "Players"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addPlayer = async (userId, campaignId, playerData) => {
    const playersCollection = collection(db, "Users", userId, "Campaigns", campaignId, "Players");
    const docRef = await addDoc(playersCollection, playerData);
    return { id: docRef.id, ...playerData };
};

export const updatePlayer = async (userId, campaignId, playerId, playerData) => {
    const playerDoc = doc(db, "Users", userId, "Campaigns", campaignId, "Players", playerId);
    await updateDoc(playerDoc, playerData);
}