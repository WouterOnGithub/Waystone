import{db} from "../firebase/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, serverTimestamp} from "firebase/firestore";
import { createBaseCharacter } from "./entityCore";

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
  return createBaseCharacter(
    ["Users", userId, "Campaigns", campaignId, "Players"],
    playerData
  );
};

export const updatePlayer = async (userId, campaignId, playerId, playerData) => {
    const playerDoc = doc(db, "Users", userId, "Campaigns", campaignId, "Players", playerId);
    await updateDoc(playerDoc, playerData);
}

export const deletePlayerAndSubCollections = async (playerRef) => {
  const subCollections = await getSubCollections(playerRef);

  for (const sub of subCollections) {
    const snap = await getDocs(sub);
    for (const d of snap.docs) {
      await deleteDoc(d.ref);   
    }
  }

  await deleteDoc(playerRef);  
};

const getSubCollections = async (docRef) => {
  const possibleSubCollections = [
    "Inventory",
    "Spells",
    "Logs",
  ];

  return possibleSubCollections.map(name => collection(docRef, name));
};