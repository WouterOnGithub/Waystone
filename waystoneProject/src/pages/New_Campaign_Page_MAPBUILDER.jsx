import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCampaign } from "../hooks/useCampaign";
import {
  getLocations,
  deleteLocation,
  getCampaign,
  updateCampaignInfo,
  getBuildingsRegions,
  deleteBuildingRegion,
} from "../api/userCampaigns";
import "./pages-css/CSS.css";
import "./pages-css/Main_Page.css";
import "./pages-css/New_Campaign_Page_CAMPAIGN.css";
import Footer from "../components/UI/Footer";
import Header from "../components/UI/Header";
import Sidebar from "../components/UI/Sidebar";
import AddLocation from "../components/popups/Add_Location";
import AddContainer from "../components/popups/Add_Container";
import AddBuildingRegion from "../components/popups/Add_Building_Region";

function New_Campaign_Page_MAPBUILDER() 
{
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
    // Generate unique window name to avoid conflicts
    const windowName = `${title.replace(/\s+/g, '_')}_${Date.now()}`;
    const popup = window.open("", windowName, "width=900,height=1000,scrollbars=yes,resizable=yes");
    if (!popup) {
        console.error("Popup blocked or failed to open");
        alert("Please allow popups for this site to open the form");
        return;
    }
    console.log("Popup opened successfully:", windowName);

    // Copy styles from the main document
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
    let styleContent = '';
    styles.forEach((node) => {
      if (node.tagName === 'STYLE') {
        styleContent += node.textContent;
      } else if (node.tagName === 'LINK' && node.href) {
        styleContent += `@import url('${node.href}');\n`;
      }
    });

    // Write the HTML structure directly with embedded styles
    popup.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <meta charset="utf-8">
          <style>
            /* CSS reset for popup only */
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { width: 100%; height: 100%; overflow: auto; }
            body { font-family: Arial, sans-serif; }
            
            /* Main application styles */
            ${styleContent}
          </style>
        </head>
        <body>
          <div id="popup-root" style="width: 100%; height: 100%;"></div>
        </body>
      </html>
    `);
    popup.document.close();

    // Wait a moment for the document to be ready
    setTimeout(() => {
      try {
        const container = popup.document.getElementById("popup-root");
        if (container) {
          console.log("Container found, rendering React component");
          const root = createRoot(container);
          root.render(
            <Component
              {...componentProps}
              baseUrl={window.location.origin}
            />
          );
          console.log("React component rendered successfully");
        } else {
          console.error("Container not found in popup");
        }
      } catch (error) {
        console.error("Error rendering React component in popup:", error);
      }
    }, 100);
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
    <div>

      <Sidebar />

      <div id="main">

        <Header title="New Campaign" />

        <div>

          {/* The buttons (campaign, mapbuilder, character)*/}
          <div id="campaign-tabs">

            {/* The campaign button */}
            <button id="campaign-tab" disabled={!campaignId}
                    onClick={() => navigate(`/user/New_Campaign_Page_CAMPAIGN/${campaignId}`)}>
              Campaign
            </button>

            {/* The map builder button */}
            <button id="campaign-tab-active" disabled={!campaignId}
                    onClick={() => navigate(`/user/New_Campaign_Page_MAPBUILDER/${campaignId}`)}>
              Map Builder
            </button>

            {/* The characters button */}
            <button id="campaign-tab" disabled={!campaignId}
                    onClick={() => navigate(`/user/New_Campaign_Page_CHARACTERS/${campaignId}`)}>
              Characters
            </button>

          </div>

          {/* The map builder buttons and uploads */}
          <div id="content">

            {/* The select template dropdown */}
            <div>
              <b>Templates</b>
              <div id="campaign-select">
                <select>
                  <option>Select template...</option>
                  {/* *Where the other templates would appear* */}
                </select>
              </div>
              <br />
            </div>

            {/* Upload Main Map */}
            <div>

              <b>Import Main Map</b>
              
              <div id="campaign-imgage-upload">
                {/* The image upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMapUpload}
                  style={{ display: "none" }}
                />

                {/* The browse button */}
                <button id="button-gray" type="button" onClick={handleBrowseClick} disabled={saving}>Browse</button>
                
                {/* Shows the file name or 'No file selected' */}
                <span>
                  {mapFile ? mapFile.name : "No file selected"}
                </span>
              </div>

            </div>

            {/* Map preview box */}
            <div
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
                  onLoad={handleImageLoad}
                />
              ) : (
                <i>( Preview )</i> /* ! Why is this here? ! */
              )}
            </div>

            <br />

            {/* The add and show buttons */}
            {/* The add and show location buttons*/}
            <b>Add Elements</b>
            <div>
              <button id="button-green" 
                      onClick={() =>
                          openPopup(AddLocation, "Add Location", {
                            campaignId,
                            userId,
                          })
                        }
                        type="button"
                >Add Location
              </button>
              <button
                id="button-green"
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
                {showLocations ? "Hide Location(s)" : "Show All Location(s)"} {/* The button */}
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

            {/* The add and show building/region buttons*/}
            <div>
              <button id="button-green"
                      onClick={() =>
                          openPopup(AddBuildingRegion, "Add Building or Region", {
                            campaignId,
                            userId,
                          })
                        }
                        type="button"
              >Add Building / Region
              </button>
              <button id="button-green"
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
              >{showBuildings ? "Hide Building(s) / Region(s)" : "Show All Building(s) / Region(s)"} {/* The button */}
              </button>
            </div>

            {showLocations && locations.length > 0 && (
              <div
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}
                  >
                    <div style={{ display: "flex", gap: "8px", width: "100%" }}>
                      <button
                        id="button-green"
                        type="button"
                        onClick={() =>
                          openPopup(AddLocation, "Edit Location", {
                            campaignId,
                            userId,
                            location: loc,
                          })
                        }
                      >
                        {`Edit ${loc.name || "Location"}`}
                      </button>
                      <button
                        type="button"
                        id="button-green"
                        onClick={async () => {
                          if (
                            !window.confirm(
                              `Delete Location "${loc.name || "Unnamed Location"}"?`
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
                        {`Delete ${loc.name || "Location"}`}
                      </button>
                    </div>
                    
                    {/* Show regions that belong to this location */}
                    {buildings.filter(building => building.locationId === loc.id).length > 0 && (
                      <div style={{ marginLeft: "20px", marginTop: "4px" }}>
                        <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                          Regions for {loc.name || "this location"}:
                        </div>
                        {buildings.filter(building => building.locationId === loc.id).map((building) => (
                          <div
                            key={building.id}
                            style={{ display: "flex", gap: "4px", marginBottom: "4px" }}
                          >
                            <button
                              id="button-green"
                              type="button"
                              style={{ fontSize: "12px", padding: "4px 8px" }}
                              onClick={() =>
                                openPopup(AddBuildingRegion, "Edit Building / Region", {
                                  campaignId,
                                  userId,
                                  building: building,
                                })
                              }
                            >
                              {`Edit ${building.name || "Region"}`}
                            </button>
                            <button
                              type="button"
                              id="button-green"
                              style={{ fontSize: "12px", padding: "4px 8px" }}
                              onClick={async () => {
                                if (
                                  !window.confirm(
                                    `Delete Building / Region "${building.name || "Unnamed"}"?`
                                  )
                                ) {
                                  return;
                                }
                                if (!userId || !campaignId) return;
                                const ok = await deleteBuildingRegion(
                                  userId,
                                  campaignId,
                                  building.id
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
                              {`Delete ${building.name || "Region"}`}
                            </button>
                          </div>
                        ))}
                        <button
                          id="button-green"
                          type="button"
                          style={{ fontSize: "12px", padding: "4px 8px", marginTop: "4px" }}
                          onClick={() =>
                            openPopup(AddBuildingRegion, "Add Region to Location", {
                              campaignId,
                              userId,
                              locationId: loc.id,
                            })
                          }
                        >
                          + Add Region to {loc.name || "This Location"}
                        </button>
                      </div>
                    )}
                    
                    {/* Add region button for locations with no regions */}
                    {buildings.filter(building => building.locationId === loc.id).length === 0 && (
                      <button
                        id="button-green"
                        type="button"
                        style={{ fontSize: "12px", padding: "4px 8px", marginLeft: "20px", marginTop: "4px" }}
                        onClick={() =>
                          openPopup(AddBuildingRegion, "Add Region to Location", {
                            campaignId,
                            userId,
                            locationId: loc.id,
                          })
                        }
                      >
                        + Add Region to {loc.name || "This Location"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showBuildings && buildings.length > 0 && (
              <div
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
                      id="button-green"
                      type="button"
                      onClick={() =>
                        openPopup(AddBuildingRegion, "Edit Building(s) / Region(s)", {
                          campaignId,
                          userId,
                          building: bld,
                        })
                      }
                    >
                      {`Edit ${bld.name || "Building(s) / Region(s)"}`}
                    </button>
                    <button
                      type="button"
                      id="button-green"
                      onClick={async () => {
                        if (
                          !window.confirm(
                            `Delete Building / Region "${bld.name || "Unnamed"}"?`
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
                      {`Delete ${bld.name || "Building(s) / Region(s)"}`}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* The add and show event buttons*/}
            <div>
              <button id="button-green">Add Event</button>
              <button id="button-green">Show All Event(s)</button>
            </div>

            {/* The add and show container buttons*/}
            <div>
              <button id="button-green"
                      onClick={() => openPopup(AddContainer, "Add Container")}
                      type="button"
              >
                Add Container
              </button>
              <button id="button-green">Show All Container(s)</button>
            </div>

            {/* The save and continue button */}
            <div className="campaign-actions">
              
              <button id="button-green" onClick={handleSaveMap} disabled={saving}>
                {saving ? "Saving..." : "Save and Continue"}
              </button>
              <button 
                id="button-gray"
                onClick={() => navigate(`/user/Map_Main/${campaignId}`)}
                disabled={!campaignId}
              >
                Enter
              </button>
              {saveMessage && (
                <div id="button-green">{saveMessage}</div>
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
