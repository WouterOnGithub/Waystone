import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pages-css/Join_Session.css";
import { getSession } from "../api/userCampaigns";

const Join_Session = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Clear error when code changes
    if (error) setError("");
  }, [code, error]);

  const handleEnter = async () => {
    if (code.trim() === "") {
      setError("Voer een geldige code in!");
      return;
    }

    if (code.length < 4) {
      setError("De code moet minimaal 4 karakters lang zijn!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Validate session code in Firestore
      const sessionData = await getSession(code.trim().toUpperCase());
      
      if (!sessionData) {
        setError("Ongeldige sessiecode. Controleer de code en probeer het opnieuw.");
        return;
      }

      console.log("Joining session with code:", code, "Session data:", sessionData);
      
      // Navigate to Active_Session with the session code
      navigate(`/user/Active_Session/${code.trim().toUpperCase()}`);
      
    } catch (err) {
      setError("Er is een fout opgetreden. Probeer het opnieuw.");
      console.error("Error joining session:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEnter();
    }
  };

  return (
    <div className="join-session-container">
      <div className="join-session-box">
        <h2 className="join-session-question">Enter your session code:</h2>
        
        {error && (
          <div className="join-session-error">
            {error}
          </div>
        )}
        
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          placeholder="Sessiecode"
          className="join-session-input"
          disabled={isLoading}
          maxLength={20}
          autoFocus
        />
        
        <div className="join-session-buttons">
          <button 
            onClick={handleEnter} 
            className="join-session-enter"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="join-session-spinner"></span>
            ) : (
              'Enter'
            )}
          </button>
          
          <button 
            onClick={handleBack} 
            className="join-session-back"
            disabled={isLoading}
          >
            Back
          </button>
        </div>
        
        <div className="join-session-help">
          <p>Enter the unique code your dungeon master sent you</p>
        </div>
      </div>
    </div>
  );
};

export default Join_Session;
