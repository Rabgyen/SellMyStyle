import {useState} from "react";
import { useParams } from "react-router-dom";
import { clothes } from "../data/clothingData";
import { FaCartShopping } from "react-icons/fa6";
import { LiaHeartSolid } from "react-icons/lia";
import NavBar from "../components/NavBar";
import { MdDateRange } from "react-icons/md";
import { FaShippingFast } from "react-icons/fa";
import { CiDiscount1 } from "react-icons/ci";

const ClothingDetails = () => {
  const { id } = useParams();
  const clothing = clothes;

  const items = clothing.find((item) => item.id === Number(id));

    const [liked, setLiked] = useState(false);
  const handleFavorite =() => {
    setLiked(prev => !prev);
  }


  return (
    <div className="h-screen w-full">
      <NavBar />
      <div className="flex flex-wrap rounded-2xl mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 gap-4 py-10">
        <div className="flex-1 rounded-2xl w-full h-128 overflow-hidden bg-white shadow-2xl sm:h-152 lg:h-176 min-w-80">
          <img
            src={items?.image}
            alt="clothe"
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex-1 flex flex-col gap-4 p-6 min-w-80">
          <h1 className="text-2xl md:text-4xl font-semibold">{items.title}</h1>
          <p className="text-sm md:text-lg">{items.price}</p>
          <p className="text-center py-2 bg-black/10 rounded-lg w-20 text-gray-400 text-sm">Thrift</p>
          <span className="flex gap-4 items-center justify-center">
            <button className="bg-black flex items-center justify-center gap-2 text-white w-full rounded-2xl py-4">
              Add to Cart <FaCartShopping />
            </button>
            <LiaHeartSolid onClick={handleFavorite} className={`text-4xl ${liked ? 'text-red-500' : 'text-black'} shadow-2xl`} />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-sm md:text-lg">Description and Fit</h1>
            <p className="text-xs text-gray-500">
              Designed with a classic collar, button-down front, and full
              sleeves (or sometimes half sleeves), it is widely worn in formal
              settings such as offices, interviews, business meetings, and
              ceremonies. Its neutral white color makes it highly versatile,
              allowing it to pair effortlessly with suits, blazers, trousers, or
              even semi-formal outfits, making it a foundational piece in any
              professional wardrobe.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm md:text-lg">Shipping</p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
              <div className="flex gap-4 items-center justify-center p-2 ">
                <MdDateRange className="text-2xl" />
                <span>
                  <p className="text-xs text-black/45">Delivery Time</p>
                  <p className="text-sm">2-3 Working Days</p>
                </span>
              </div>
              <div className="flex gap-4 items-center justify-center p-2">
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
        </div>
      </div>
    </div>
  );
};

export default ClothingDetails;
