import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { clothes } from "../data/clothingData";
import { FaCartShopping } from "react-icons/fa6";
import { LiaHeartSolid } from "react-icons/lia";
import NavBar from "../components/NavBar";
import { MdDateRange } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import { BsFillCartCheckFill } from "react-icons/bs";
import { IoIosStar } from "react-icons/io";
import { CiDiscount1 } from "react-icons/ci";
import { useFavoriteContext } from "../context/FavoriteContext";
import { useCartContext } from "../context/CartContext";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";
import {
  getClothingImageSrc,
  DEFAULT_CLOTHING_IMAGE,
} from "../utils/clothingImage";

const normalizeDbProduct = (product) => {
  if (!product) return null;
  console.log(product);
  return {
    id: product.product_id,
    title: product.product_name,
    price: product.price,
    rating: product.rating ?? 4.5,
    description: product.description || "",
    condition: product.product_condition || "",
    category: product.category_name || "",
    image: product.image_path || "",
    brand: product.brand || "",
    size: product.size || "",
    color: product.color || "",
    material: product.material || "",
    season: product.season || "",
    length: product.length || "",
    width: product.width || "",
    fit: product.fit || "",
    original_price: product.original_price,
    stock_quantity: product.stock_quantity,
    store_name: product.store_name,
    store_logo: product.store_logo,
    user_id: product.user_id,
    discount_percentage: product.discount_percentage,
    discounted_price:
      product.price - (product.discount_percentage / 100) * product.price,
  };
};

