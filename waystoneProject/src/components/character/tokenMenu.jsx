import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./token.css";
import { usePlayer,useUpdateHp, useEntity } from "../../hooks/usePlayerMap";
import { useInventory } from "../../hooks/useInventory";
import { useItems } from "../../hooks/useItems";
import { doc, deleteDoc} from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function TokenMenu({ userId, campaignId, position,posX, posY , mapId={mapId}, tokenId, onClose }) {
  const menuRef = useRef();
  const defaultWidth = 180;
  const expandedWidth = 400; // breder menu voor inventory
  const cellSize = 80;

  const playerData = usePlayer(userId, campaignId, tokenId);
  const entityData = useEntity(userId, campaignId, tokenId);
  const data = playerData || entityData || { HpCurrent: 0, HpMax: 0, ac: 0, tokenType: "player", name: "Loading..." };;
  if (!data) return null;

  const isDataLoaded = !!data;
  const isPlayer = data?.tokenType === "player";
  const isEntity = data?.tokenType === "entity";

  const updateHp = useUpdateHp(userId, campaignId, data?.tokenType, data?.id  );
  
  const inventories = useInventory(data.id, campaignId, userId, data.tokenType);
  

  const items = useItems(userId, campaignId);

  const [expandedItems, setExpandedItems] = useState({});
  const [showInventory, setShowInventory] = useState(false);

  const [showDamageField, setShowDamageField] = useState(false);
  const [damageAmount, setDamageAmount] = useState("");
  const [showHealField, setShowHealField] = useState(false);
  const [healAmount, setHealAmount] = useState("");
  const [activeField, setActiveField] = useState(null); // "damage" | "heal" | null
  
  
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

  if (!data) return null;

  const toggleItem = (slotKey) => {
    setExpandedItems(prev => ({ ...prev, [slotKey]: !prev[slotKey] }));
  };

  //deal damage
  const handleDamage = () => {
    const dmg = parseInt(damageAmount);
    if (isNaN(dmg) || dmg <= 0) return;

    // Bereken nieuwe HP
    const newHp = Math.max(0, data.HpCurrent - dmg);
    updateHp(newHp)

    setDamageAmount("");
    setShowDamageField(false);
  };
  //heal
  const handleHeal = () => {
    const heal = parseInt(healAmount);
    if (isNaN(heal) || heal <= 0) return;

    // Bereken nieuwe HP
    const newHp = Math.min(data.HpMax, data.HpCurrent + heal);
    updateHp(newHp)

    setHealAmount("");
    setShowHealField(false);
  };

  // Delete handler via x_y doc name
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

  return createPortal(
    <div ref={menuRef} className="tokenMenu" style={{ left, top, width: menuWidth }}>
      <h3>{data.name}</h3>
      <p>HP: {data.HpCurrent} / {data.HpMax}</p>
      <p>AC: {data.armorKlassen}</p>
      <p>Race: {data.tokenType}</p>

      <div style={{ display: "flex", gap: "10px", margin: "5px 0" }}>
        <button onClick={() => {setShowDamageField(prev => !prev); setShowHealField(false); }}> Damage </button>
        <button onClick={() => {setShowHealField(prev => !prev); setShowDamageField(false); }}> Heal </button>
      </div>

      <div style={{ marginTop: "5px", display: "flex", gap: "5px" }}>
        {showDamageField && (
          <>
            <input type="number" placeholder="Amount" value={damageAmount} onChange={e => setDamageAmount(e.target.value)} style={{ width: "60px" }} />
            <button onClick={handleDamage}>
              Confirm
            </button>
          </>
        )}
        {showHealField && (
          <>
            <input type="number" placeholder="Amount" value={healAmount} onChange={e => setHealAmount(e.target.value)} style={{ width: "60px" }}/>
            <button onClick={handleHeal}>
              Confirm
            </button>
          </>
        )}
      </div>

  


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

      <button onClick={handleDeleteToken}>remove from board</button>
    </div>,
    document.body
  );
}
