import React, { useContext, useState, useEffect } from "react";
import ListingCard from "./ListingCard";
import { useCategoryContext } from "../context/CategoryContext";
import { clothes } from "../data/clothingData";

const Listing = ({clothing}) => {
  
  const { category, setCategory, searchTerm, categories, setCategories } = useCategoryContext();

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
        {clothing
          .filter((item) => (category === "all" ? true : item.category === category))
          .filter((item) => {
            if (!searchTerm) return true;
            const q = searchTerm.toLowerCase();
            return (
              item.title.toLowerCase().includes(q) ||
              (item.description && item.description.toLowerCase().includes(q))
            );
          })
          .map((item) => (
            <ListingCard key={item.image} clothes={item} />
          ))}
      </div>
    </div>
  );
};

export default Listing;
