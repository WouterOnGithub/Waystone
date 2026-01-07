import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./pages-css/Campaign_Map.css";
import { getSession } from "../api/userCampaigns";

function Active_Session() {
  const { sessionCode } = useParams();
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load session data when component mounts
  useEffect(() => {
    const loadSession = async () => {
      if (!sessionCode) {
        setError("No session code provided");
        setLoading(false);
        return;
      }

      try {
        const data = await getSession(sessionCode);
        
        if (!data) {
          setError("Invalid session code or session has expired");
        } else {
          setSessionData(data);
        }
      } catch (error) {
        console.error("Failed to load session:", error);
        setError("Failed to load session data");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionCode]);

  const handleBack = () => {
    navigate("/user/Join_Session");
  };

  return (
    <div className="full-page">
      <div className="campaign-page">
        <div className="map-container">
          {/* Top Controls */}
          <div className="map-top-controls">
            {/* Back Button */}
            <button 
              className="map-back-btn" 
              onClick={handleBack}
              title="Go back to session join"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>

          {/* Map Display */}
          <div className="map-display">
            {loading ? (
              <div className="map-placeholder">
                <p>Loading session...</p>
              </div>
            ) : error ? (
              <div className="map-placeholder">
                <p style={{ color: 'red' }}>{error}</p>
                <button 
                  onClick={handleBack}
                  className="back-button"
                  style={{ marginTop: '20px', padding: '10px 20px' }}
                >
                  Back to Join Session
                </button>
              </div>
            ) : sessionData?.mainMapUrl ? (
              <img
                src={sessionData.mainMapUrl}
                alt="Campaign Map"
                className="map-image"
              />
            ) : (
              <div className="map-placeholder">
                <p>No map available for this session</p>
                <small>The dungeon master hasn't uploaded a map yet</small>
              </div>
            )}

            {/* Compass */}
            {!loading && !error && sessionData?.mainMapUrl && (
              <div className="map-compass">
                <svg width="80" height="80" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#2e3d08" strokeWidth="2" />
                  <polygon points="50,15 55,45 50,50 45,45" fill="#2e3d08" />
                  <polygon points="50,85 55,55 50,50 45,55" fill="#5b701d" />
                  <text x="50" y="12" textAnchor="middle">N</text>
                  <text x="50" y="92" textAnchor="middle">S</text>
                  <text x="88" y="54" textAnchor="middle">E</text>
                  <text x="12" y="54" textAnchor="middle">W</text>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Active_Session;
