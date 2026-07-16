import React from "react";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ClothingDetails from "./pages/ClothingDetails";
import { CategoryProvider } from "./context/CategoryContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { CartProvider } from "./context/CartContext";
import ScrollToTop from "./components/ScrollToTop";
import FavoritesPage from "./pages/FavoritesPage";
import Cart from "./pages/Cart";
import Profile from "./pages/profile";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <CategoryProvider>
          <FavoriteProvider>
            <CartProvider>
              <ScrollToTop />
              <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/clothes/:id" element={<ClothingDetails />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/account" element={<Profile />} />
                </Route>
              </Routes>
            </CartProvider>
          </FavoriteProvider>
        </CategoryProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
