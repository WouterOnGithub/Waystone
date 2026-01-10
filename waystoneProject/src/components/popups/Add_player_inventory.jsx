import React, { useState, useEffect } from "react";
import "../../pages/pages-css/CSS.css";
import "../../pages/pages-css/Add_View.css";
import Add_Logo from "../../assets/Add_Logo.webp";
import { useItems } from "../../hooks/useItems";
import { usePlayerInventory } from "../../hooks/usePlayerInventory";

function Add_Player_Inventory({ onClose, userId, campaignId, playerId }) {
  const itemsCollection = useItems(userId, campaignId);
  const {
    inventory,
    loading,
    saveInventory,
    addItem,
    removeItem,
  } = usePlayerInventory(userId, campaignId, playerId);

  const [newItem, setNewItem] = useState("");
  const [message, setMessage] = useState("");

  // Load inventory when component mounts
  useEffect(() => {}, [userId, campaignId, playerId]);

  const handleAdd = () => {
    if (!newItem) return;
    addItem(newItem);
    setNewItem("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (inventory.length === 0) {
      setMessage("Please add at least one item.");
      return;
    }

    setMessage("");
    const success = await saveInventory(inventory);
    setMessage(success ? "Inventory updated successfully!" : "Failed to save inventory.");
  };

  return (
    <div id="addview-page">
      <div id="addview-box">
        <p id="addview-title">Manage Player Inventory</p>
        <div id="addview-content">
          <form id="input-box-white" onSubmit={handleSave}>
            
            {/* Dropdown om items te selecteren */}
            <label><b>Select Item to Add</b></label>
            <div className="addview-select">
              <select value={newItem} onChange={(e) => setNewItem(e.target.value)}>
                <option value="">Select an item...</option>
                {itemsCollection &&
                  Object.entries(itemsCollection).map(([id, item]) => (
                    <option key={id} value={id}>
                      {item.name || "Unnamed Item"} (Weight: {item.weight}, Value: {item.value})
                    </option>
                  ))}
              </select>
              <button
                type="button"
                id="button-icons"
                onClick={handleAdd}
                disabled={!newItem}
              >
                <img src={Add_Logo} alt="Add_Logo" id="Add_Logo" />
              </button>
            </div>

            {/* Player inventory display per slot */}
            {inventory.length > 0 && (
              <div className="character-section addview">
                {inventory.map((slot) => {
                  // Toon alleen slots met items
                  if (!slot.ItemID) return null;
                  const item = itemsCollection[slot.ItemID];
                  return (
                    <div className="character-row addview" key={slot.slotKey}>
                      <b>{item?.name || "Unknown Item"} x{slot.Amount}</b>
                      <button
                        type="button"
                        id="button-gray"
                        onClick={() => removeItem(slot.slotKey)}
                      >
                        remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <br />
            <button id="button-green" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Inventory"}
            </button>
            <button id="button-gray" type="button" onClick={onClose}>
              Back
            </button>
            {message && (
              <>
                <br />
                <p>{message}</p>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Add_Player_Inventory;
