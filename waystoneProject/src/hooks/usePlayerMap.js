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

  return player ? { ...player, id: playerId, tokenType: "player" }: null;
  
}

export function useUpdateHp(userId, campaignId, tokenType, tokenId) {
  return useCallback(
    async (newHp) => {
      if (!userId || !campaignId || !tokenId || !tokenType) return;

      const collection = tokenType === "player" ? "Players" : "Entities";
      const ref = doc(db, "Users", userId, "Campaigns", campaignId, collection, tokenId);
  
      try {
        await updateDoc(ref, { HpCurrent: newHp });
      } catch (err) {
        console.error("Error updating HP:", err);
      }
    },
    [userId, campaignId, tokenId, tokenType]
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

  return entity? { ...entity, id: entityId, tokenType: "entity" } : null;
}

export function useContainer(userId, campaignId, containerId) {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (!userId || !campaignId || !containerId) return;

    const ref = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Containers",
      containerId
    );

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setContainer(snap.data());
      } else {
        setContainer(null); // container deleted or doesn't exist
      }
    });

    return unsub;
  }, [userId, campaignId, containerId]);

  return container
    ? { ...container, id: containerId, tokenType: "container" }
    : null;
}