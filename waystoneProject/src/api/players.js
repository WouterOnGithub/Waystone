import{db} from "../firebase/firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
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
  // First, get player data to retrieve imageUrl
  const playerSnap = await getDoc(playerRef);
  if (!playerSnap.exists()) {
    console.error("Player not found:", playerRef.path);
    return false;
  }
  
  const playerData = playerSnap.data();
  const imageUrl = playerData?.imageUrl;
  
  // Delete the image file from the server if it exists
  if (imageUrl) {
    try {
      const res = await fetch("/api/delete-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl }),
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.warn("Failed to delete player image:", err.error || "Unknown error");
      } else {
        console.log("Successfully deleted player image:", imageUrl);
      }
    } catch (imageError) {
      console.warn("Error deleting player image:", imageError);
      // Continue with player deletion even if image deletion fails
    }
  }

  // Delete subcollections
  const subCollections = await getSubCollections(playerRef);
  for (const sub of subCollections) {
    const snap = await getDocs(sub);
    for (const d of snap.docs) {
      await deleteDoc(d.ref);   
    }
  }

  // Delete the player document
  await deleteDoc(playerRef);
  return true;
};

const getSubCollections = async (docRef) => {
  const possibleSubCollections = [
    "Inventory",
    "Spells",
    "Logs",
  ];

  return possibleSubCollections.map(name => collection(docRef, name));
};