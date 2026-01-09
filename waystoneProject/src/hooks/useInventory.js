import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

export function useInventory(ownerId, campaignId, userId, tokenType) {
  const [inventories, setInventories] = useState([]);

  useEffect(() => {
    if (!ownerId || !campaignId || !userId || !tokenType) return;

    const fetchInventories = async () => {
      try {
        const collectionName = tokenType === "player" ? "Players" : "Entities";

        const invColRef = collection(
          db,
          "Users",
          userId,
          "Campaigns",
          campaignId,
          collectionName,
          ownerId,
          "Inventory"
        );

        const snapshot = await getDocs(invColRef);

        const invData = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();

          // 🔥 JUISTE STRUCTUUR
          const slotsArray = Object.entries(data)
            .filter(([key]) => key.startsWith("Slot"))
            .map(([key, value]) => ({
              ...value,
              id: key
            }));

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
