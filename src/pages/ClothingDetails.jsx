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
import { getClothingImageSrc, DEFAULT_CLOTHING_IMAGE } from "../utils/clothingImage";

const normalizeDbProduct = (product) => {
  if (!product) return null;

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
  };
};

const ClothingDetails = () => {
  const { id } = useParams();
  const numeirId = Number(id);
  const clothing = clothes;

  const { isFavorite, addToFavorite, removeFromFavorite } = useFavoriteContext();
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
        const response = await axios.get('http://localhost:5000/product/products');
        if (isMounted && response.data && response.data.length > 0) {
          const randomized = [...response.data].sort(() => Math.random() - 0.5).slice(0, 4);
          setRandomClothes(randomized);
        } else if (isMounted) {
          setRandomClothes(getRandomItems(clothing, 4));
        }
      } catch (err) {
        console.error("Error fetching random products:", err);
        if (isMounted) setRandomClothes(getRandomItems(clothing, 4));
      }
    };
    
    fetchRandomProducts();
    
    return () => {
      isMounted = false;
    };
  }, []);

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
        <div className="flex-1 rounded-2xl w-full h-128 overflow-hidden bg-white shadow-2xl sm:h-152 lg:h-176 min-w-80">
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
          <p className="text-sm md:text-lg">Rs. {items.price}</p>
          <p className="text-center p-2 bg-black/10 rounded-lg max-w-25 text-gray-600 text-sm">
            {items.condition}
          </p>
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
            <p className="text-sm text-gray-500">
              {items.description}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              {items.brand ? <span className="flex"><p className="font-bold">Brand</p>: {items.brand}</span> : null}
              {items.size ? <span className="flex"><p className="font-bold">Size</p>: {items.size}</span> : null}
              {items.color ? <span className="flex"><p className="font-bold">Color</p>: {items.color}</span> : null}
              {items.material ? <span className="flex"><p className="font-bold">Material</p>: {items.material}</span> : null}
              {items.season ? <span className="flex"><p className="font-bold">Season</p>: {items.season}</span> : null}
              {items.fit ? <span className="flex"><p className="font-bold">Fit</p>: {items.fit}</span> : null}
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
          <div className="flex flex-col gap-2">
            <p className="text-sm md:text-lg">Discount</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div className="flex gap-4 items-center justify-center p-2 ">
                <CiDiscount1 className="text-2xl" />
                <span>
                  <p className="text-xs text-black/45">No discount Available</p>
                </span>
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
