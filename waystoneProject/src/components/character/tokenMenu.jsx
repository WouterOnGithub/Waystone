import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./token.css";
import { usePlayer, useUpdateHp, useEntity } from "../../hooks/usePlayerMap";
import { useInventory } from "../../hooks/useInventory";
import { useItems } from "../../hooks/useItems";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useContainer } from "../../hooks/useContainerMap";
import Add_Container from "../popups/Add_Container"; 
import Add_Player_Inventory from "../popups/Add_Player_Inventory";


export default function TokenMenu({ userId, campaignId, position, posX, posY, mapId, tokenId, onClose }) {
  const menuRef = useRef();
  const defaultWidth = 180;
  const expandedWidth = 400;
  const cellSize = 80;

  const playerData = usePlayer(userId, campaignId, tokenId);
  const entityData = useEntity(userId, campaignId, tokenId);
  const containerData = useContainer(userId, campaignId, tokenId);

  const data = playerData || entityData || containerData || { name: "Loading...", tokenType: "unknown" };
  const isContainer = data?.tokenType === "container";

  const updateHp = useUpdateHp(userId, campaignId, data?.tokenType, data?.id);
  const inventories = useInventory(data.id, campaignId, userId, data.tokenType);
  const items = useItems(userId, campaignId);

  const [expandedItems, setExpandedItems] = useState({});
  const [showInventory, setShowInventory] = useState(false);
  const [showAddContainer, setShowAddContainer] = useState(false); // popup state

  // Damage / Heal states
  const [showDamageField, setShowDamageField] = useState(false);
  const [damageAmount, setDamageAmount] = useState("");
  const [showHealField, setShowHealField] = useState(false);
  const [healAmount, setHealAmount] = useState("");

  // Calculate position relative to viewport
  const menuElement = document.querySelector('.battlemap-wrapper');
  const mapRect = menuElement ? menuElement.getBoundingClientRect() : { left: 0, top: 0 };

  //player inventory state
  const [showAddPlayerInventory, setShowAddPlayerInventory] = useState(false);
  
  let left = mapRect.left + position.x + cellSize + 5;
  const top = mapRect.top + position.y;
  const menuWidth = showInventory ? expandedWidth : defaultWidth;
  const viewportWidth = window.innerWidth;
  if (left + menuWidth > viewportWidth) left = mapRect.left + position.x - menuWidth - 5;

  console.log("TokenMenu data:", data);
  console.log("Inventories raw:", inventories);
  console.log("Items collection:", items);

  // Click outside sluit menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Inventory mapping
  const handleGetInventory = () => {
    if (!inventories || inventories.length === 0) return [];

    // alle slots uit alle inventory docs flattenen
    const allSlots = inventories.flatMap(doc => doc.slots);

    return allSlots
      .filter(slot => slot.ItemID && slot.ItemID !== "" && slot.Amount > 0)
      .map(slot => ({
        ...items[slot.ItemID],  // haalt de item details uit useItems
        ItemID: slot.ItemID,
        Amount: slot.Amount,
        slotKey: slot.id + "-" + slot.ItemID, // uniek key
      }));
  };



  const handleGetContainerContents = () => {
    if (!data.items) return [];

    return data.items.map((slot, index) => ({
      ...items[slot.itemId],
      slotKey: `${data.id}-${index}-${slot.itemId}`,
      ItemID: slot.itemId,
      Amount: slot.quantity,
    }));
  };

  const displayItems = isContainer ? handleGetContainerContents() : handleGetInventory();
  console.log("Display items (filtered):", displayItems);

  // Damage / Heal handlers
  const handleDamage = () => {
    const dmg = parseInt(damageAmount);
    if (isNaN(dmg) || dmg <= 0) return;
    const newHp = Math.max(0, data.HpCurrent - dmg);
    updateHp(newHp);
    setDamageAmount("");
    setShowDamageField(false);
  };

  const handleHeal = () => {
    const heal = parseInt(healAmount);
    if (isNaN(heal) || heal <= 0) return;
    const newHp = Math.min(data.HpMax, data.HpCurrent + heal);
    updateHp(newHp);
    setHealAmount("");
    setShowHealField(false);
  };

  // Delete token van board
  const handleDeleteToken = async () => {
    if (!mapId || !position) return;
    const docName = `${posX}_${posY}`;
    const cellRef = doc(db, "Users", userId, "Campaigns", campaignId, "Maps", mapId, "Cells", docName);
    try {
      await deleteDoc(cellRef);
      onClose();
    } catch (err) {
      console.error("Error deleting cell:", err);
    }
  };

  // Callback voor refresh na container toevoegen
  const handleContainerSaved = () => {
    setShowAddContainer(false);
    // evt. force refresh containerData of inventories ophalen
  };

  return createPortal(
    <div ref={menuRef} className="tokenMenu" style={{ left, top, width: menuWidth }}>
      <h3>{data.name}</h3>

      {!isContainer && (
        <>
          <p>HP: {data.HpCurrent} / {data.HpMax}</p>
          <p>AC: {data.armorKlassen}</p>
          <p>Race: {data.tokenType}</p>

          <div style={{ display: "flex" }}>
            <button id="delete-button" onClick={() => { setShowDamageField(prev => !prev); setShowHealField(false); }}>Damage</button>
            <button id="button-green" onClick={() => { setShowHealField(prev => !prev); setShowDamageField(false); }}>Heal</button>
          </div>

          <div style={{ marginTop: "5px", display: "flex", gap: "5px" }}>
            {showDamageField && (
              <>
                <input type="number" placeholder="Amount" value={damageAmount} onChange={e => setDamageAmount(e.target.value)} style={{ width: "60px" }} />
                <button id="button-green" onClick={handleDamage}>Confirm</button>
              </>
            )}
            {showHealField && (
              <>
                <input type="number" placeholder="Amount" value={healAmount} onChange={e => setHealAmount(e.target.value)} style={{ width: "60px" }} />
                <button id="button-green" onClick={handleHeal}>Confirm</button>
              </>
            )}
          </div>
        </>
      )}

      <button id="button-blue" onClick={() => setShowInventory(prev => !prev)} style={{ margin: "5px 0", padding: "5px 10px" }}>
        {showInventory ? "Sluit Inventory" : "Open Inventory"}
      </button>

      {!isContainer && showInventory && (
        <button
          onClick={() => setShowAddPlayerInventory(true)}
          style={{ margin: "5px 0", padding: "5px 10px" }}
        >
          Add Item
        </button>
      )}


      {isContainer && showInventory && (
        <>
          <button
            onClick={() => setShowAddContainer(true)}
            style={{ margin: "5px 0", padding: "5px 10px" }}
          >
            Add Items
          </button>

          {showAddContainer && (
            <Add_Container
              onClose={() => setShowAddContainer(false)}
              campaignId={campaignId}
              container={data} // bestaande container
              onContainerSaved={handleContainerSaved}
            />
          )}
        </>
      )}

      {showInventory && displayItems.length > 0 && (
        <div className="inventorySection">
          {displayItems.map(slot => (
            <div key={slot.slotKey} className="inventorySlot" style={{ border: "1px solid #ccc", marginBottom: "5px", padding: "5px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{slot.name}</strong> x{slot.Amount} | Value: {slot.value} | Weight: {slot.weight}
                </div>
                <button onClick={() => setExpandedItems(prev => ({ ...prev, [slot.slotKey]: !prev[slot.slotKey] }))}>
                  {expandedItems[slot.slotKey] ? "Hide Description" : "Show Description"}
                </button>
              </div>
              {expandedItems[slot.slotKey] && (
                <div style={{ marginTop: "5px" }}>
                  {slot.description || "Geen beschrijving"}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddPlayerInventory && (
        <Add_Player_Inventory
          onClose={() => setShowAddPlayerInventory(false)}
          userId={userId}
          campaignId={campaignId}
          playerId={data.id}
          onInventoryUpdated={() => {
            setShowAddPlayerInventory(false);
            // eventueel inventories refreshen hier
          }}
        />
      )}

      <button id="delete-button" onClick={handleDeleteToken}>remove from board</button>
      <button id="button-blue" onClick={onClose}>close</button>
    </div>,
    document.body
  );
}