const ClothingDetails = () => {
  const { id } = useParams();
  const numeirId = Number(id);
  const clothing = clothes;

  const { isFavorite, addToFavorite, removeFromFavorite } =
    useFavoriteContext();
  const { inCart, addToCart, removeFromCart } = useCartContext();

  const [dbProduct, setDbProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [randomClothes, setRandomClothes] = useState([]);

  const staticItem = clothing.find((item) => item.id === numeirId);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/product/${id}`);
        if (isMounted && response.data.success) {
          setDbProduct(normalizeDbProduct(response.data.data));
        }
      } catch (error) {
        if (isMounted) {
          setDbProduct(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const items = dbProduct || staticItem;
  const cartItem = inCart(items?.id ?? numeirId);
  const favoriteItem = isFavorite(items?.id ?? numeirId);

  const handleFavorite = () => {
    if (!items) return;
    if (favoriteItem) {
      removeFromFavorite(items.id);
    } else {
      addToFavorite(items);
    }
  };

  const handleCart = () => {
    if (!items) return;
    if (cartItem) {
      removeFromCart(items.id);
    } else {
      addToCart(items);
    }
  };

  const getRandomItems = (arr, count) => {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchRandomProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/product/products",
        );
        const databaseProducts = response.data?.products ?? [];
        const recommendations = databaseProducts.filter(
          (product) => product.product_id !== Number(id),
        );

        if (isMounted) {
          setRandomClothes(getRandomItems(recommendations, 4));
        }
      } catch (err) {
        console.error("Error fetching random products:", err);
        if (isMounted) setRandomClothes([]);
      }
    };

    fetchRandomProducts();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const imageSrc = useMemo(() => {
    if (dbProduct?.image) {
      return `http://localhost:5000${dbProduct.image}`;
    }

    return getClothingImageSrc(items?.image);
  }, [dbProduct, items?.image]);

  if (loading && !items) {
    return (
      <div className="min-h-screen w-full bg-white">
        <NavBar />
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-24 text-slate-400">
          Loading product…
        </div>
        <Footer />
      </div>
    );
  }

  if (!items) {
    return (
      <div className="min-h-screen w-full bg-white">
        <NavBar />
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-24 text-slate-400">
          Product not found.
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <NavBar />
      <div className="flex flex-wrap rounded-2xl mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 gap-4 py-10">
        <div className="flex-1 relative rounded-2xl w-full h-128 overflow-hidden bg-white shadow-2xl sm:h-152 lg:h-176 min-w-80">
          {items.discount_percentage ? (
            <div className="absolute top-4 -left-6 z-10 text-center -rotate-45 bg-rose-600 w-24 text-xs font-bold text-white shadow-sm">
              {items.discount_percentage}% OFF
            </div>
          ) : null}
          <img
            src={imageSrc}
            alt={items.title}
            onError={(event) => {
              event.currentTarget.src = DEFAULT_CLOTHING_IMAGE;
            }}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex-1 flex flex-col gap-4 p-6 min-w-80">
          <h1 className="text-2xl md:text-4xl font-semibold">{items.title}</h1>
          <Link to={`/profile/${items.user_id}`}>
            <div className="flex items-center gap-2">
              <img
                src={`http://localhost:5000${items.store_logo}`}
                alt={items.store_name}
                className="h-10 w-10 rounded-full shadow-black shadow-2xl"
              ></img>
              <p className="font-bold">{items.store_name}</p>
            </div>
          </Link>
          {items.discount_percentage ? (<div className="flex gap-2 items-center font-semibold">
            <span className="px-5 py-1 rounded-md bg-[#3dc152] text-white shadow-md">{items.discount_percentage}% off</span>
            <span>Rs. {items.discounted_price}</span>
            <div className="relative opacity-75 before:content-[''] before:absolute before:border before:w-full before:bg-gray-500 before:top-1/2 before:-translate-y-1/2">
              Rs.{items.price}
            </div>
          </div>) : (<p className="text-sm font-semibold md:text-lg">
            Rs. {items.discounted_price ? items.discounted_price : items.price}
          </p>)}
          <span className="flex gap-4 items-center justify-center">
            {cartItem ? (
              <Link to="/cart" className="w-full">
                <button className="bg-black flex items-center justify-center gap-2 text-white w-full rounded-2xl py-4">
                  View Cart <BsFillCartCheckFill />
                </button>
              </Link>
            ) : (
              <button
                onClick={handleCart}
                className="bg-black flex items-center justify-center gap-2 text-white w-full rounded-2xl py-4"
              >
                Add to Cart <FaCartShopping />
              </button>
            )}

            <LiaHeartSolid
              onClick={handleFavorite}
              className={`text-4xl ${favoriteItem ? "text-red-500" : "text-black"} shadow-2xl`}
            />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-sm md:text-lg">Description and Fit</h1>
            <p className="text-sm text-gray-500">{items.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              {items.brand ? (
                <span className="flex">
                  <p className="font-bold">Brand</p>: {items.brand}
                </span>
              ) : null}
              {items.condition ? (
                <span className="flex">
                  <p className="font-bold">Condition</p>: {items.condition}
                </span>
              ) : null}
              {items.size ? (
                <span className="flex">
                  <p className="font-bold">Size</p>: {items.size}
                </span>
              ) : null}
              {items.color ? (
                <span className="flex">
                  <p className="font-bold">Color</p>: {items.color}
                </span>
              ) : null}
              {items.material ? (
                <span className="flex">
                  <p className="font-bold">Material</p>: {items.material}
                </span>
              ) : null}
              {items.season ? (
                <span className="flex">
                  <p className="font-bold">Season</p>: {items.season}
                </span>
              ) : null}
              {items.fit ? (
                <span className="flex">
                  <p className="font-bold">Fit</p>: {items.fit}
                </span>
              ) : null}
              {items.original_price ? (
                <span className="flex">
                  <p className="font-bold">Original Price</p>: Rs.
                  {items.original_price}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm md:text-lg">Shipping</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div className="flex gap-4 items-center p-2 ">
                <MdDateRange className="text-2xl" />
                <span>
                  <p className="text-xs text-black/45">Delivery Time</p>
                  <p className="text-sm">2-3 Working Days</p>
                </span>
              </div>
              <div className="flex gap-4 items-center p-2">
                <FaShippingFast className="text-2xl" />
                <span>
                  <p className="text-xs text-black/45">Estimate Arrival</p>
                  <p className="text-sm">5-6 May</p>
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm md:text-lg">Discount: </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div className="flex gap-2 items-center p-2 ">
                <span>
                  {items.discount_percentage ? (
                    <span className="flex">
                      <p className="font-bold">{items.discount_percentage}</p>
                    </span>
                  ) : (
                    <p className="text-xs text-center text-black/45">
                      No discount Available
                    </p>
                  )}
                </span>
                <CiDiscount1 className="text-2xl" />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm md:text-lg">Rating</p>
            <div className="flex gap-2">
              <span className="flex items-end">
                <p className="text-2xl md:text-4xl font-semibold">
                  {items.rating ?? 4.5}
                </p>
                <p className="text-sm text-gray-400">/5</p>
              </span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer flex text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    <IoIosStar />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 gap-4 py-10">
        <h1 className="text-2xl md:text-4xl">You might also like</h1>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 w-full mt-10 ">
          {randomClothes.map((item) => (
            <ListingCard key={item.product_id || item.id} products={item} />
          ))}
        </div>
        <Link to="/">
          <button className="mt-6 inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50">
            See More
          </button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default ClothingDetails;
