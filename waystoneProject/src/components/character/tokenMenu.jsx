import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./token.css"

export default function TokenMenu({ player, position, onClose }) {
  const menuRef = useRef();
  const menuWidth = 150;
  const cellSize = 50;

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
