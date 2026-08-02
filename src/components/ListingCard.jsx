import React from "react";
import { LiaHeartSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { useFavoriteContext } from "../context/FavoriteContext";
import { getClothingImageSrc, DEFAULT_CLOTHING_IMAGE } from "../utils/clothingImage";

const ListingCard = ({ product, products, clothes, item }) => {
  const data = product || products || clothes || item || {};
  const id = data.product_id ?? data.id;
  const title = data.product_name ?? data.title ?? "Untitled item";
  const category = data.category_name ?? data.category ?? "";
  const price = data.price ?? "";
  const condition = data.product_condition ?? data.condition ?? "";
  const imageSource = data.image_path ?? data.image ?? "";

  const { isFavorite, removeFromFavorite, addToFavorite } = useFavoriteContext();

  const favoriteItem = id ? isFavorite(id) : false;

  const handleFavorite = (e) => {
    e.preventDefault();
    if (!id) return;

    if (favoriteItem) {
      removeFromFavorite(id);
    }else{
      addToFavorite(data);
    }
  }

  return (
    <div className="relative flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <button
        type="button"
        onClick={handleFavorite}
        className={`absolute right-4 top-4 z-10 ${favoriteItem ? "text-red-500" : "text-black"}`}
        aria-label="Toggle favorite"
      >
        <LiaHeartSolid className="shadow-2xl" />
      </button>

      <Link to={id ? `/clothes/${id}` : "#"}>
      <div className=" w-full h-64 md:h-72 flex items-center justify-center bg-gray-100 overflow-hidden rounded-md">
        <img
          src={getClothingImageSrc(imageSource)}
          alt={title || category}
          onError={(event) => {
            event.currentTarget.src = DEFAULT_CLOTHING_IMAGE;
          }}
          className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
      <span className="flex flex-col">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-gray-400 text-sm">{category}</p>
        <p className="font-semibold text-gray-900 text-sm">Rs. {price}</p>
        {condition && (
          <p className="absolute text-gray-600 text-xs top-1 left-1 bg-[#EDE9E6] p-1 rounded-sm shadow-2xl font-semibold">
            {condition}
          </p>
        )}
      </span>
      </Link>
    </div>
  );
};

export default ListingCard;
