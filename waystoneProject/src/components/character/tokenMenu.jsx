import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./token.css"
import { usePlayer } from "../../hooks/usePlayer";

export default function TokenMenu({ userId,playerId,campaignId, position, onClose }) {
  const menuRef = useRef();
  const menuWidth = 150;
  const cellSize = 80;
   const player = usePlayer(userId, campaignId, playerId);

  let left = position.x + cellSize + 5;
const top = position.y;

const viewportWidth = window.innerWidth;
if (left + menuWidth > viewportWidth) {
  left = position.x - menuWidth - 5;
}

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

if (!player) return null

  // Render menu in a portal
  return createPortal(
    <div
      ref={menuRef}
      className= "tokenMenu"
      style={{
  left,top
}}
      >
      <h3>{player.name}</h3>
      <p>HP: {player.hp}</p>
      <p>AC: {player.ac}</p>
      {/* Add more stats */}
    </div>,
    document.body 
  );
}
