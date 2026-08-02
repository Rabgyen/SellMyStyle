import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiShare2, FiLink, FiGrid, FiLayers, FiGlobe, FiInstagram, FiFacebook, FiYoutube, FiTwitter } from "react-icons/fi";
import ListingCard from "./ListingCard";

const PublicProfile = ({ user, sellerProfile, sellerProducts, sellerCollections }) => {
  const [activeTab, setActiveTab] = useState("items");
  const isVerifiedSeller = sellerProfile?.verification_status === "Approved" || sellerProfile?.verification_status === "Verified";

  const initials = user?.username
    ? user.username
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "?";

  // Map social links to icons
  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "instagram": return <FiInstagram className="w-4 h-4" />;
      case "facebook": return <FiFacebook className="w-4 h-4" />;
      case "youtube": return <FiYoutube className="w-4 h-4" />;
      case "x":
      case "twitter": return <FiTwitter className="w-4 h-4" />;
      case "tiktok": return <span className="font-bold text-xs">t</span>; // simple text fallback for tiktok
      default: return <FiGlobe className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-[fadeIn_0.3s_ease]">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  PINTEREST-STYLE HEADER                            */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="relative mb-6">
        {user.profile_picture ? (
          <img
            src={`http://localhost:5000${user.profile_picture}`}
            alt={user.username}
            className="h-32 w-32 rounded-full object-cover ring-4 ring-white shadow-sm"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-indigo-400 to-violet-500 text-4xl font-bold text-white ring-4 ring-white shadow-sm">
            {initials}
          </div>
        )}
      </div>

      <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
        {user.username}
      </h1>
      <p className="text-slate-500 text-sm mt-1">@{user.username.replace(/\s+/g, "").toLowerCase()}</p>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-2 text-sm text-slate-700 font-medium">
        <span><strong className="text-slate-900">{user.followers_count || 0}</strong> followers</span>
        <span className="text-slate-300">·</span>
        <span><strong className="text-slate-900">{user.following_count || 0}</strong> following</span>
        <span className="text-slate-300">·</span>
        <span className="text-slate-500 font-normal">{(user.followers_count || 0) * 10} monthly views</span>
      </div>

      {/* Bio */}
      <p className="mt-5 max-w-md text-center text-sm text-slate-600 leading-relaxed">
        {user.bio || "Welcome to my profile!"}
      </p>

      {/* Social Links (Only if verified seller) */}
      {isVerifiedSeller && sellerProfile?.socialLinks?.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {sellerProfile.socialLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
            >
              {getSocialIcon(link.platform)}
              {link.platform}
            </a>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 flex items-center gap-3">
        {/* Only show Follow button if they are a verified seller */}
        {isVerifiedSeller && (
          <button className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 shadow-sm">
            Follow
          </button>
        )}
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200">
          <FiShare2 className="w-4 h-4" />
        </button>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  TABS                                                */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mt-10 flex gap-6 border-b border-slate-200 w-full justify-center">
        <button
          onClick={() => setActiveTab("items")}
          className={`pb-3 text-sm font-semibold transition-colors ${
            activeTab === "items"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Items
        </button>
        <button
          onClick={() => setActiveTab("collection")}
          className={`pb-3 text-sm font-semibold transition-colors ${
            activeTab === "collection"
              ? "border-b-2 border-slate-900 text-slate-900"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Collection
        </button>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  TAB CONTENT                                       */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="mt-8 w-full">
        {activeTab === "items" && (
          <div className="animate-[fadeIn_0.2s_ease]">
            {sellerProducts && sellerProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {sellerProducts.map((product) => (
                  <ListingCard key={product.product_id} products={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                  <FiGrid className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">No items yet</h3>
                <p className="mt-1 text-sm text-slate-500 max-w-sm">
                  This user hasn't posted any items for sale.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "collection" && (
          <div className="animate-[fadeIn_0.2s_ease]">
            {sellerCollections && sellerCollections.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {sellerCollections.map((col) => (
                  <div key={col.category_id} className="group relative rounded-2xl overflow-hidden bg-slate-100 aspect-square cursor-pointer">
                    {col.cover_image ? (
                      <img
                        src={`http://localhost:5000${col.cover_image}`}
                        alt={col.name}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                        <FiLayers className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-5">
                      <h3 className="text-lg font-bold text-white">{col.name}</h3>
                      <p className="text-white/80 text-sm font-medium">{col.item_count} items</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                  <FiLayers className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">No collections</h3>
                <p className="mt-1 text-sm text-slate-500">
                  This user hasn't organized their items into collections.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
