import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ClothingDetails from "./pages/ClothingDetails";
import { CategoryProvider } from "./context/CategoryContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { CartProvider } from "./context/CartContext";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <BrowserRouter>
        <CategoryProvider>
          <FavoriteProvider>
              <CartProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/clothes/:id" element={<ClothingDetails />} />
                </Routes>
              </CartProvider>
          </FavoriteProvider>
        </CategoryProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
