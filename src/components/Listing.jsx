import React, { useContext, useState } from "react";
import ListingCard from "./ListingCard";
import { useCategoryContext } from "../context/CategoryContext";

const Listing = () => {
  const clothing = [
    {
      image: "/src/assets/shirt-1.jpg",
      category: "Shirts",
      title: "Blue Casual Shirt",
      price: 1500,
    },
    {
      image: "/src/assets/shirt-2.jpg",
      category: "Shirts",
      title: "White Formal Shirt",
      price: 1700,
    },
    {
      image: "/src/assets/shirt-3.jpg",
      category: "Shirts",
      title: "Striped Shirt",
      price: 1600,
    },
    {
      image: "/src/assets/shirt-4.jpg",
      category: "Shirts",
      title: "Slim Fit Shirt",
      price: 1800,
    },
    {
      image: "/src/assets/shirt-5.jpg",
      category: "Shirts",
      title: "Printed Shirt",
      price: 1550,
    },
    {
      image: "/src/assets/shirt-6.jpg",
      category: "Shirts",
      title: "Denim Shirt",
      price: 1900,
    },
    {
      image: "/src/assets/shirt-7.jpg",
      category: "Shirts",
      title: "Checked Shirt",
      price: 1650,
    },
    {
      image: "/src/assets/shirt-8.jpg",
      category: "Shirts",
      title: "Half Sleeve Shirt",
      price: 1400,
    },
    {
      image: "/src/assets/shirt-9.jpg",
      category: "Shirts",
      title: "Linen Shirt",
      price: 2000,
    },
    {
      image: "/src/assets/shirt-10.jpg",
      category: "Shirts",
      title: "Oversized Shirt",
      price: 1750,
    },

    {
      image: "/src/assets/pant-1.jpg",
      category: "Pants",
      title: "Black Formal Pants",
      price: 2200,
    },
    {
      image: "/src/assets/pant-2.jpg",
      category: "Pants",
      title: "Slim Fit Pants",
      price: 2100,
    },
    {
      image: "/src/assets/pant-3.jpg",
      category: "Pants",
      title: "Casual Chinos",
      price: 2000,
    },
    {
      image: "/src/assets/pant-4.jpg",
      category: "Pants",
      title: "Jogger Pants",
      price: 1800,
    },
    {
      image: "/src/assets/pant-5.jpg",
      category: "Pants",
      title: "Cargo Pants",
      price: 2300,
    },
    {
      image: "/src/assets/pant-6.jpg",
      category: "Pants",
      title: "Denim Jeans",
      price: 2500,
    },
    {
      image: "/src/assets/pant-7.jpg",
      category: "Pants",
      title: "Track Pants",
      price: 1700,
    },
    {
      image: "/src/assets/pant-8.jpg",
      category: "Pants",
      title: "Formal Trousers",
      price: 2400,
    },
    {
      image: "/src/assets/pant-9.jpg",
      category: "Pants",
      title: "Relaxed Fit Pants",
      price: 2100,
    },

    {
      image: "/src/assets/shoe-1.jpg",
      category: "Shoes",
      title: "Running Shoes",
      price: 3200,
    },
    {
      image: "/src/assets/shoe-2.jpg",
      category: "Shoes",
      title: "Casual Sneakers",
      price: 3000,
    },
    {
      image: "/src/assets/shoe-3.jpg",
      category: "Shoes",
      title: "Formal Shoes",
      price: 3500,
    },
    {
      image: "/src/assets/shoe-4.jpg",
      category: "Shoes",
      title: "Sports Shoes",
      price: 3300,
    },
    {
      image: "/src/assets/shoe-5.jpg",
      category: "Shoes",
      title: "High Top Sneakers",
      price: 3400,
    },
    {
      image: "/src/assets/shoe-6.jpg",
      category: "Shoes",
      title: "Slip-On Shoes",
      price: 2800,
    },
    {
      image: "/src/assets/shoe-7.jpg",
      category: "Shoes",
      title: "Canvas Shoes",
      price: 2600,
    },
    {
      image: "/src/assets/shoe-8.jpg",
      category: "Shoes",
      title: "Training Shoes",
      price: 3100,
    },

    {
      image: "/src/assets/tie-1.jpg",
      category: "Tie",
      title: "Silk Tie",
      price: 800,
    },
    {
      image: "/src/assets/tie-2.jpg",
      category: "Tie",
      title: "Striped Tie",
      price: 750,
    },
    {
      image: "/src/assets/tie-3.jpg",
      category: "Tie",
      title: "Pattern Tie",
      price: 850,
    },
    {
      image: "/src/assets/tie-4.jpg",
      category: "Tie",
      title: "Classic Tie",
      price: 700,
    },
    {
      image: "/src/assets/tie-5.jpg",
      category: "Tie",
      title: "Formal Tie",
      price: 900,
    },
    {
      image: "/src/assets/tie-6.jpg",
      category: "Tie",
      title: "Designer Tie",
      price: 1000,
    },

    {
      image: "/src/assets/sock-1.jpg",
      category: "Socks",
      title: "Cotton Socks",
      price: 300,
    },
    {
      image: "/src/assets/sock-2.jpg",
      category: "Socks",
      title: "Ankle Socks",
      price: 250,
    },
    {
      image: "/src/assets/sock-3.jpg",
      category: "Socks",
      title: "Sports Socks",
      price: 350,
    },

    {
      image: "/src/assets/shade-1.jpg",
      category: "Shades",
      title: "Black Sunglasses",
      price: 1200,
    },
    {
      image: "/src/assets/shade-2.jpg",
      category: "Shades",
      title: "Aviator Shades",
      price: 1500,
    },
    {
      image: "/src/assets/shade-3.jpg",
      category: "Shades",
      title: "Round Shades",
      price: 1300,
    },
    {
      image: "/src/assets/shade-4.jpg",
      category: "Shades",
      title: "Polarized Shades",
      price: 1600,
    },

    {
      image: "/src/assets/cap-1.jpg",
      category: "Caps",
      title: "Baseball Cap",
      price: 600,
    },
    {
      image: "/src/assets/cap-2.jpg",
      category: "Caps",
      title: "Snapback Cap",
      price: 700,
    },
    {
      image: "/src/assets/cap-3.jpg",
      category: "Caps",
      title: "Trucker Cap",
      price: 650,
    },
    {
      image: "/src/assets/cap-4.jpg",
      category: "Caps",
      title: "Sports Cap",
      price: 750,
    },
    {
      image: "/src/assets/cap-5.jpg",
      category: "Caps",
      title: "Flat Cap",
      price: 800,
    },
    {
      image: "/src/assets/cap-6.jpg",
      category: "Caps",
      title: "Beanie Cap",
      price: 550,
    },
    {
      image: "/src/assets/cap-7.jpg",
      category: "Caps",
      title: "Casual Cap",
      price: 600,
    },

    {
      image: "/src/assets/accessories-1.jpg",
      category: "Accessories",
      title: "Leather Belt",
      price: 1100,
    },
    {
      image: "/src/assets/accessorie-2.jpg",
      category: "Accessories",
      title: "Wrist Watch",
      price: 3500,
    },
    {
      image: "/src/assets/accessorie-3.jpg",
      category: "Accessories",
      title: "Bracelet",
      price: 900,
    },
    {
      image: "/src/assets/accessorie-4.jpg",
      category: "Accessories",
      title: "Chain Necklace",
      price: 1200,
    },
    {
      image: "/src/assets/accessorie-5.jpg",
      category: "Accessories",
      title: "Wallet",
      price: 1500,
    },
    {
      image: "/src/assets/accessorie-6.jpg",
      category: "Accessories",
      title: "Ring",
      price: 800,
    },
    {
      image: "/src/assets/accessorie-7.jpg",
      category: "Accessories",
      title: "Keychain",
      price: 400,
    },
  ];

  const {category, setCategory} = useCategoryContext();

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
          <option value="Shirts">Shirts</option>
          <option value="Pants">Pants</option>
          <option value="Shoes">Shoes</option>
          <option value="Shades">Shades</option>
          <option value="Tie">Tie</option>
          <option value="Caps">Caps</option>
          <option value="Socks">Socks</option>
          <option value="Accessories">Accessories</option>
        </select>
        <div className="mt-6 inline-flex items-center gap-2 rounded text-gray-400 border border-slate-200 bg-white px-6 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50">
          Sort
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 w-full">
        {clothing
          .filter((item) =>
            category === "all" ? true : item.category === category,
          )
          .map((item) => (
            <ListingCard key={item.image} clothes={item} />
          ))}
      </div>
    </div>
  );
};

export default Listing;
