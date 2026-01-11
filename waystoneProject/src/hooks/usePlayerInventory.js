import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, onSnapshot, updateDoc , getDoc, setDoc} from "firebase/firestore";

export function usePlayerInventory(userId, campaignId, playerId) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !campaignId || !playerId) return;

    setLoading(true);
    const inventoryRef = doc(db, "Users", userId, "Campaigns", campaignId, "Players", playerId, "Inventory", "default");

    // Live listener
    const unsubscribe = onSnapshot(inventoryRef, (snap) => {
      if (!snap.exists()) {
        setInventory([]);
        setLoading(false);
        return;
      }
      const data = snap.data();
      const slotsArray = Object.entries(data)
        .filter(([key]) => key.startsWith("Slot"))   // 👈 important
        .map(([slotKey, slotValue]) => ({
          slotKey,
          ItemID: slotValue.ItemID || "",
          Amount: slotValue.Amount || 0,
        }));

      setInventory(slotsArray);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, campaignId, playerId]);

  // Save inventory
  const saveInventory = async (newInventory) => {
    if (!userId || !campaignId || !playerId) return false;
    setLoading(true);

    try {
      const inventoryRef = doc(db, "Users", userId, "Campaigns", campaignId, "Players", playerId, "Inventory", "default");

      const snap = await getDoc(inventoryRef);
      const oldData = snap.exists() ? snap.data() : {};

      const inventoryData = {
        capacity: oldData.capacity ?? 20,  // 👈 keep capacity intact
      };

      newInventory.forEach((slot) => {
        inventoryData[slot.slotKey] = {
          ItemID: slot.ItemID,
          Amount: slot.Amount,
          lastUpdated: new Date(),
        };
      });

      await setDoc(inventoryRef, inventoryData);
      return true;
    } catch (err) {
      console.error("Error saving inventory:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add item
  const addItem = (itemId) => {
  setInventory(prev => {
    const copy = prev.map(s => ({ ...s })); // maak een diepe kopie van slots
    const index = copy.findIndex(s => s.ItemID === itemId);

    if (index !== -1) {
      // Item bestaat al, verhoog veilig met 1
      copy[index] = { ...copy[index], Amount: copy[index].Amount + 1 };
    } else {
      const emptyIndex = copy.findIndex(s => !s.ItemID || s.Amount === 0);
      if (emptyIndex !== -1) {
        copy[emptyIndex] = { ...copy[emptyIndex], ItemID: itemId, Amount: 1 };
      } else {
        copy.push({ slotKey: `Slot${copy.length + 1}`, ItemID: itemId, Amount: 1 });
      }
    }

    return copy;
  });
  };


  // Remove item
  const removeItem = (slotKey) => {
  setInventory(prev => {
    const copy = prev.map(s => ({ ...s })); // maak een diepe kopie van alle slots
    const index = copy.findIndex(s => s.slotKey === slotKey);
    if (index !== -1) {
      if (copy[index].Amount > 1) {
        copy[index] = { ...copy[index], Amount: copy[index].Amount - 1 }; // nieuwe kopie met verlaagde Amount
      } else {
        copy[index] = { ...copy[index], ItemID: "", Amount: 0 }; // leeg slot
      }
    }
    return copy;
  });
  };


  return { inventory, loading, saveInventory, addItem, removeItem, setInventory };
}
