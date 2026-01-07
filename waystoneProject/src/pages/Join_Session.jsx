import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./pages-css/Join_Session.css";
import { getSession, cleanupInactiveSessions } from "../api/userCampaigns";
import { useAuth } from "../context/AuthContext";

const Join_Session = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid || null;

  useEffect(() => {
    // Clear error when code changes
    if (error) setError("");
  }, [code]);

  const handleEnter = async () => {
    if (code.trim() === "") {
      setError("Please enter a valid code!");
      return;
    }

    if (code.length < 4) {
      setError("The code must be at least 4 characters long!");
      return;
    }

    // Check if user is authenticated
    if (!userId) {
      setError("You must be logged in to join a session.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Clean up inactive sessions before validating
      await cleanupInactiveSessions();
      
      // Validate session code in Firestore
      const sessionCodeUpper = code.trim().toUpperCase();
      console.log("Looking for session code:", sessionCodeUpper);
      
      const sessionData = await getSession(sessionCodeUpper);
      console.log("Session data found:", sessionData);
      
      if (!sessionData) {
        console.log("Session not found - showing invalid code error");
        setError("Please enter a valid session code.");
        return;
      }

      console.log("Session found, checking conditions...");
      console.log("Session isActive:", sessionData.isActive);
      console.log("Session userId:", sessionData.userId);
      console.log("Current userId:", userId);

      // Check if session is active
      if (sessionData.isActive === false) {
        console.log("Session is inactive - showing inactive error");
        setError("This session is no longer active. Ask the dungeon master to start a new session.");
        return;
      }

      // Check if current user is the session creator
      if (sessionData.userId !== userId) {
        console.log("User ID mismatch - showing ownership error");
        setError("You can only join your own sessions. This session belongs to another user.");
        return;
      }

      console.log("All checks passed - navigating to session");
      console.log("Joining session with code:", code, "Session data:", sessionData);
      
      // Navigate to Active_Session with the session code
      navigate(`/user/Active_Session/${sessionCodeUpper}`);
      
    } catch (err) {
      setError("An error occurred. Please try again.");
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
          placeholder="Session Code"
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
