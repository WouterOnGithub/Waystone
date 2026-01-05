import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc
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