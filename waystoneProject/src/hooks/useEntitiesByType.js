import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useEntitiesByType(userId, campaignId, type, mapCells) {
  const [entities, setEntities] = useState([]);

  useEffect(() => {
    if (!userId || !campaignId || !type) return;

    const ref = collection(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Entities"
    );

    const unsub = onSnapshot(ref, (snapshot) => {
      const allEntities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Get all tokenIds already on the map
      const usedTokenIds = new Set(
        Object.values(mapCells || {})
          .map((cell) => cell.tokenId)
          .filter(Boolean)
      );

      // Only include entities of this type that are NOT on the map
      const availableEntities = allEntities
        .filter((entity) => entity.type === type)
        .filter((entity) => !usedTokenIds.has(entity.id));

      setEntities(availableEntities);
    });

    return unsub;
  }, [userId, campaignId, type, mapCells]);

  return entities;
}
