import React, { useEffect, useRef, useState } from "react";
import "../../pages/pages-css/CSS.css";
import "../../pages/pages-css/Add_View.css";
import UploadIMG_Logo from "../../assets/PlaceholderImage.jpg";
import {
  createBuildingRegion,
  updateBuildingRegion,
  getLocations,
} from "../../api/userCampaigns";

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

function Add_Building_Region({ campaignId, building, userId, baseUrl, locationId, onClose }) 
{
  const fileInputRef = useRef(null);
  const [name, setName] = useState(building?.name || "");
  const [description, setDescription] = useState(building?.description || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    resolveImageUrl(building?.imageUrl || null, baseUrl)
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
      setMessage("You must be signed in to save a building/region.");
      return;
    }
    if (!campaignId) {
      setMessage("No campaign selected for this building/region.");
      return;
    }
    if (!name.trim()) {
      setMessage("Please enter a name for this building/region.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      let imageUrl = building?.imageUrl || null;

      if (imageFile) {
        const formData = new FormData();
        formData.append("campaignId", campaignId);
        formData.append("image", imageFile);
        // If there was a previous image, ask the backend to delete it
        if (building?.imageUrl) {
          formData.append("previousUrl", building.imageUrl);
        }

        const res = await fetch("/api/upload-building", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Image upload failed.");
        }

        const result = await res.json();
        imageUrl = result.url;
      }

      const payload = {
        name: name.trim(),
        description: description.trim(),
        imageUrl: imageUrl || "",
        locationId: locationId || "",
        updatedAt: new Date().toISOString(),
      };

      let saved;
      if (building?.id) {
        saved = await updateBuildingRegion(userId, campaignId, building.id, payload);
      } else {
        const dataWithCreated = {
          ...payload,
          createdAt: new Date().toISOString(),
        };
        saved = await createBuildingRegion(userId, campaignId, dataWithCreated);
      }

      if (!saved) {
        throw new Error("Failed to save building/region.");
      }

      setMessage("Building/Region saved successfully.");
      if (onClose) {
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

      <p id="addview-title">Add Building/Region</p>

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
            <label htmlFor="name-buildingregion"><b>Name</b></label> <br /> 
            <input
              type="text"
              id="name-buildingregion"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <br />
            <div className="addview-description">
                <label htmlFor="description-buildingregion"><b>Description</b> (max. 120 characters)</label><br />
                <textarea
                  name="description-buildingregion"
                  id="description-buildingregion"
                  maxLength="120"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
            </div>

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

export default Add_Building_Region;