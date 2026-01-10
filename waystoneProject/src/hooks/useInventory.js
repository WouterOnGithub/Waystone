import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs , onSnapshot} from "firebase/firestore";


export function useInventory(ownerId, campaignId, userId, tokenType) {
  const [inventories, setInventories] = useState([]);

  useEffect(() => {
    if (!ownerId || !campaignId || !userId || !tokenType) return;

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

    // realtime listener
    const unsub = onSnapshot(invColRef, (snapshot) => {
      const invData = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        const slotsArray = Object.entries(data)
          .filter(([key]) => key.startsWith("Slot"))
          .map(([key, value]) => ({
            ...value,
            id: key,
          }));

        return {
          docName: docSnap.id,
          slots: slotsArray,
        };
      });

      setInventories(invData);
    });

    return () => unsub(); // cleanup listener bij unmount
  }, [ownerId, campaignId, userId, tokenType]);

  return inventories;
}