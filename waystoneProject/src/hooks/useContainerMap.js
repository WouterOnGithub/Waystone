import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useContainer(userId, campaignId, containerId) {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (!containerId) return;

    const ref = doc(
      db,
      "Users",
      userId,
      "Campaigns",
      campaignId,
      "Containers",
      containerId
    );

    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        setContainer({ id: snap.id, tokenType: "container", ...snap.data() });
      } else {
        setContainer(null);
      }
    });

    return unsub;
  }, [userId, campaignId, containerId]);

  return container;
}
