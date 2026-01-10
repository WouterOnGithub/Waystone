import { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

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
      const slotsArray = Object.entries(data).map(([slotKey, slotValue]) => ({
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
      const inventoryData = {};
      newInventory.forEach((slot) => {
        inventoryData[slot.slotKey] = {
          ItemID: slot.ItemID,
          Amount: slot.Amount,
          lastUpdated: new Date(),
        };
      });
      await updateDoc(inventoryRef, inventoryData);
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
      const copy = [...prev];
      // eerst kijken of item al bestaat in een slot
      const index = copy.findIndex(s => s.ItemID === itemId);
      if (index !== -1) {
        copy[index].Amount += 1;
      } else {
        // eerste lege slot zoeken
        const emptyIndex = copy.findIndex(s => !s.ItemID || s.Amount === 0);
        if (emptyIndex !== -1) {
          copy[emptyIndex] = { ...copy[emptyIndex], ItemID: itemId, Amount: 1 };
        } else {
          // fallback: push naar het einde
          copy.push({ slotKey: `Slot${copy.length + 1}`, ItemID: itemId, Amount: 1 });
        }
      }
      return copy;
    });
  };

  // Remove item
  const removeItem = (slotKey) => {
    setInventory(prev => {
      const copy = [...prev];
      const index = copy.findIndex(s => s.slotKey === slotKey);
      if (index !== -1) {
        if (copy[index].Amount > 1) {
          copy[index].Amount -= 1;
        } else {
          copy[index] = { ...copy[index], ItemID: "", Amount: 0 };
        }
      }
      return copy;
    });
  };

  return { inventory, loading, saveInventory, addItem, removeItem, setInventory };
}
