import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaRegHeart,
  FaSearch,
  FaShoppingCart,
  FaRegUser,
  FaRegCircle,
  FaBars,
  FaTimes,
} from 'react-icons/fa'
import { useCategoryContext } from "../context/CategoryContext";

const NavBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { setSearchTerm, searchTerm } = useCategoryContext();

  return (
    <header className="sticky top-0 z-1000 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="shrink-0 text-xl text-indigo-700 font-extrabold tracking-tight">SellMyStyle</Link>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {!isSearchOpen ? (
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center justify-center rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
              aria-label="Search"
            >
              <FaSearch aria-hidden="true" />
            </button>
          ) : (
            <div className="search-bar-enter flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 focus-within:border-slate-400 focus-within:bg-white">
              <FaSearch className="shrink-0 text-slate-500" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search..."
                className="w-56 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          )}

          <Link to="/cart">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
            aria-label="Cart"
          >
            <FaShoppingCart aria-hidden="true" />
          </button></Link>

          <Link to="/favorites">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
            aria-label="Saved items"
          >
            <FaRegHeart aria-hidden="true" />
          </button></Link>

          <Link to="/profile">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
              aria-label="Account"
            >
              <FaRegUser aria-hidden="true" />
            </button>
          </Link>

        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          {!isSearchOpen ? (
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center justify-center rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
              aria-label="Search"
            >
              <FaSearch aria-hidden="true" />
            </button>
          ) : (
            <div className="search-bar-enter flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 focus-within:border-slate-400 focus-within:bg-white">
              <FaSearch className="shrink-0 text-slate-500" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search..."
                className="bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={() => setIsSearchOpen(false)}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
          </button>
        </div>
      </div>



      {isMenuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2">
            <Link to="/cart" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
              Cart
            </Link>
            <Link to="/favorites" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
              Favorites
            </Link>
            <Link to="/profile" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
              Account
            </Link>
            <Link to="/" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200">
              More
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default NavBar
