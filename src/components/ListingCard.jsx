import React from "react";
import { LiaHeartSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { useFavoriteContext } from "../context/FavoriteContext";
import { getClothingImageSrc, DEFAULT_CLOTHING_IMAGE } from "../utils/clothingImage";

const ListingCard = ({ clothes }) => {

  const {isFavorite, removeFromFavorite, addToFavorite} = useFavoriteContext();

  const favoriteItem = isFavorite(clothes.id);

  const handleFavorite =(e) => {
    e.preventDefault();
    if(favoriteItem){
      removeFromFavorite(clothes.id);
    }else{
      addToFavorite(clothes);
    }
  }

  return (
    <div className="relative flex flex-col gap-4 p-4 rounded-lg shadow-4xs">
      <LiaHeartSolid onClick={handleFavorite} className={`absolute z-100 top-4 right-4 ${favoriteItem ? 'text-red-500' : 'text-black'} shadow-2xl`}/>
      <Link to={`/clothes/${clothes.id}`}>
      <div className=" w-full h-64 md:h-72 flex items-center justify-center bg-gray-100 overflow-hidden rounded-md">
        <img
          src={getClothingImageSrc(clothes.image)}
          alt={clothes.title || clothes.category}
          onError={(event) => {
            event.currentTarget.src = DEFAULT_CLOTHING_IMAGE;
          }}
          className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
      <span className="flex flex-col">
        <h2 className="font-semibold text-lg">{clothes.title}</h2>
        <p className="text-gray-400 text-sm">{clothes.category}</p>
        <p className="font-semibold text-gray-900 text-sm">{clothes.price}</p>
        <p className="absolute text-gray-600 text-xs top-1 left-1 bg-[#EDE9E6] p-1 rounded-sm shadow-2xl font-semibold">{clothes.condition}</p>
      </span>
      </Link>
    </div>
  );
};

export default ListingCard;
