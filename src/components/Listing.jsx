import React, { useEffect, useState } from "react";
import axios from "axios";
import ListingCard from "./ListingCard";
import { useCategoryContext } from "../context/CategoryContext";

const Listing = ({ clothing = [] }) => {
  const { category, setCategory, searchTerm, categories } = useCategoryContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get("http://localhost:5000/product/products");
        const fetchedProducts = response.data?.products || response.data || [];
        if (isMounted) {
          setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError("Failed to load products.");
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const sourceItems = products;

  const filteredClothing = sourceItems
    .filter((item) => {
      const itemCategory = item.category_name || item.category;
      return category === "all" ? true : itemCategory === category;
    })
    .filter((item) => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      const title = item.product_name || item.title || "";
      const description = item.description || "";
      return (
        title.toLowerCase().includes(q) ||
        description.toLowerCase().includes(q)
      );
    });

  return (
    <div className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 flex flex-col gap-6">
      <div className="flex justify-between">
        <select
          name="Filter"
          className="mt-6 inline-flex items-center gap-2 rounded text-gray-400 outline-none border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All</option>
          {categories.map((item) => (
            <option key={item.category_id} value={item.category_name}>{item.category_name}</option>
          ))}
        </select>
        <div className="mt-6 inline-flex items-center gap-2 rounded text-gray-400 border border-slate-200 bg-white px-6 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50">
          Sort
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 w-full">
        {loading ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-400">
            Loading products...
          </div>
        ) : error ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-400">
            {error}
          </div>
        ) : filteredClothing.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-slate-400">
            No items match your filters.
          </div>
        ) : (
          filteredClothing.map((item) => (
            <ListingCard key={item.product_id || item.id} product={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default Listing;
