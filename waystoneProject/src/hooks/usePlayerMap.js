import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";
import { db } from "../firebase/firebase";

export function usePlayer(userId, campaignId, playerId) {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    if (!userId || !campaignId || !playerId) return;

    const ref = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Players",
      playerId
    );

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setPlayer(snap.data());
      }
    });

    return unsub;
  }, [userId, campaignId, playerId]);

  return player;
}

export function useUpdateHp(userId, campaignId, playerId) {
  return useCallback(
    async (newHp) => {
      if (!userId || !campaignId || !playerId) return;

      const ref = doc(db, "Users", userId, "Campaigns", campaignId, "Players", playerId);
      try {
        await updateDoc(ref, { HpCurrent: newHp });
      } catch (err) {
        console.error("Error updating player HP:", err);
      }
    },
    [userId, campaignId, playerId]
  );
}

export function useEntity(userId, campaignId, entityId) {
  const [entity, setEntity] = useState(null);

  useEffect(() => {
    if (!userId || !campaignId || !entityId) return;

    const ref = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Entities",
      entityId
    );

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setEntity(snap.data());
      } else {
        setEntity(null); // Entity was deleted or doesn't exist
      }
    });

    return unsub; // unsubscribe on cleanup
  }, [userId, campaignId, entityId]);

  return entity;
}