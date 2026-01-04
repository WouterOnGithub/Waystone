import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  const {campaignId} = useParams()
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mapId } = useParams();
  const isNewMap = !mapId;

  const fileInputRef = React.useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
  const [mapFile, setMapFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const SIZE_LIMITS = useMemo(
    () => ({
      minWidth: 320,
      minHeight: 220,
      maxWidth: 900,
      maxHeight: 650,
    }),
    []
  );

  // Load existing map when mapId is present
  useEffect(() => {
    if (!mapId || !user) return;

    // Try to load the saved map image from public/maps/{userId}/{mapId}
    // We check common extensions; the first one that exists wins
    const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const tryLoad = async () => {
      for (const ext of extensions) {
        const url = `/Main-Maps/${user.uid}/${mapId}${ext}`;
        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok) {
            setPreviewUrl(url);
            return;
          }
        } catch {
          // Continue
        }
      }
    };
    tryLoad();
  }, [mapId, user]);

  useEffect(() => {
    return () => {
      // Only revoke blob URLs, not static file URLs
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const openPopup = (Component, title) => {
    const popup = window.open("", title, "width=600,height=800");
    if (!popup) return;

    popup.document.title = title;

    // Copy existing styles to the popup so it looks consistent
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
    root.render(<Component />);

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
    if (!user) {
      setSaveMessage("You must be signed in to save your map.");
      return;
    }

    setSaving(true);
    setSaveMessage("");

    try 
    {
      const formData = new FormData();
      formData.append("userId", user.uid);
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
      setSaveMessage(`Map saved. URL: ${result.url}`);

      // Navigate to the saved map page (like Campaign does after save)
      if (isNewMap && result.id) {
        navigate(`/user/New_Campaign_Page_MAPBUILDER/${result.id}`);
      }
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
              <button id="button-green" onClick={() => openPopup(AddLocation, "Add Location")} type="button">Add Location</button>
              <button id="button-green">Show Location(s)</button>
            </div>
            {/* The add and show building/region buttons*/}
            <div>
              <button id="button-green" onClick={() => openPopup(AddBuildingRegion, "Add Building or Region")} type="button">Add Building / Region</button>
              <button id="button-green">Show Building(s) / Region(s)</button>
            </div>
            {/* The add and show event buttons*/}
            <div>
              <button id="button-green">Add Event</button>
              <button id="button-green">Show Event(s)</button>
            </div>
            {/* The add and show container buttons*/}
            <div>
              <button id="button-green" onClick={() => openPopup(AddContainer, "Add Container")} type="button">Add Container</button>
              <button id="button-green">Show Container(s)</button>
            </div>

            {/* The save and continue button */}
            <div className="campaign-actions">
              
              <button id="button-green" onClick={handleSaveMap} disabled={saving}>
                {saving ? "Saving..." : "Save and Continue"}
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
