export const DEFAULT_CLOTHING_IMAGE =
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getClothingImageSrc = (image) => {
  if (!image) return DEFAULT_CLOTHING_IMAGE;

  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) {
    return image;
  }

  if (image.startsWith("/uploads/") || image.startsWith("uploads/")) {
    return `${API_BASE_URL}${image.startsWith("/") ? image : `/${image}`}`;
  }

  return image;
};
