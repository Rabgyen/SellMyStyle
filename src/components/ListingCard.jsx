import { LiaHeart, LiaHeartSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { useFavoriteContext } from "../context/FavoriteContext";
import { getClothingImageSrc, DEFAULT_CLOTHING_IMAGE } from "../utils/clothingImage";
import { hasActiveDiscount } from "../utils/discount";

const ListingCard = ({ product, products, clothes, item }) => {
  const data = product || products || clothes || item || {};
  const id = data.product_id ?? data.id;
  const title = data.product_name ?? data.title ?? "Untitled item";
  const category = data.category_name ?? data.category ?? "";
  const price = data.price ?? "";
  const condition = data.product_condition ?? data.condition ?? "";
  const imageSource = data.primary_image ?? data.image_path ?? data.image ?? "";
  const discountPercentage = Number(data.discount_percentage);
  const hasDiscount = hasActiveDiscount(data);
  const discountedPrice = price - (discountPercentage/100 * price)

  const { isFavorite, removeFromFavorite, addToFavorite } = useFavoriteContext();

  const favoriteItem = id ? isFavorite(id) : false;

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!id) return;

    if (favoriteItem) {
      removeFromFavorite(id);
    } else {
      addToFavorite(data);
    }
  };

  return (
    <Link to={id ? `/clothes/${id}` : "#"} className="relative block group overflow-hidden">
      {hasDiscount && (
        <div className="absolute top-4 -left-6 z-10 text-center -rotate-45 bg-rose-600 w-24 text-xs font-bold text-white shadow-sm">
          {discountPercentage}% OFF
        </div>
      )}
      <div className="relative flex flex-col h-full rounded-3xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:rotate-1">
        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavorite}
          className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-slate-50 transition-colors transform duration-300 ${favoriteItem ? 'animate-pulse' : ''} group-hover:bg-slate-100"
          aria-label="Toggle favorite"
        >
          {favoriteItem ? (
            <LiaHeartSolid className="text-red-500 w-5 h-5" />
          ) : (
            <LiaHeart className="text-gray-400 w-5 h-5 hover:text-red-500" />
          )}
        </button>

        {/* Image Container with Parallelogram Clip */}
        <div className="relative shrink-0 w-full h-64 md:h-72 bg-gray-100 overflow-hidden clip-slanted">
          <img
            src={getClothingImageSrc(imageSource)}
            alt={title || category}
            onError={(event) => {
              event.currentTarget.src = DEFAULT_CLOTHING_IMAGE;
            }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/0 via-black/20 to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4">
          {/* Category Badge */}
          {category && (
            <span className="mb-2 inline-block text-gray-900 text-xs font-semibold px-2 py-1 rounded-full">
              {category}
            </span>
          )}
          <h2 className="mb-2 line-clamp-2 font-antonn text-2xl text-gray-900 hover:text-gray-700 transition-colors tracking-tighter">
            {title}
          </h2>
          <div className="mt-auto flex flex-col space-y-2">
            {discountedPrice ? (<span className="inline-block text-gray-900 text-sm font-semibold p-1">
              Rs. {discountedPrice}
            </span>) : (<span className="inline-block text-gray-900 text-sm font-semibold p-1">
              Rs. {price}
            </span>)}
            {condition && (
              <span className="inline-block text-gray-800 text-xs px-2 py-1 ">
                {condition}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
