import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiX, FiCheck, FiAlertCircle, FiSearch, FiImage, FiCheckCircle, FiPackage } from "react-icons/fi";

const CreateCollectionModal = ({ isOpen, onClose, sellerId, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sellerProductsList, setSellerProductsList] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true,
  });

  useEffect(() => {
    if (isOpen && sellerId) {
      const fetchProducts = async () => {
        setProductsLoading(true);
        try {
          const res = await axios.get(`http://localhost:5000/api/seller/${sellerId}/products`);
          if (res.data.success) setSellerProductsList(res.data.products || []);
        } catch (err) {
          console.error("Failed to fetch products:", err);
        } finally {
          setProductsLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen, sellerId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Cover image must be smaller than 5 MB");
      return;
    }
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
    setError("");
  };

  const toggleProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) return "Collection name is required";
      if (!formData.description.trim()) return "Description is required";
    }
    if (step === 2) {
      if (selectedProducts.length === 0) return "Select at least one product for the collection";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep(prev => Math.min(prev + 1, 3));
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
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      fd.append("is_public", formData.isPublic);
      fd.append("product_ids", JSON.stringify(selectedProducts));
      if (coverImage) fd.append("cover_image", coverImage);

      const response = await axios.post(
        `http://localhost:5000/api/seller/${sellerId}/collections`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        onSuccess?.();
      } else {
        setError(response.data.message || "Failed to create collection");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create collection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = sellerProductsList.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h3 className="text-lg font-semibold text-slate-800">Create Collection Set</h3>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Details" },
              { num: 2, label: "Products" },
              { num: 3, label: "Cover" },
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition ${
                    step >= s.num ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-600"
                  }`}>
                    {step > s.num ? <FiCheck className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`hidden sm:block text-xs font-medium ${
                    step >= s.num ? "text-indigo-500" : "text-slate-600"
                  }`}>{s.label}</span>
                </div>
                {i < 2 && (
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

          {/* Step 1: Collection Details */}
          {step === 1 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Collection Details</h4>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Collection Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Summer Essentials, Vintage Denim, Workwear Capsule"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  maxLength={80}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the theme, style inspiration, occasion, or what makes this collection special..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-500"
                  id="isPublic"
                />
                <label htmlFor="isPublic" className="flex-1 cursor-pointer">
                  <p className="text-sm font-medium text-slate-700">Public Collection</p>
                  <p className="text-xs text-slate-500 mt-0.5">Visible to all users on your storefront</p>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Select Products */}
          {step === 2 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Add Products to Collection</h4>
              <p className="text-xs text-slate-500">Select items from your inventory. Minimum 1 product required.</p>

              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-indigo-500 animate-spin" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-slate-100 bg-white">
                  <FiPackage className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">No products found. Add items first.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <label key={product.product_id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.product_id)}
                        onChange={() => toggleProduct(product.product_id)}
                        className="h-4 w-4 rounded border-slate-300 accent-indigo-500"
                      />
                      <img
                        src={`http://localhost:5000${product.primary_image || '/src/assets/shirt-1.jpg'}`}
                        alt={product.title}
                        className="h-12 w-12 rounded-lg object-cover border border-slate-100"
                        onError={e => { e.currentTarget.src = "/src/assets/shirt-1.jpg"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{product.title}</p>
                        <p className="text-xs text-slate-400">₨{Number(product.price).toLocaleString()} • {product.category}</p>
                      </div>
                      {selectedProducts.includes(product.product_id) && (
                        <FiCheckCircle className="w-5 h-5 text-indigo-500" />
                      )}
                    </label>
                  ))}
                </div>
              )}

              <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100">
                <p className="text-sm text-indigo-700">
                  <strong>{selectedProducts.length}</strong> product{selectedProducts.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Cover Image */}
          {step === 3 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Collection Cover Image</h4>
              <p className="text-xs text-slate-500">This image represents your collection on the storefront.</p>

              <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center cursor-pointer transition hover:border-indigo-300 hover:bg-indigo-50/30">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleCoverChange}
                />
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="h-32 w-32 rounded-lg object-cover border border-slate-200" />
                ) : (
                  <>
                    <FiImage className="w-10 h-10 text-slate-300" />
                    <span className="text-sm font-medium text-slate-500">Click to upload cover image</span>
                  </>
                )}
                <p className="text-xs text-slate-400">Recommended: 800x800px, JPG/PNG/WebP, max 5MB</p>
              </label>

              {coverPreview && (
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setCoverImage(null); setCoverPreview(null); }}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCoverImage(null); setCoverPreview(null); }}
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              )}
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
          {step < 3 ? (
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
                  Creating...
                </>
              ) : (
                "Create Collection"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCollectionModal;