import React, { useEffect, useRef, useState } from "react";
import "../../pages/pages-css/CSS.css";
import "../../pages/pages-css/Add_View.css";
import UploadIMG_Logo from "../../assets/PlaceholderImage.jpg";
import { createEvent, updateEvent } from "../../api/userCampaigns";

function resolveImageUrl(imageUrl, baseUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  const origin =
    baseUrl ||
    (typeof window !== "undefined" ? window.location.origin : "");
  if (!origin) return imageUrl;
  if (imageUrl.startsWith("/")) {
    return `${origin}${imageUrl}`;
  }
  return `${origin}/${imageUrl}`;
}

function Add_Event({ campaignId, event, userId, mapId, baseUrl, onEventSaved, onClose }) {
  const fileInputRef = useRef(null);

  const [name, setName] = useState(event?.name || "");
  const [height, setHeight] = useState(event?.height || "");
  const [width, setWidth] = useState(event?.width || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    resolveImageUrl(event?.imageUrl || null, baseUrl)
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return url;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userId) {
      setMessage("You must be signed in to save an event.");
      return;
    }
    if (!campaignId) {
      setMessage("No campaign selected for this event.");
      return;
    }
    if (!name.trim()) {
      setMessage("Please enter a name for this event.");
      return;
    }
    if (!height || !width) {
      setMessage("Please enter both height and width for this event.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      let imageUrl = event?.imageUrl || null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("campaignId", campaignId);
        formData.append("image", imageFile);
        // Ask the server to delete the previous image file when replacing it
        if (event?.imageUrl) {
          formData.append("previousUrl", event.imageUrl);
        }

        const res = await fetch("/api/upload-event", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Image upload failed.");
        }

        const result = await res.json();
        // Keep the local preview as the selected file (blob) so it doesn't
        // disappear while saving; just update the URL we store in Firestore.
        imageUrl = result.url;
      }

      const payload = {
        name: name.trim(),
        height: parseInt(height),
        width: parseInt(width),
        imageUrl: imageUrl || "",
        updatedAt: new Date().toISOString(),
      };

      let saved;
      if (event?.id) {
        saved = await updateEvent(userId, campaignId, mapId, payload);
      } else {
        const dataWithCreated = {
          ...payload,
          createdAt: new Date().toISOString(),
        };
        saved = await createEvent(userId, campaignId, dataWithCreated, mapId);
      }

      if (!saved) {
        throw new Error("Failed to save event.");
      }

      setMessage("Event saved successfully.");
      // Call callback to refresh events in parent component
      if (onEventSaved) {
        onEventSaved();
      }
      // Only close popup for new events, not for edits
      if (!event?.id && onClose) {
        onClose();
      }
    } catch (err) {
      setMessage(err?.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="addview-page">
    <div id="addview-box">

      <p id="addview-title">Add Event</p>

      <div id="addview-content">

        <form id="input-box-gray" onSubmit={handleSave}>
            <img
              src={imagePreview || UploadIMG_Logo}
              alt="UploadIMG_Logo"
              id="UploadIMG_Logo"
              className="addview-uploadimg"
              onClick={handleUploadClick}
            />
            <input
              type="file"
              id="upload-img"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
            />
            <br />
            <label htmlFor="name-event">
              <b>Name</b>
            </label>{" "}
            <br />
            <input
              type="text"
              id="name-event"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <br />

            <label htmlFor="height-event">
              <b>Height</b>
            </label>{" "}
            <br />
            <input
              type="number"
              id="height-event"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="1"
            />
            <br />
            <br />

            <label htmlFor="width-event">
              <b>Width</b>
            </label>{" "}
            <br />
            <input
              type="number"
              id="width-event"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              min="1"
            />
            <br />
            <br />

            <button id="button-green" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button id="button-green" type="button" onClick={onClose}>
              Back
            </button>
            {message && (
              <>
                <br />
                <p>{message}</p>
              </>
            )}
            
        </form>

      </div>
    </div>
    </div>
  );
}

export default Add_Event;