import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { useNavigate, useParams } from "react-router-dom";
import "./pages-css/CSS.css";
import "./pages-css/Main_Page.css";
import "./pages-css/New_Campaign_Page_CAMPAIGN.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";
import AddLocation from "../components/popups/Add_Location";
import AddContainer from "../components/popups/Add_Container";
import AddBuildingRegion from "../components/popups/Add_Building_Region";
import { useAuth } from "../context/AuthContext";
import {
  getLocations,
  deleteLocation,
  getCampaign,
  updateCampaignInfo,
  getBuildingsRegions,
  deleteBuildingRegion,
} from "../api/userCampaigns";
import { useCampaign } from "../hooks/useCampaign";

function New_Campaign_Page_MAPBUILDER() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid || null;
  
  const isNewCampaign = !campaignId;
  const { data, loading, error, setData } = useCampaign(
    isNewCampaign? null : userId, 
    isNewCampaign? null : campaignId
  );

  const fileInputRef = React.useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
  const [mapFile, setMapFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [locations, setLocations] = useState([]);
  const [showLocations, setShowLocations] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [showBuildings, setShowBuildings] = useState(false);

  const SIZE_LIMITS = useMemo(
    () => ({
      minWidth: 320,
      minHeight: 220,
      maxWidth: 900,
      maxHeight: 650,
    }),
    []
  );

  // Load existing map when a campaignId is present
  useEffect(() => {
    if (!campaignId || !userId) return;

    const loadExisting = async () => {
      const cacheBust = Date.now();

      // 1) Prefer the URL stored on the campaign document in Firestore
      try {
        const campaign = await getCampaign(userId, campaignId);
        const storedUrl = campaign?.mainMapUrl || null;
        if (storedUrl) {
          const url = `${storedUrl}?v=${cacheBust}`;
          try {
            const res = await fetch(url, { method: "HEAD" });
            if (res.ok) {
              setPreviewUrl(url);
              return;
            }
          } catch {
            // fall through to other strategies
          }
        }
      } catch (err) {
        console.error("Failed to load campaign main map from Firestore:", err);
      }

      // 2) Fallback: explicit URL stored in localStorage from older versions
      const storageKey = `campaign-main-map-${campaignId}`;
      try {
        const storedUrl = window.localStorage.getItem(storageKey);
        if (storedUrl) {
          const url = `${storedUrl}?v=${cacheBust}`;
          try {
            const res = await fetch(url, { method: "HEAD" });
            if (res.ok) {
              setPreviewUrl(url);
              return;
            }
          } catch {
            // fall through to extension probing
          }
        }
      } catch {
        // localStorage not available, continue with probing
      }

      // 3) Fallback for legacy campaigns that stored maps in per-campaign subfolders
      const extensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".JPG",
        ".JPEG",
        ".PNG",
        ".GIF",
        ".WEBP",
      ];
      for (const ext of extensions) {
        const url = `/Main-Maps/${campaignId}/main${ext}?v=${cacheBust}`;
        try {
          const res = await fetch(url, { method: "HEAD" });
          if (res.ok) {
            setPreviewUrl(url);
            return;
          }
        } catch {
          // continue
        }
      }
    };

    loadExisting();
  }, [campaignId, userId]);

  useEffect(() => {
    return () => {
      // Only revoke blob URLs, not static file URLs
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const openPopup = (Component, title, componentProps = {}) => {
    const popup = window.open("", title, "width=600,height=800");
    if (!popup) return;

    popup.document.title = title;

    // copy existing styles to the popup so it looks consistent
    const styles = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]')
    );
    styles.forEach((node) => {
      popup.document.head.appendChild(node.cloneNode(true));
    });

    const container = popup.document.createElement("div");
    container.id = "popup-root";
    popup.document.body.appendChild(container);

    const root = createRoot(container);
    root.render(
      <Component
        {...componentProps}
        baseUrl={window.location.origin}
      />
    );

    popup.addEventListener("beforeunload", () => root.unmount());
  };

  const handleMapUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMapFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  // Load locations for this campaign (initially and whenever window regains focus)
  useEffect(() => {
    const loadLocations = async () => {
      if (!userId || !campaignId) return;
      try {
        const list = await getLocations(userId, campaignId);
        setLocations(list || []);
      } catch (err) {
        console.error("Failed to load locations:", err);
      }
    };

    // Initial load
    loadLocations();

    // Reload when the window gets focus again (e.g. after closing popup)
    const handleFocus = () => {
      loadLocations();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [userId, campaignId]);

  // Load buildings/regions for this campaign
  useEffect(() => {
    const loadBuildings = async () => {
      if (!userId || !campaignId) return;
      try {
        const list = await getBuildingsRegions(userId, campaignId);
        setBuildings(list || []);
      } catch (err) {
        console.error("Failed to load buildings/regions:", err);
      }
    };

    loadBuildings();

    const handleFocus = () => {
      loadBuildings();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [userId, campaignId]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    const { minWidth, minHeight, maxWidth, maxHeight } = SIZE_LIMITS;

    // Determine scale needed to satisfy min size (may scale up) and max size (may scale down)
    const scaleUp = Math.max(minWidth / naturalWidth, minHeight / naturalHeight, 1);
    const scaleDown = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, Number.POSITIVE_INFINITY);
    const scale = Math.min(scaleDown, Math.max(scaleUp, 1));

    const width = Math.round(naturalWidth * scale);
    const height = Math.round(naturalHeight * scale);

    setPreviewSize({ width, height });
  };

  const handleSaveMap = async () => {
    if (!mapFile) {
      setSaveMessage("Please upload a map before saving.");
      return;
    }
    if (!userId) {
      setSaveMessage("You must be signed in to save your map.");
      return;
    }

    setSaving(true);
    setSaveMessage("");

    try {
      const formData = new FormData();
      if (!campaignId) {
        setSaveMessage("No campaign selected.");
        setSaving(false);
        return;
      }
      // Use campaignId so the backend can tag files per campaign when needed.
      formData.append("campaignId", campaignId);
      formData.append("map", mapFile);

      const response = await fetch("/api/upload-map", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Upload failed");
      }

      const result = await response.json();
      setSaveMessage(`Map saved.`);

      // Persist the main map URL on the campaign document in Firestore so it
      // can be reliably loaded later, instead of reconstructing a file path.
      if (campaignId && userId && result?.url) {
        try {
          await updateCampaignInfo(userId, campaignId, {
            mainMapUrl: result.url,
            lastUpdatedAt: new Date().toISOString(),
          });

          // Also keep a localStorage copy as a secondary fallback for older flows.
          try {
            window.localStorage.setItem(
              `campaign-main-map-${campaignId}`,
              result.url
            );
          } catch {
            // ignore localStorage failures
          }
        } catch (err) {
          console.error("Failed to save main map URL to campaign:", err);
        }
      }
      // Important: keep using the local blob preview right after save.
      // The file write on disk may not be immediately visible to the dev server,
      // so switching to the saved URL here can momentarily 404 and "lose" the image.
    } catch (err) {
      setSaveMessage(err?.message || "Failed to save map.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="campaign-page">
      <Sidebar />

      <div className="campaign-main">
        <Header
          title={
            isNewCampaign
              ? "New Campaign"
              : data?.name
              ? `${data.name}`
              : "Campaign"
          }
        />
        <div className="campaign-body">
          <div className="campaign-tabs">
            <button 
              className="campaign-tab"
              disabled={!campaignId}
              onClick={() => navigate(`/user/New_Campaign_Page_CAMPAIGN/${campaignId}`)}
            >
              Campaign
            </button>

            <button
              className="campaign-tab active"
              disabled={!campaignId}
              onClick={() => navigate(`/user/New_Campaign_Page_MAPBUILDER/${campaignId}`)}
            >
              Map Builder
            </button>

            <button
              className="campaign-tab"
              disabled={!campaignId}
              onClick={() => navigate(`/user/New_Campaign_Page_CHARACTERS/${campaignId}`)}
            >
              Characters
            </button>
          </div>

          {/* MAIN MAP BUILDER CARD */}
          <div className="campaign-card">

            {/* Templates Dropdown */}
            <div className="campaign-field">
              <label className="campaign-label">Templates</label>
              <div className="mapbuilder-row">
                <select className="mapbuilder-select">
                  <option>Select template...</option>
                </select>
              </div>
            </div>

            {/* Upload Main Map */}
            <div className="campaign-field">
              <label className="campaign-label">Import Main Map</label>
              <div className="mapbuilder-row">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="mapbuilder-file"
                  onChange={handleMapUpload}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  className="mapbuilder-browse"
                  onClick={handleBrowseClick}
                  disabled={saving}
                >
                  Browse
                </button>
                <span className="mapbuilder-file-label">
                  {mapFile ? mapFile.name : "No file selected"}
                </span>
              </div>
            </div>

            {/* Map preview box */}
            <div
              className="mapbuilder-preview"
              style={
                previewSize.width && previewSize.height
                  ? { width: `${previewSize.width}px`, height: `${previewSize.height}px` }
                  : undefined
              }
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Map preview"
                  className="mapbuilder-preview-img"
                  onLoad={handleImageLoad}
                />
              ) : (
                <div className="mapbuilder-preview-icon">preview</div>
              )}
            </div>

            {/* Add buttons */}
            <div className="mapbuilder-button-row">
              <button
                className="campaign-pill"
                onClick={() =>
                  openPopup(AddLocation, "Add Location", {
                    campaignId,
                    userId,
                  })
                }
                type="button"
              >
                Add Location
              </button>
              <button
                className="campaign-pill"
                type="button"
                onClick={async () => {
                  const next = !showLocations;
                  setShowLocations(next);
                  if (next && userId && campaignId) {
                    try {
                      const list = await getLocations(userId, campaignId);
                      setLocations(list || []);
                    } catch (err) {
                      console.error("Failed to load locations:", err);
                    }
                  }
                }}
                disabled={!campaignId || !userId}
              >
                {showLocations ? "Hide locations" : "Show all locations"}
              </button>
            </div>

            {showLocations && locations.length > 0 && (
              <div
                className="mapbuilder-button-row"
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    style={{ display: "flex", gap: "8px", width: "100%" }}
                  >
                    <button
                      className="campaign-pill"
                      type="button"
                      onClick={() =>
                        openPopup(AddLocation, "Edit Location", {
                          campaignId,
                          userId,
                          location: loc,
                        })
                      }
                    >
                      {`Edit ${loc.name || "location"}`}
                    </button>
                    <button
                      type="button"
                      className="campaign-pill"
                      onClick={async () => {
                        if (
                          !window.confirm(
                            `Delete location "${loc.name || "Unnamed location"}"?`
                          )
                        ) {
                          return;
                        }
                        if (!userId || !campaignId) return;
                        const ok = await deleteLocation(
                          userId,
                          campaignId,
                          loc.id
                        );
                        if (ok) {
                          const list = await getLocations(userId, campaignId);
                          setLocations(list || []);
                        }
                      }}
                    >
                      {`Delete ${loc.name || "location"}`}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Buildings / Regions */}
            <div className="mapbuilder-button-row">
              <button
                className="campaign-pill"
                onClick={() =>
                  openPopup(AddBuildingRegion, "Add Building or Region", {
                    campaignId,
                    userId,
                  })
                }
                type="button"
              >
                Add Building/Region
              </button>
              <button
                className="campaign-pill"
                type="button"
                onClick={async () => {
                  const next = !showBuildings;
                  setShowBuildings(next);
                  if (next && userId && campaignId) {
                    try {
                      const list = await getBuildingsRegions(userId, campaignId);
                      setBuildings(list || []);
                    } catch (err) {
                      console.error("Failed to load buildings/regions:", err);
                    }
                  }
                }}
                disabled={!campaignId || !userId}
              >
                {showBuildings ? "Hide buildings/regions" : "Show all buildings/regions"}
              </button>
            </div>

            {showBuildings && buildings.length > 0 && (
              <div
                className="mapbuilder-button-row"
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                {buildings.map((bld) => (
                  <div
                    key={bld.id}
                    style={{ display: "flex", gap: "8px", width: "100%" }}
                  >
                    <button
                      className="campaign-pill"
                      type="button"
                      onClick={() =>
                        openPopup(AddBuildingRegion, "Edit Building/Region", {
                          campaignId,
                          userId,
                          building: bld,
                        })
                      }
                    >
                      {`Edit ${bld.name || "building/region"}`}
                    </button>
                    <button
                      type="button"
                      className="campaign-pill"
                      onClick={async () => {
                        if (
                          !window.confirm(
                            `Delete building/region "${bld.name || "Unnamed"}"?`
                          )
                        ) {
                          return;
                        }
                        if (!userId || !campaignId) return;
                        const ok = await deleteBuildingRegion(
                          userId,
                          campaignId,
                          bld.id
                        );
                        if (ok) {
                          const list = await getBuildingsRegions(
                            userId,
                            campaignId
                          );
                          setBuildings(list || []);
                        }
                      }}
                    >
                      {`Delete ${bld.name || "building/region"}`}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mapbuilder-button-row">
              <button className="campaign-pill">Add Event</button>
              <button className="campaign-pill">Show all events</button>
            </div>

            <div className="mapbuilder-button-row">
              <button
                className="campaign-pill"
                onClick={() => openPopup(AddContainer, "Add Container")}
                type="button"
              >
                Add Container
              </button>
              <button className="campaign-pill">Show all containers</button>
            </div>

            {/* Save */}
            <div className="campaign-actions">
              <button
                className="campaign-save"
                onClick={handleSaveMap}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save and continue"}
              </button>
              <button 
                className="campaign-enter"
                onClick={() => navigate(`/user/Map_Main/${campaignId}`)}
                disabled={!campaignId}
              >
                Enter
              </button>
              {saveMessage && (
                <div className="campaign-save-message">{saveMessage}</div>
              )}
            </div>

          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default New_Campaign_Page_MAPBUILDER;
