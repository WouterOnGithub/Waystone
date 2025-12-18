import { db } from "../firebase/firebase";
import {collection, getDocs, addDoc, updateDoc, doc, getDoc, setDoc,serverTimestamp} from "firebase/firestore";


export const getNPCsByCampaign = async (userId, campaignId) => {
  if (!userId || !campaignId) return [];

  const snapshot = await getDocs(
    collection(db, "Users", userId, "Campaigns", campaignId, "NPCs")
  );

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getNPCById = async (userId, campaignId, npcId) => {
  const npcRef = doc(
    db,
    "Users",
    userId,
    "Campaigns",
    campaignId,
    "NPCs",
    npcId
  );

  const snapshot = await getDoc(npcRef);
  if (!snapshot.exists()) {
    throw new Error("NPC not found");
  }

  return { id: snapshot.id, ...snapshot.data() };
};

export const addNPC = async (userId, campaignId, npcData) => {
  const npcCollection = collection(db, "Users", userId, "Campaigns", campaignId, "NPCs" );
  const docRef = await addDoc(npcCollection, {
    ...npcData,
    createdAt: serverTimestamp(),
    lastUpdated: serverTimestamp()
  });

  const maxSlots = 20;
  const inventoryRef = doc(db, "Users", userId, "Campaigns", campaignId, "NPCs", docRef.id, "Inventory", inventoryId);
      
  const slots = {};
  for (let i = 1; i <= maxSlots; i++) {
    slots[`Slot${i}`] = {
      Amount: 0,
      ItemID: "",
      lastUpdated: serverTimestamp()
    };
  }

  await setDoc(inventoryRef, {
    capacity: maxSlots,
    ...slots
  });

  return { id: docRef.id, ...npcData };
};

// 🔹 NPC updaten
export const updateNPC = async (userId, campaignId, npcId, npcData) => {
  const npcRef = doc(
    db,
    "Users",
    userId,
    "Campaigns",
    campaignId,
    "NPCs",
    npcId
  );

  await updateDoc(npcRef, {
    ...npcData,
    lastUpdated: serverTimestamp()
  });
};
