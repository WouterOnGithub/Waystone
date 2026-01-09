import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useTurnOrder(userId, campaignId, mapId) {
  const [turnData, setTurnData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !campaignId || !mapId) return;

    const ref = doc(db,
      "Users", userId,
      "Campaigns", campaignId,
      "Maps", mapId,
      "turnOrder", "currentTurnOrder"
    );

    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        setTurnData(snap.data());
      }
      setLoading(false);
    });

    return () => unsub();
  }, [userId, campaignId, mapId]);

  return { turnData, loading };
}
