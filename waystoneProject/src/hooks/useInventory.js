import { Firestore } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase/firebase"; // je Firestore instance
import { collection, doc, getDocs } from "firebase/firestore";

/**
 * Haalt alle inventory documenten van een speler op.
 * @param {string} playerId
 * @param {string} campaignId
 * @returns Array van inventory docs: [{ docName, slots: [...] }]
 */
export function useInventory(ownerId, campaignId, userId, tokenType) { //owner id = player of entitie van wie de inventory is
  const [inventories, setInventories] = useState([]);

  useEffect(() => {
    if (!ownerId || !campaignId || !userId || !tokenType) return;

    setInventories([]);

    const fetchInventories = async () => {  
      try {
        
        const collectionName = tokenType === "player" ? "Players" : "Entities";
        const invColRef = collection( db, "Users", userId, "Campaigns", campaignId, collectionName, ownerId, "Inventory");

        const snapshot = await getDocs(invColRef);

        const invData = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();

          // Converteer de slots map naar een array
          const slotsArray = data.Slots
            ? Object.keys(data.Slots).map((key) => {
                return { ...data.Slots[key], id: key };
              })
            : [];

          return {
            docName: docSnap.id,
            slots: slotsArray,
          };
        });

        setInventories(invData);
      } catch (error) {
        console.error("Fout bij ophalen inventory:", error);
        setInventories([]);
      }
    };

    fetchInventories();
  }, [ownerId, campaignId, userId, tokenType]);

  return inventories;   
}
