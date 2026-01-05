import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useAvailablePlayers(userId, campaignId, mapCells) {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!userId || !campaignId) return;

    const playersRef = collection(db, "Users", userId, "Campaigns", campaignId, "Players");

    const unsub = onSnapshot(playersRef, (snapshot) => {
      const allPlayers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const usedPlayerIds = new Set(Object.values(mapCells || {}).map((cell) => cell.tokenId).filter(Boolean));

      const availablePlayers = allPlayers.filter((player) => !usedPlayerIds.has(player.id));

      setPlayers(availablePlayers);
    });

    return unsub;
  }, [userId, campaignId, mapCells]);

  return players; }