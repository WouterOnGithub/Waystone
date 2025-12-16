import { useEffect, useState } from "react";
import { doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function useMapCells(userId, campaignId, mapId) {
  const [cells, setCells] = useState({});

  useEffect(() => {
    if (!userId || !campaignId || !mapId) return;

    const cellsRef = collection(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Maps",
      mapId,
      "Cells"
    );

    const unsub = onSnapshot(cellsRef, (snapshot) => {
      const newCells = {};
      snapshot.docs.forEach((doc) => {
        newCells[doc.id] = doc.data();
      });
      setCells(newCells);
    });

    return unsub;
  }, [userId, campaignId, mapId]);

  return cells;
}

export function useMap(userId, campaignId, mapId) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!userId || !campaignId || !mapId) return;

    const mapRef = doc(
      db,
      "Users",   // ← we MUST confirm this is correct
      userId,
      "Campaigns",
      campaignId,
      "Maps",
      mapId
    );

    console.log("Listening to:", mapRef.path);

    const unsub = onSnapshot(mapRef, (snapshot) => {
      console.log("Snapshot exists:", snapshot.exists());
      console.log("Snapshot data:", snapshot.data());

      if (snapshot.exists()) {
        setMap(snapshot.data());
      }
    });

    return unsub;
  }, [userId, campaignId, mapId]);

  return map;
}