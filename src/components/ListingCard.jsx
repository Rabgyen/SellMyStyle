import React from "react";

const ListingCard = ({ clothes }) => {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg shadow-4xs">
      <div className="w-full h-64 md:h-72 flex items-center justify-center bg-gray-100 overflow-hidden rounded-md">
        <img
          src={clothes.image}
          alt={clothes.title || clothes.category}
          className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>
      <span className="flex flex-col">
        <h2 className="font-semibold text-lg">{clothes.title}</h2>
        <p className="text-gray-400 text-sm">{clothes.category}</p>
        <p className="font-semibold text-gray-900 text-sm">{clothes.price}</p>
      </span>
    </div>
  );
};

export default ListingCard;
