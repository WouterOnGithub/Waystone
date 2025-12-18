import{db} from "../firebase/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, serverTimestamp} from "firebase/firestore";


export const getPlayersByCampaign = async (userId, campaignId) => {
    if (!userId || !campaignId) return [];

    try {
        const snapshot = await getDocs(
            collection(db, "Users", userId, "Campaigns", campaignId, "Players")
        );
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) );
    } catch (error) {
        console.error("Error fetching players: ", error);
        return [];
    }
};    



export const getPlayerById = async (userId, campaignId, playerId) => {
    const playerRef = doc (db, "Users", userId, "Campaigns", campaignId, "Players", playerId);
    const snapshot = await getDoc (playerRef);
    if (!snapshot.exists()) {
        throw new Error("Player not found");
    }
    return { id: snapshot.id, ...snapshot.data() };
};


export const addPlayer = async (userId, campaignId, playerData) => {
    const playersCollection = collection(db, "Users", userId, "Campaigns", campaignId, "Players");
    const docRef = await addDoc(playersCollection, playerData);

    const inventoryRef= doc(db, "Users", userId, "Campaigns", campaignId, "Players", docRef.id, "Inventory", "default");
    const maxSlots = 20;

    const initialSlots = {};
    for (let i = 1; i <= maxSlots; i++) {
        initialSlots[`Slot${i}`] = { Amount: 0, ItemID: "", lastUpdated: serverTimestamp() };
    }

    await setDoc(inventoryRef,{
        capacity : maxSlots,
        ...initialSlots
    });

    return { id: docRef.id, ...playerData };
};

export const updatePlayer = async (userId, campaignId, playerId, playerData) => {
    const playerDoc = doc(db, "Users", userId, "Campaigns", campaignId, "Players", playerId);
    await updateDoc(playerDoc, playerData);
}