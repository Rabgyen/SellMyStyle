import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FiAlertCircle, FiCheck, FiX } from "react-icons/fi";
import { useCategoryContext } from "../context/CategoryContext";

const fieldFromProduct = (product) => ({
  name: product?.product_name || "",
  description: product?.description || "",
  category_id: product?.category_name || product?.category_id || "",
  price: product?.price ?? "",
  original_price: product?.original_price ?? "",
  stock_quantity: product?.stock_quantity ?? "",
  brand: product?.brand || "",
  size: product?.size || "",
  color: product?.color || "",
  condition: product?.product_condition || "",
  material: product?.material || "",
  season: product?.season || "",
  length: product?.length ?? "",
  width: product?.width ?? "",
  fit: product?.fit || "",
});

const EditProductModal = ({ isOpen, onClose, product, onSuccess }) => {
  const { categories } = useCategoryContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(fieldFromProduct(product));

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50", "One Size"];
  const conditions = [
    { value: "new", label: "Brand New" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
  ];
  const fits = ["Slim", "Regular", "Relaxed", "Oversized", "Skinny", "Straight", "Bootcut", "Tapered"];

  const selectedCategoryName = String(formData.category_id || "").trim().toLowerCase();
  const isShadesOrAccessories = ["shades", "accessories"].includes(selectedCategoryName);

  useEffect(() => {
    if (isOpen) {
      setFormData(fieldFromProduct(product));
      setError("");
    }
  }, [isOpen, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "category_id" && ["shades", "accessories"].includes(value.trim().toLowerCase())) {
        next.fit = "";
        next.season = "";
        next.length = "";
        next.width = "";
      }
      return next;
    });
  };

  const resolveCategoryValue = (value) => {
    const match = categories.find((item) => String(item.category_name).toLowerCase() === String(value).toLowerCase());
    return match ? match.category_id : value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product?.product_id) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        category_id: resolveCategoryValue(formData.category_id),
      };

      const response = await axios.put(`http://localhost:5000/product/${product.product_id}`, payload);

      if (response.data.success) {
        onSuccess?.(response.data.product);
      } else {
        setError(response.data.message || "Failed to update item");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h3 className="text-lg font-semibold text-slate-800">Edit Product</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Product Name *</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Category *</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none">
                  <option value="">Select category</option>
                  {categories.map((item) => (
                    <option key={item.category_id} value={item.category_name}>{item.category_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Brand</label>
                <input name="brand" value={formData.brand} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Condition *</label>
                <select name="condition" value={formData.condition} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none">
                  <option value="">Select condition</option>
                  {conditions.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Size *</label>
                <select name="size" value={formData.size} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none">
                  <option value="">Select size</option>
                  {sizes.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Color *</label>
                <input name="color" value={formData.color} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Price (₨) *</label>
                <input name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Original Price (₨)</label>
                <input name="original_price" type="number" min="0" step="0.01" value={formData.original_price} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Stock Quantity *</label>
                <input name="stock_quantity" type="number" min="0" value={formData.stock_quantity} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
              </div>
            </div>

            {!isShadesOrAccessories && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Fit</label>
                  <select name="fit" value={formData.fit} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none">
                    <option value="">Select fit</option>
                    {fits.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Season</label>
                  <select name="season" value={formData.season} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none">
                    <option value="">Select season</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                    <option value="Autumn">Autumn</option>
                    <option value="Winter">Winter</option>
                    <option value="All Season">All Season</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Length (cm)</label>
                  <input name="length" type="number" min="0" step="0.5" value={formData.length} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Width (cm)</label>
                  <input name="width" type="number" min="0" step="0.5" value={formData.width} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
            <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <FiCheck className="h-4 w-4" />
                  Save Changes
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;