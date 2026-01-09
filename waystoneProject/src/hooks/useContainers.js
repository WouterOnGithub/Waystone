import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useContainers(userId, campaignId, mapCells) {
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    if (!userId || !campaignId) return;

    const ref = collection(db, "Users", userId, "Campaigns", campaignId, "Containers");

    const unsub = onSnapshot(ref, (snapshot) => {
      const allContainers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // filter out containers already on the map
      const usedTokenIds = new Set(
        Object.values(mapCells || {})
          .map(cell => cell.tokenId)
          .filter(Boolean)
      );

      const availableContainers = allContainers.filter(c => !usedTokenIds.has(c.id));

      setContainers(availableContainers);
    });

    return unsub;
  }, [userId, campaignId, mapCells]);

  return containers;
}
