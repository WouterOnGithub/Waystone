import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useEntitiesByType(userId, campaignId, type) {
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


      const filtered = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((entity) => entity.type === type);

      setEntities(filtered);
    });

    return unsub;
  }, [userId, campaignId, type]);

  return entities;
}
