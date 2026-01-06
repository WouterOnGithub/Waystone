import React, { useState } from "react";
import "./pages-css/Join_Session.css";

const JoinSession = () => {
  const [code, setCode] = useState("");

  const handleEnter = () => {
    if (code.trim() === "") {
      alert("Voer een geldige code in!");
      return;
    }
    console.log("Joining session with code:", code);
    // Hier kun je navigatie of API-call toevoegen
  };

  const handleBack = () => {
    console.log("Going back");
    // Hier kun je terug navigeren
  };

  return (
    <div className="join-session-container">
      <div className="join-session-box">
        <h2 className="join-session-question">Voer de sessiecode in:</h2>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Sessiecode"
          className="join-session-input"
        />
        <div className="join-session-buttons">
          <button onClick={handleEnter} className="join-session-enter">
            Enter
          </button>
          <button onClick={handleBack} className="join-session-back">
            Terug
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinSession;
