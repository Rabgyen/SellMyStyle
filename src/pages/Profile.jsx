import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiHeart,
  FiMail,
  FiMapPin,
  FiPackage,
  FiSettings,
  FiShield,
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiEdit,
  FiCamera,
  FiBell,
  FiTrendingUp,
  FiArchive,
  FiHelpCircle,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTruck,
  FiStar,
  FiPlus,
  FiPhone,
  FiGlobe,
  FiHome,
  FiChevronRight,
  FiShare2,
} from "react-icons/fi";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useCartContext } from "../context/CartContext";
import { useFavoriteContext } from "../context/FavoriteContext";
import axios from "axios";
import SellerVerificationModal from "../components/SellerVerificationModal";

/* ─── helpers ─── */
const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const getStatusBadge = (status) => {
  const map = {
    delivered: { bg: "bg-emerald-50", text: "text-emerald-600", icon: <FiCheckCircle className="w-3.5 h-3.5" /> },
    shipped:   { bg: "bg-sky-50",     text: "text-sky-600",     icon: <FiTruck className="w-3.5 h-3.5" /> },
    processing:{ bg: "bg-amber-50",   text: "text-amber-600",   icon: <FiClock className="w-3.5 h-3.5" /> },
    cancelled: { bg: "bg-red-50",     text: "text-red-500",     icon: <FiXCircle className="w-3.5 h-3.5" /> },
    active:    { bg: "bg-emerald-50", text: "text-emerald-600", icon: <FiCheckCircle className="w-3.5 h-3.5" /> },
    sold:      { bg: "bg-violet-50",  text: "text-violet-600",  icon: <FiStar className="w-3.5 h-3.5" /> },
    pending:   { bg: "bg-amber-50",   text: "text-amber-600",   icon: <FiClock className="w-3.5 h-3.5" /> },
    draft:     { bg: "bg-slate-100",  text: "text-slate-500",   icon: <FiArchive className="w-3.5 h-3.5" /> },
  };
  return map[status] || { bg: "bg-slate-100", text: "text-slate-500", icon: <FiHelpCircle className="w-3.5 h-3.5" /> };
};

/* ─── mock data ─── */
const mockOrders = [
  { id: "ORD-2024-001", date: "2024-12-15", status: "delivered", items: 3, total: 8450, itemsPreview: ["Blue Casual Shirt", "Slim Fit Pants", "Running Shoes"] },
  { id: "ORD-2024-002", date: "2024-11-28", status: "delivered", items: 1, total: 3500, itemsPreview: ["Wrist Watch"] },
  { id: "ORD-2024-003", date: "2024-12-20", status: "shipped", items: 2, total: 5200, itemsPreview: ["Aviator Shades", "Leather Belt"] },
  { id: "ORD-2024-004", date: "2024-12-22", status: "processing", items: 1, total: 1800, itemsPreview: ["Jogger Pants"] },
];

const mockListings = [
  { id: "LST-001", title: "Vintage Denim Jacket", price: 4500, status: "active", views: 124, likes: 18, image: "/src/assets/shirt-6.jpg" },
  { id: "LST-002", title: "Nike Air Max 270", price: 8900, status: "sold", views: 312, likes: 45, image: "/src/assets/shoe-1.jpg" },
  { id: "LST-003", title: "Designer Silk Tie", price: 1200, status: "pending", views: 67, likes: 8, image: "/src/assets/tie-3.jpg" },
  { id: "LST-004", title: "Oversized Linen Shirt", price: 2800, status: "draft", views: 0, likes: 0, image: "/src/assets/shirt-9.jpg" },
];

const styleTags = [
  "Weekend layers", "Neutral tones", "Statement accessories",
  "Comfort first", "Vintage finds", "Sustainable fashion",
];

