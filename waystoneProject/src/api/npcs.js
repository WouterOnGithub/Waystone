import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc
} from "firebase/firestore";

import { createBaseCharacter } from "./entityCore";

export const addNPC = async (userId, campaignId, npcData) => {
  return createBaseCharacter(
    ["Users", userId, "Campaigns", campaignId, "Entities"],
    { ...npcData, type: "npc" }
  );
};

export const addEnemy = async (userId, campaignId, enemyData) => {
  return createBaseCharacter(
    ["Users", userId, "Campaigns", campaignId, "Entities"],
    { ...enemyData, type: "enemy" }
  );
};

export const updateEntity =async(userId, campaignId, entityId, updateData)=>{
  if (!userId || !campaignId || !entityId) {
    throw new Error("Missing required parameters for updating entity");
  }

  const entityRef = doc(db, "Users", userId, "Campaigns", campaignId, "Entities", entityId);
  try {
    await setDoc(entityRef, updateData, { merge: true });
    console.log(`Entity ${entityId} updated successfully`);
  } catch (error) {
    console.error("Error updating entity:", error);
    throw error;
  }
}

export const deleteEntityAndSubCollections = async (entityRef) => {
  const subCollections = await getSubCollections(entityRef);

  for (const sub of subCollections) {
    const snap = await getDocs(sub);
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
  }

  await deleteDoc(entityRef);
};

// List the known subcollections for entities
const getSubCollections = async (docRef) => {
  const possibleSubCollections = [
    "Inventory",
    "Spells",
    "Logs",
  ];

  return possibleSubCollections.map(name => collection(docRef, name));
};

export const getEntitiesByType= async (userId, campaignId, type) => {
  if(!userId || !campaignId) return[];

  try{
    const snapshot = await getDocs(
      collection(db, "Users", userId , "Campaigns", campaignId, "Entities")
    )
      return snapshot.docs
        .map(doc => ({id: doc.id, ...doc.data() }))
        .filter(entity => entity.type === type);
  }catch(error){
    console.error(`Error fetching ${type}s`, error);
    return [];
  }
}

export const getEntityById = async(userId, campaignId, entityId) => {
  const entityRef = doc(db, "Users", userId, "Campaigns", campaignId, "Entities", entityId);
  const snapshot = await getDoc(entityRef)
  if(!snapshot.exists()){
    throw new Error('Entity not found')
  }

  return{id: snapshot.id, ...snapshot.data()};
};