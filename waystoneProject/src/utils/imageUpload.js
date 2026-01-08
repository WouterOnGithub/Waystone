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

/**
 * Uploads an image using the server API endpoints
 * @param {File} file - The image file to upload
 * @param {string} endpoint - The API endpoint ('upload-player' or 'upload-entity')
 * @param {string} campaignId - The campaign ID
 * @param {string} [previousUrl] - Optional previous image URL to delete
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export const uploadImage = async (file, endpoint, campaignId, previousUrl) => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error("File must be an image");
  }

  // Validate file size (max 5MB - server will also validate)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("Image size must be less than 5MB");
  }

  try {
    const formData = new FormData();
    formData.append("campaignId", campaignId);
    formData.append("image", file);
    
    // If there was a previous image, ask backend to delete it
    if (previousUrl) {
      formData.append("previousUrl", previousUrl);
    }

    const res = await fetch(`/api/${endpoint}`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Image upload failed.");
    }

    const result = await res.json();
    return result.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Handles file input change and uploads the image
 * @param {Event} event - The file input change event
 * @param {string} endpoint - The API endpoint ('upload-player' or 'upload-entity')
 * @param {string} campaignId - The campaign ID
 * @param {Function} onUploadSuccess - Callback function called with the download URL
 * @param {Function} onUploadError - Callback function called on error
 * @param {string} [previousUrl] - Optional previous image URL to delete
 */
export const handleImageUpload = async (event, endpoint, campaignId, onUploadSuccess, onUploadError, previousUrl) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const downloadURL = await uploadImage(file, endpoint, campaignId, previousUrl);
    onUploadSuccess(downloadURL);
  } catch (error) {
    onUploadError(error.message);
  }
};

export { resolveImageUrl };
