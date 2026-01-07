import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./token.css";
import { usePlayer } from "../../hooks/usePlayerMap";
import { useInventory } from "../../hooks/useInventory";
import { useItems } from "../../hooks/useItems";

export default function TokenMenu({ userId, playerId, campaignId, position, onClose }) {
  const menuRef = useRef();
  const defaultWidth = 150;
  const expandedWidth = 400; // breder menu voor inventory
  const cellSize = 80;

  const player = usePlayer(userId, campaignId, playerId);
  const inventories = useInventory(playerId, campaignId, userId);
  const items = useItems(userId, campaignId);

  const [expandedItems, setExpandedItems] = useState({});
  const [showInventory, setShowInventory] = useState(false);

  let left = position.x + cellSize + 5;
  const top = position.y;
  const menuWidth = showInventory ? expandedWidth : defaultWidth;
  const viewportWidth = window.innerWidth;
  if (left + menuWidth > viewportWidth) left = position.x - menuWidth - 5;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!player) return null;

  const toggleItem = (slotKey) => {
    setExpandedItems(prev => ({ ...prev, [slotKey]: !prev[slotKey] }));
  };

  return createPortal(
    <div ref={menuRef} className="tokenMenu" style={{ left, top, width: menuWidth }}>
      <h3>{player.name}</h3>
      <p>HP: {player.HpCurrent} / {player.HpMax}</p>
      <p>AC: {player.ac}</p>
      <p>Race: {player.race}</p>

      <button onClick={() => setShowInventory(prev => !prev)} style={{ margin: "5px 0", padding: "5px 10px" }}>
        {showInventory ? "Sluit Inventory" : "Open Inventory"}
      </button>

      {showInventory && inventories.length > 0 && Object.keys(items).length > 0 && (
        <div className="inventorySection">
          {inventories.map(inv => (
            <div key={inv.docName} className="inventoryDoc">
              <h4>{inv.docName}</h4>
              {inv.slots.length > 0 ? (
                <ul className="inventoryList" style={{ listStyle: "none", padding: 0 }}>
                  {inv.slots.map(slot => {
                    const item = items[slot.ItemId];
                    if (!item) return <li key={slot.id}>Onbekend item</li>;

                    const slotKey = `${inv.docName}-${slot.id}-${slot.ItemId}`;

                    return (
                      <li key={slotKey} className="inventorySlot" style={{ border: "1px solid #ccc", marginBottom: "5px", padding: "5px" }}>
                        {/* Kaartje */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <strong>{item.Name} </strong> | Value: {item.Value} | Weight: {item.Weight} | Effects: {item.Effect}
                          </div>
                          <button onClick={() => toggleItem(slotKey)}>
                            {expandedItems[slotKey] ? "Hide Description" : "Show Description"}
                          </button>
                        </div>

                        {expandedItems[slotKey] && (
                          <div style={{ marginTop: "5px" }}>
                            {item.Description || "Geen beschrijving"}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>Geen items</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
}
