import React, { useEffect, useRef, useState } from "react";
import "../../pages/pages-css/CSS.css";
import "../../pages/pages-css/Add_View.css";
import UploadIMG_Logo from "../../assets/PlaceholderImage.jpg";
import { createLocation, updateLocation } from "../../api/userCampaigns";

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

function Add_Location({ campaignId, location, userId, baseUrl }) {
  const fileInputRef = useRef(null);

  const [name, setName] = useState(location?.name || "");
  const [description, setDescription] = useState(location?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    resolveImageUrl(location?.imageUrl || null, baseUrl)
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
      setMessage("You must be signed in to save a location.");
      return;
    }
    if (!campaignId) {
      setMessage("No campaign selected for this location.");
      return;
    }
    if (!name.trim()) {
      setMessage("Please enter a name for this location.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      let imageUrl = location?.imageUrl || null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("campaignId", campaignId);
        formData.append("image", imageFile);
        // Ask the server to delete the previous image file when replacing it
        if (location?.imageUrl) {
          formData.append("previousUrl", location.imageUrl);
        }

        const res = await fetch("/api/upload-location", {
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
        description: description.trim(),
        imageUrl: imageUrl || "",
        updatedAt: new Date().toISOString(),
      };

      let saved;
      if (location?.id) {
        saved = await updateLocation(userId, campaignId, location.id, payload);
      } else {
        const dataWithCreated = {
          ...payload,
          createdAt: new Date().toISOString(),
        };
        saved = await createLocation(userId, campaignId, dataWithCreated);
      }

      if (!saved) {
        throw new Error("Failed to save location.");
      }

      setMessage("Location saved successfully.");
      // Close popup window immediately after successful save
      if (typeof window !== "undefined" && window.close) {
        try {
          window.close();
        } catch {
          // ignore if close fails
        }
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
        <p id="addview-title">Add Location</p>

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
            <label htmlFor="name-location">
              <b>Name</b>
            </label>{" "}
            <br />
            <input
              type="text"
              id="name-location"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <br />

            <div id="addview-description">
              <label htmlFor="description-location">
                <b>Description</b> (max. 120 characters)
              </label>
              <br />
              <textarea
                name="description-location"
                id="description-location"
                maxLength="120"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <br />
            <button id="button-green" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            {message && (
              <>
                <br />
                <p>{message}</p>
              </>
            )}
            <br />
            <br />
          </form>
        </div>
      </div>
    </div>
  );
}

export default Add_Location;
