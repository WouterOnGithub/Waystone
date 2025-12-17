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
import Waystone_Logo from "../assets/PlaceholderImage.jpg";
import UploadIMG_Logo from "../assets/PlaceholderImage.jpg";
import Required_Logo from "../assets/Required_Logo.webp";
import Delete_Logo from "../assets/Delete_Logo.webp";
import Add_Logo from "../assets/Add_Logo.webp";
import Placeholder from "../assets/PlaceholderImage.jpg";
import { useAuth } from "../context/AuthContext";

function New_Campaign_Page_MAPBUILDER() {
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

    // Try to load the saved map image from public/maps/{userId}/{mapId}.*
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
          // continue
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

    try {
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
    <div className="campaign-page">
      <Sidebar />

      <div className="campaign-main">
        <Header title="New Campaign" />
        <div className="campaign-body">

        <div className="campaign-tabs">
            <button
              className="campaign-tab"
              onClick={() => navigate("/user/New_Campaign_Page_CAMPAIGN")}
            >
              Campaign
            </button>
            <button className="campaign-tab active">Map Builder</button>
            <button
              className="campaign-tab"
              onClick={() => navigate("/user/New_Campaign_Page_CHARACTERS")}
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
                onClick={() => openPopup(AddLocation, "Add Location")}
                type="button"
              >
                Add Location
              </button>
              <button className="campaign-pill">Show</button>
            </div>

            <div className="mapbuilder-button-row">
              <button
                className="campaign-pill"
                onClick={() =>
                  openPopup(AddBuildingRegion, "Add Building or Region")
                }
                type="button"
              >
                Add Building/Region
              </button>
              <button className="campaign-pill">Show</button>
            </div>

            <div className="mapbuilder-button-row">
              <button className="campaign-pill">Add Event</button>
              <button className="campaign-pill">Show</button>
            </div>

            <div className="mapbuilder-button-row">
              <button
                className="campaign-pill"
                onClick={() => openPopup(AddContainer, "Add Container")}
                type="button"
              >
                Add Container
              </button>
              <button className="campaign-pill">Show</button>
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