/* ────────────────────────────────────────────────────────────── */
/*  Profile page                                                  */
/* ────────────────────────────────────────────────────────────── */
const Profile = () => {
  const navigate = useNavigate();
  const { cart } = useCartContext();
  const { favorite } = useFavoriteContext();

  const [activeTab, setActiveTab] = useState("overview");
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  const { id: paramId } = useParams();
  const userId = paramId || localStorage.getItem("user_id");

  /* ─── fetch user ─── */
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) { setLoading(false); return; }
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/profile/${userId}`);
        if (response.data.success) {
          setUser(response.data.user);
          setEditForm(response.data.user);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchUser();
  }, [userId]);

  const initials = user?.username ? getInitials(user.username) : "?";
  const location = [user?.city, user?.country].filter(Boolean).join(", ") || "Not set";

  /* ─── save profile ─── */
  const saveProfile = async () => {
    try {
      await axios.put(`http://localhost:5000/profile/${userId}`, {
        username: editForm.username, phone: editForm.phone,
        country: editForm.country, city: editForm.city,
        bio: editForm.bio, nationality: editForm.nationality,
        postal_code: editForm.postal_code, street_address: editForm.street_address,
      });
      setUser(editForm);
    } catch (err) { console.error(err); }
    setIsEditing(false);
  };

  /* ─── avatar handlers ─── */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarError("");
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowed.includes(file.type)) { setAvatarError("Only JPG, PNG, GIF or WEBP images are allowed."); return; }
    if (file.size > 5 * 1024 * 1024) { setAvatarError("Image must be smaller than 5 MB."); return; }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) { setAvatarError("Please select an image first."); return; }
    try {
      setAvatarUploading(true);
      setAvatarError("");
      const formData = new FormData();
      formData.append("profilePicture", avatarFile);
      const response = await axios.post(
        `http://localhost:5000/profile/${userId}/avatar`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (response.data.success) {
        setUser((prev) => ({ ...prev, profile_picture: response.data.profile_picture }));
        setShowAvatarModal(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      } else { setAvatarError(response.data.message || "Upload failed."); }
    } catch (err) { setAvatarError(err.response?.data?.message || "Upload failed. Please try again."); }
    finally { setAvatarUploading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user_id");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/signup", { replace: true });
  };

  const dismissAvatarModal = () => {
    setShowAvatarModal(false);
    setAvatarPreview(null);
    setAvatarFile(null);
    setAvatarError("");
  };

  /* ─── tabs ─── */
  const tabs = [
    { id: "overview", label: "Overview", icon: FiUser },
    { id: "orders",   label: "Orders",   icon: FiPackage, count: mockOrders.length },
    { id: "listings", label: "Listings",  icon: FiShoppingBag, count: mockListings.filter((l) => l.status !== "draft").length },
    { id: "settings", label: "Settings",  icon: FiSettings },
  ];

  /* ─── loading / not found ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-[3px] border-slate-200 border-t-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm tracking-wide">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-400">User not found.</p>
      </div>
    );
  }

  /* ────────────────────────── RENDER ────────────────────────── */
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <NavBar />

      <main className="mx-auto max-w-2xl px-4 pt-10 pb-16 sm:px-6">

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/*  PINTEREST-STYLE PROFILE HEADER                        */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <header className="flex flex-col items-center text-center">

          {/* Avatar with gradient halo */}
          <div className="relative">
            {/* Gradient glow ring */}
            <div className="absolute -inset-2 rounded-full bg-linear-to-br from-indigo-300 via-violet-200 to-purple-300 opacity-60 blur-md" />
            <div className="relative">
              {user.profile_picture ? (
                <img
                  src={`http://localhost:5000${user.profile_picture}`}
                  alt={user.username}
                  className="h-28 w-28 rounded-full object-cover ring-4 ring-white relative z-10"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-indigo-400 to-violet-500 text-3xl font-bold text-white ring-4 ring-white relative z-10">
                  {initials}
                </div>
              )}
              {/* Camera button */}
              <button
                onClick={() => { setAvatarFile(null); setAvatarPreview(null); setAvatarError(""); setShowAvatarModal(true); }}
                className="absolute bottom-1 right-1 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-100 transition hover:text-indigo-500 hover:ring-indigo-200"
                aria-label="Change avatar"
              >
                <FiCamera className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Name */}
          <h1 className="mt-5 text-2xl font-bold text-slate-900 tracking-tight">
            {user.username}
          </h1>

          {/* Bio */}
          <p className="mt-2 max-w-sm text-sm text-slate-400 leading-relaxed line-clamp-2">
            {user.bio || "No bio yet"}
          </p>

          {/* Email + Location */}
          <div className="mt-3 flex items-center gap-1.5 text-[13px] text-slate-400">
            <FiMail className="w-3.5 h-3.5 text-slate-300" />
            <span>{user.email}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[13px] text-slate-400">
            <FiMapPin className="w-3.5 h-3.5 text-slate-300" />
            <span>{location}</span>
          </div>

          {/* Followers · Following — Pinterest style inline */}
          <p className="mt-4 text-sm text-slate-600 font-medium">
            <span className="font-bold text-slate-800">{user?.followers_count ?? 0}</span> follower{(user?.followers_count ?? 0) !== 1 ? "s" : ""}
            <span className="mx-2 text-slate-300">·</span>
            <span className="font-bold text-slate-800">{user?.following_count ?? 0}</span> following
          </p>

          {/* Action Buttons — pill shaped */}
          <div className="mt-5 flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
              <FiShare2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              <FiEdit className="w-4 h-4" />
              Edit profile
            </button>
          </div>
        </header>

        {/* Divider */}
        <div className="my-8 border-t border-slate-100" />

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/*  TAB NAVIGATION                                        */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <nav className="flex justify-center gap-1 rounded-full bg-slate-50 p-1" aria-label="Profile sections">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count != null && tab.count > 0 && (
                  <span className={`text-[11px] font-semibold rounded-full px-1.5 py-0.5 ${
                    isActive ? "bg-indigo-50 text-indigo-500" : "bg-slate-100 text-slate-400"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/*  TAB CONTENT                                           */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="mt-8">

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-[fadeIn_0.25s_ease]">

              

              {/* Account Details */}
              <div className="rounded-2xl border border-slate-100 bg-white">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
                  <h2 className="text-sm font-semibold text-slate-700">Account Details</h2>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={saveProfile} className="rounded-full bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-600">
                        Save
                      </button>
                      <button onClick={() => { setEditForm(user); setIsEditing(false); }} className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-indigo-500">
                      <FiEdit className="w-3 h-3" /> Edit
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-50">
                  {[
                    { label: "Username",    value: user.username,       icon: FiUser,   editable: true,  field: "username" },
                    { label: "Email",        value: user.email,          icon: FiMail,   editable: false },
                    { label: "Phone",        value: user.phone,          icon: FiPhone,  editable: true,  field: "phone" },
                    { label: "Nationality",  value: user.nationality,    icon: FiGlobe,  editable: true,  field: "nationality" },
                    { label: "Country",      value: user.country,        icon: FiMapPin, editable: true,  field: "country" },
                    { label: "City",         value: user.city,           icon: FiMapPin, editable: true,  field: "city" },
                    { label: "Address",      value: user.street_address, icon: FiHome,   editable: true,  field: "street_address" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-3 px-5 py-3.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="w-24 shrink-0 text-xs text-slate-400">{item.label}</span>
                        <span className="flex-1 text-sm text-slate-700 text-right">
                          {isEditing && item.editable ? (
                            <input
                              value={editForm[item.field] || ""}
                              onChange={(e) => setEditForm({ ...editForm, [item.field]: e.target.value })}
                              className="w-full text-right bg-transparent border-b border-indigo-200 focus:border-indigo-400 focus:outline-none py-0.5 text-sm"
                            />
                          ) : (
                            <span className={item.value ? "font-medium" : "text-slate-300"}>{item.value || "Not set"}</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bio */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <h2 className="text-sm font-semibold text-slate-700">Bio</h2>
                {isEditing ? (
                  <textarea
                    value={editForm.bio || ""}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="mt-3 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-50 focus:outline-none resize-none"
                    rows={3}
                    placeholder="Tell people about yourself…"
                  />
                ) : (
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    {user.bio || <span className="italic text-slate-300">No bio added yet.</span>}
                  </p>
                )}
              </div>

              {/* Style Tags */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <h2 className="text-sm font-semibold text-slate-700">Style Preferences</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {styleTags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Seller CTA */}
              <div className="rounded-2xl bg-linear-to-r from-indigo-500 to-violet-500 p-6 text-white mb-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-indigo-200">Start selling</p>
                <h3 className="mt-2 text-xl font-semibold">Become a Verified Seller</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-indigo-100/80">
                  List your items, reach buyers, and grow your fashion business.
                </p>
                <button 
                  onClick={() => setShowSellerModal(true)} 
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 cursor-pointer"
                >
                  Apply Now <FiChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Links */}
              <div className="rounded-2xl border border-slate-100 bg-white divide-y divide-slate-50">
                {[
                  { label: "Favorites", to: "/favorites", icon: FiHeart, desc: "Items you've saved" },
                  { label: "Cart",      to: "/cart",      icon: FiShoppingBag, desc: "Ready for checkout" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-400">
                      <link.icon className="w-4 h-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{link.label}</p>
                      <p className="text-xs text-slate-400">{link.desc}</p>
                    </div>
                    <FiChevronRight className="w-4 h-4 text-slate-300" />
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-4 transition hover:bg-red-50 text-left"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-300">
                    <FiLogOut className="w-4 h-4" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-400">Log Out</p>
                    <p className="text-xs text-red-300">Sign out of your account</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === "orders" && (
            <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">Order History</h2>
                <span className="text-xs text-slate-400">{mockOrders.length} orders</span>
              </div>

              {mockOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <div key={order.id} className="rounded-2xl border border-slate-100 bg-white p-5 transition hover:shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{order.id}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(order.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${badge.bg} ${badge.text}`}>
                        {badge.icon}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
                      <div>
                        <p className="text-xs text-slate-400">{order.items} item{order.items > 1 ? "s" : ""}</p>
                        <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{order.itemsPreview.join(", ")}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-700">₨{order.total.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── LISTINGS ── */}
          {activeTab === "listings" && (
            <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">My Listings</h2>
                <Link to="/sell" className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200">
                  <FiPlus className="w-3.5 h-3.5" /> New
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {mockListings.map((listing) => {
                  const badge = getStatusBadge(listing.status);
                  return (
                    <article key={listing.id} className="group rounded-2xl border border-slate-100 bg-white overflow-hidden transition hover:shadow-md">
                      <div className="relative aspect-4/3 bg-slate-50 overflow-hidden">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.src = "/src/assets/shirt-1.jpg"; }}
                        />
                        <span className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm ${badge.bg} ${badge.text}`}>
                          {badge.icon}
                          {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-slate-700 line-clamp-1">{listing.title}</h3>
                        <p className="mt-1 text-base font-bold text-indigo-500">₨{listing.price.toLocaleString()}</p>
                        <div className="mt-2.5 flex items-center gap-4 text-[11px] text-slate-400">
                          <span className="inline-flex items-center gap-1"><FiHeart className="w-3 h-3" /> {listing.likes}</span>
                          <span className="inline-flex items-center gap-1"><FiTrendingUp className="w-3 h-3" /> {listing.views}</span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-[fadeIn_0.25s_ease]">

              {/* Notifications */}
              <div className="rounded-2xl border border-slate-100 bg-white">
                <div className="px-5 py-4 border-b border-slate-50">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FiBell className="w-4 h-4 text-indigo-400" /> Notifications
                  </h2>
                </div>
                <div className="divide-y divide-slate-50">
                  {[
                    { label: "Order Updates",      desc: "Shipping & delivery alerts",     on: true },
                    { label: "Promotions",          desc: "Sales and special offers",       on: true },
                    { label: "New Arrivals",        desc: "Weekly fresh inventory",         on: false },
                    { label: "Price Drops",         desc: "Saved items go on sale",         on: true },
                    { label: "Seller Updates",      desc: "Listing performance",            on: true },
                  ].map((item, i) => (
                    <label key={i} className="flex items-center justify-between px-5 py-3.5 cursor-pointer transition hover:bg-slate-50/50">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{item.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                      <input type="checkbox" defaultChecked={item.on} className="h-4 w-4 rounded border-slate-300 accent-indigo-500" />
                    </label>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="rounded-2xl border border-slate-100 bg-white">
                <div className="px-5 py-4 border-b border-slate-50">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FiShield className="w-4 h-4 text-indigo-400" /> Security
                  </h2>
                </div>
                <div className="divide-y divide-slate-50">
                  {[
                    { label: "Two-Step Verification", desc: "Extra security layer",        action: "Enable" },
                    { label: "Change Password",       desc: "Last changed 3 months ago",   action: "Update" },
                    { label: "Active Sessions",       desc: "2 devices logged in",         action: "Manage" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{item.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                      <button className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50">
                        {item.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appearance */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiSettings className="w-4 h-4 text-indigo-400" /> Appearance
                </h2>
                <div className="mt-4 flex gap-2">
                  {["Light", "Dark", "System"].map((theme) => (
                    <label key={theme} className="flex-1 rounded-xl border-2 border-slate-100 bg-slate-50/50 p-3 text-center cursor-pointer transition hover:border-indigo-200 has-checked:border-indigo-400 has-checked:bg-indigo-50">
                      <input type="radio" name="theme" defaultChecked={theme === "System"} className="sr-only" />
                      <p className="text-sm font-medium text-slate-600">{theme}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5">
                <h2 className="text-xs font-semibold text-red-400 uppercase tracking-widest">Danger Zone</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-medium text-red-400 transition hover:bg-red-50">
                    Deactivate Account
                  </button>
                  <button className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-medium text-red-400 transition hover:bg-red-50">
                    Delete All Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  AVATAR MODAL                                            */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showAvatarModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={dismissAvatarModal}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-slate-800">Update Photo</h3>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG, GIF or WEBP · max 5 MB</p>

            {/* Preview */}
            <div className="flex justify-center my-5">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="h-24 w-24 rounded-full object-cover ring-[3px] ring-indigo-100" />
              ) : user.profile_picture ? (
                <img src={`http://localhost:5000${user.profile_picture}`} alt={user.username} className="h-24 w-24 rounded-full object-cover ring-[3px] ring-indigo-100" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-indigo-400 to-violet-500 text-2xl font-bold text-white">
                  {initials}
                </div>
              )}
            </div>

            {/* File picker */}
            <input type="file" accept="image/*" className="sr-only" id="avatar-upload" onChange={handleAvatarChange} />
            <label
              htmlFor="avatar-upload"
              className="flex flex-col items-center gap-1.5 w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center cursor-pointer transition hover:border-indigo-300 hover:bg-indigo-50/30"
            >
              <FiCamera className="w-5 h-5 text-slate-300" />
              <span className="text-xs font-medium text-slate-500">{avatarFile ? avatarFile.name : "Choose a photo"}</span>
            </label>

            {avatarError && (
              <p className="mt-3 text-xs text-red-500 flex items-center gap-1">
                <FiXCircle className="w-3.5 h-3.5" /> {avatarError}
              </p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={dismissAvatarModal}
                className="flex-1 rounded-full border border-slate-200 px-4 py-2.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50"
                disabled={avatarUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleAvatarUpload}
                disabled={!avatarFile || avatarUploading}
                className="flex-1 rounded-full bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {avatarUploading ? (
                  <><span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /> Uploading…</>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  SELLER VERIFICATION MODAL                               */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SellerVerificationModal isOpen={showSellerModal} onClose={() => setShowSellerModal(false)} />

      <Footer />
    </div>
  );
};

export default Profile;