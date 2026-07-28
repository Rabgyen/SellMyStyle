import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX, FiCheck, FiAlertCircle, FiSearch, FiImage, FiCheckCircle } from "react-icons/fi";

const PostItemModal = ({ isOpen, onClose, sellerId, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    description: "",
    category_id: "",
    // Pricing
    price: "",
    original_price: "",
    // Inventory
    stock_quantity: "",
    // Clothing Specific
    brand: "",
    size: "",
    color: "",
    // Images
    images: [],
  });

  if (!isOpen) return null;

  const categories = [
    { value: "tops", label: "Tops", subcategories: ["T-Shirts", "Shirts", "Blouses", "Tank Tops", "Crop Tops", "Bodysuits", "Sweaters", "Cardigans", "Hoodies", "Sweatshirts"] },
    { value: "bottoms", label: "Bottoms", subcategories: ["Jeans", "Trousers", "Shorts", "Skirts", "Leggings", "Joggers", "Cargo Pants", "Chinos"] },
    { value: "dresses", label: "Dresses", subcategories: ["Mini", "Midi", "Maxi", "Mini", "Bodycon", "A-Line", "Wrap", "Shift", "Slip", "Sundress"] },
    { value: "outerwear", label: "Outerwear", subcategories: ["Jackets", "Coats", "Blazers", "Vests", "Parkas", "Trench Coats", "Puffer Jackets", "Leather Jackets", "Denim Jackets"] },
    { value: "activewear", label: "Activewear", subcategories: ["Sports Bras", "Leggings", "Shorts", "Tank Tops", "Jackets", "Joggers", "Yoga Pants", "Running Shorts"] },
    { value: "swimwear", label: "Swimwear", subcategories: ["One-Piece", "Bikinis", "Tankinis", "Swim Trunks", "Board Shorts", "Rash Guards"] },
    { value: "shoes", label: "Shoes", subcategories: ["Sneakers", "Boots", "Sandals", "Heels", "Flats", "Loafers", "Oxfords", "Slides"] },
    { value: "accessories", label: "Accessories", subcategories: ["Bags", "Belts", "Hats", "Scarves", "Jewelry", "Sunglasses", "Wallets", "Gloves"] },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50", "One Size"];
  const conditions = [
    { value: "new", label: "Brand New" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
  ];
  const fits = ["Slim", "Regular", "Relaxed", "Oversized", "Skinny", "Straight", "Bootcut", "Tapered"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(f => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024);
    if (validFiles.length + images.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }
    setImages(prev => [...prev, ...validFiles]);
    validFiles.forEach(file => {
      setImagePreviews(prev => [...prev, URL.createObjectURL(file)]);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) return "Title is required";
      if (!formData.category_id) return "Category is required";
      if (!formData.condition) return "Condition is required";
      if (!formData.size) return "Size is required";
      if (!formData.color) return "Color is required";
    }
    if (step === 2) {
      if (!formData.price || Number(formData.price) <= 0) return "Valid price is required";
      if (!formData.stock_quantity || Number(formData.stock_quantity) < 0) return "Valid quantity is required";
    }
    if (step === 3) {
      if (images.length === 0) return "At least one image is required";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setError("");
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("seller_id", sellerId);
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null) fd.append(key, value);
      });
      images.forEach((img, i) => fd.append(`images`, img));

      const response = await axios.post(
        `http://localhost:5000/api/seller/${sellerId}/products`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        onSuccess?.();
      } else {
        setError(response.data.message || "Failed to create item");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progressSteps = [
    { num: 1, label: "Basic Info" },
    { num: 2, label: "Pricing & Stock" },
    { num: 3, label: "Images" },
    { num: 4, label: "Details" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h3 className="text-lg font-semibold text-slate-800">Post New Clothing Item</h3>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            {progressSteps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition ${
                    step >= s.num ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {step > s.num ? <FiCheck className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`hidden sm:block text-xs font-medium ${
                    step >= s.num ? "text-indigo-500" : "text-slate-400"
                  }`}>{s.label}</span>
                </div>
                {i < progressSteps.length - 1 && (
                  <div className={`hidden md:block flex-1 h-1 mx-2 rounded ${
                    step > s.num ? "bg-indigo-500" : "bg-slate-200"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Basic Information</h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Product Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Category *</label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Brand</label>
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g., Nike, Zara, Vintage"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Condition *</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    {conditions.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Size *</label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select size</option>
                    {sizes.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Color *</label>
                  <input
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g., Navy Blue, Black, Floral Print"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Fit</label>
                  <select
                    name="fit"
                    value={formData.fit}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select fit</option>
                    {fits.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the item in detail: fabric feel, fit notes, any flaws, styling suggestions..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Inventory */}
          {step === 2 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Pricing & Inventory</h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Price (₨) *</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Original Price (₨) *</label>
                  <input
                    name="original_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.original_price}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Stock Quantity *</label>
                  <input
                    name="stock_quantity"
                    type="number"
                    min="0"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {step === 3 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Product Images</h4>
              <p className="text-xs text-slate-500">Upload up to 10 images. Recommended size: 800x800px.</p>

              <div className="mb-4">
                <label className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center cursor-pointer transition hover:border-indigo-300 hover:bg-indigo-50/30">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={handleImageChange}
                  />
                  {imagePreviews.length > 0 ? (
                    <>
                      <FiImage className="w-8 h-8 text-slate-300" />
                      <span className="text-sm font-medium text-slate-500">{imagePreviews.length} selected</span>
                    </>
                  ) : (
                    <>
                      <FiImage className="w-8 h-8 text-slate-300" />
                      <span className="text-sm font-medium text-slate-500">Click to upload images</span>
                    </>
                  )}
                  <p className="text-xs text-slate-400">JPG, PNG, GIF, WEBP • Max 10 MB each</p>
                </label>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Product ${index + 1}`}
                        className="h-32 w-32 rounded-lg object-cover border border-slate-200"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 rounded-full bg-red-500 text-white px-2 py-1 text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Additional Details</h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Weight (kg)</label>
                  <input
                    name="weight"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="0.5"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Length (cm)</label>
                  <input
                    name="length"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.length}
                    onChange={handleChange}
                    placeholder="30"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Width (cm)</label>
                  <input
                    name="width"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.width}
                    onChange={handleChange}
                    placeholder="20"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Height (cm)</label>
                  <input
                    name="height"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="5"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Tags (comma-separated)</h4>
                <input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="vintage, summer, cotton, sale, handmade"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              disabled={loading}
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
              disabled={loading}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                "Post Item"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostItemModal;