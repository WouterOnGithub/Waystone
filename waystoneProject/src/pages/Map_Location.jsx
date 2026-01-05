import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./pages-css/Campaign_Map.css";
import { useAuth } from "../context/AuthContext";
import { getCampaign, getBuildingsRegions, getLocations } from "../api/userCampaigns";

function Map_Location() {
  const { campaignId, locationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid || null;
  
  const [regionsOpen, setRegionsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [campaignRegions, setCampaignRegions] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load campaign data and location when component mounts or campaignId/locationId changes
  useEffect(() => {
    const loadData = async () => {
      if (!campaignId || !userId) {
        setLoading(false);
        return;
      }

      try {
        const campaignData = await getCampaign(userId, campaignId);
        setCampaign(campaignData);
        
        // Load regions/buildings for this campaign
        const regionsList = await getBuildingsRegions(userId, campaignId);
        setCampaignRegions(regionsList || []);
        
        // Load specific location if locationId is provided
        if (locationId) {
          const locationsList = await getLocations(userId, campaignId);
          const foundLocation = locationsList.find(loc => loc.id === locationId);
          setLocation(foundLocation || null);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [campaignId, locationId, userId]);

  const toggleRegions = () => {
    setRegionsOpen(!regionsOpen);
    if (settingsOpen) setSettingsOpen(false);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
    if (regionsOpen) setRegionsOpen(false);
  };

  const selectRegion = (region) => {
    setSelectedRegion(region);
    setRegionsOpen(false);
  };

  return (
    <div className="campaign-page">
      

          <div className="map-container">

            {/* Settings Button */}
            <button className="map-settings-btn" onClick={toggleSettings}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6m0-6h6m-6 0H6" />
                <path d="M19.07 4.93l-4.24 4.24m0 5.66l4.24 4.24m-14.14 0l4.24-4.24m0-5.66L4.93 4.93" />
              </svg>
            </button>

            {/* Settings Menu */}
            {settingsOpen && (
              <div className="map-settings-menu">
                <h3>Settings</h3>
                <ul>
                  <li>Edit Map</li>
                  <li>Add Location</li>
                  <li>Grid Settings</li>
                  <li>Upload Background</li>
                  <li>Reset View</li>
                </ul>
              </div>
            )}

            {/* Regions Dropdown */}
            <div className="map-locations-dropdown">
              <button
                className={`locations-toggle ${regionsOpen ? "open" : ""}`}
                onClick={toggleRegions}
              >
                Regions
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {regionsOpen && (
                <div className="locations-buttons-container">
                  {campaignRegions.filter(region => region.locationId === locationId).length > 0 ? (
                    campaignRegions.filter(region => region.locationId === locationId).map((region) => (
                      <button
                        key={region.id}
                        className="location-button"
                        onClick={() => navigate(`/user/Map_Building_Region/${campaignId}/${region.id}`)}
                      >
                        {region.name || 'Unnamed Region'}
                      </button>
                    ))
                  ) : (
                    <div className="no-locations-message">
                      No regions added to this location yet
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Map Display */}
            <div className="map-display">
              {loading ? (
                <div className="map-placeholder">
                  <p>Loading map...</p>
                </div>
              ) : location?.imageUrl ? (
                <img
                  src={location.imageUrl}
                  alt={`Location: ${location.name || 'Unnamed Location'}`}
                  className="map-image"
                />
              ) : locationId ? (
                <div className="map-placeholder">
                  <p>No image uploaded for this location</p>
                  <small>Add an image in the Map Builder to see it here</small>
                </div>
              ) : campaign?.mainMapUrl ? (
                <img
                  src={campaign.mainMapUrl}
                  alt="Campaign Map"
                  className="map-image"
                />
              ) : (
                <div className="map-placeholder">
                  <p>No map uploaded yet</p>
                  <small>Upload a map in the Map Builder to see it here</small>
                </div>
              )}

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
            </div>
          </div>
        </div>
  );
}

export default Map_Location;