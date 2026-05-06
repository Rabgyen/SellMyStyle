import React from "react";
import Listing from "../components/Listing";
import { useFavoriteContext } from "../context/FavoriteContext";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const FavoritesPage = () => {
  const { favorite } = useFavoriteContext();

  return (
    <div>
      <NavBar />
      <h1 className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8 text-2xl font-semibold mt-10">Your Favorites:</h1>
      <Listing clothing={favorite} />
      <Footer />
    </div>
  );
};

export default FavoritesPage;
