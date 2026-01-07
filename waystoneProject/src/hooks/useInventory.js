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
export function useInventory(playerId, campaignId, userId) {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("Fetching inventory for:", campaignId, playerId, userId);

  useEffect(() => {
    if (!playerId || !campaignId || !userId) return;

    const fetchInventories = async () => {
      setLoading(true);
      try {
        
        const invColRef = collection(db,"Users",userId, "Campaigns", campaignId, "Players", playerId, "Inventory");
        const snapshot = await getDocs(invColRef);
        console.log("Inventory snapshot size:", snapshot.size);

        const invData = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          console.log("Document data:", docSnap.id, data);

          // Converteer de slots map naar een array
          const slotsArray = data.Slots
            ? Object.keys(data.Slots).map((key) => {
                return { ...data.Slots[key], id: key }; // voeg de slot key toe als id
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
      } finally {
        setLoading(false);
      }
    };

    fetchInventories();
  }, [playerId, campaignId, userId]);

  return inventories; // je kan ook {inventories, loading} teruggeven als je loader wilt
}
