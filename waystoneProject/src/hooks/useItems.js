import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

/**
 * Haalt alle items op uit de items collectie.
 * Geeft een object terug: { itemId: itemData, ... }
 */
export function useItems(userId, campaignId ) {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const itemsColRef = collection(db, "Users", userId, "Campaigns", campaignId, "Items");
        const snapshot = await getDocs(itemsColRef);

        const itemsMap = {};
        snapshot.docs.forEach((doc) => {
          itemsMap[doc.id] = doc.data(); // bv. Name, Value, Weight, Description, Effect
        });

        setItems(itemsMap);
      } catch (error) {
        console.error("Fout bij ophalen items:", error);
        setItems({});
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return items; // je kan ook { items, loading } teruggeven als je een loader wilt
}
