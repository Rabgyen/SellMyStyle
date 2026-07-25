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
  FiGrid,
  FiLayers,
  FiUpload,
  FiImage,
  FiAlertCircle,
  FiCheck,
  FiX,
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
    delivered: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      icon: <FiCheckCircle className="w-3.5 h-3.5" />,
    },
    shipped: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      icon: <FiTruck className="w-3.5 h-3.5" />,
    },
    processing: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      icon: <FiClock className="w-3.5 h-3.5" />,
    },
    cancelled: {
      bg: "bg-red-50",
      text: "text-red-500",
      icon: <FiXCircle className="w-3.5 h-3.5" />,
    },
    active: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      icon: <FiCheckCircle className="w-3.5 h-3.5" />,
    },
    sold: {
      bg: "bg-violet-50",
      text: "text-violet-600",
      icon: <FiStar className="w-3.5 h-3.5" />,
    },
    pending: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      icon: <FiClock className="w-3.5 h-3.5" />,
    },
    draft: {
      bg: "bg-slate-100",
      text: "text-slate-500",
      icon: <FiArchive className="w-3.5 h-3.5" />,
    },
  };
  return (
    map[status] || {
      bg: "bg-slate-100",
      text: "text-slate-500",
      icon: <FiHelpCircle className="w-3.5 h-3.5" />,
    }
  );
};

/* ─── mock data ─── */
const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-12-15",
    status: "delivered",
    items: 3,
    total: 8450,
    itemsPreview: ["Blue Casual Shirt", "Slim Fit Pants", "Running Shoes"],
  },
  {
    id: "ORD-2024-002",
    date: "2024-11-28",
    status: "delivered",
    items: 1,
    total: 3500,
    itemsPreview: ["Wrist Watch"],
  },
  {
    id: "ORD-2024-003",
    date: "2024-12-20",
    status: "shipped",
    items: 2,
    total: 5200,
    itemsPreview: ["Aviator Shades", "Leather Belt"],
  },
  {
    id: "ORD-2024-004",
    date: "2024-12-22",
    status: "processing",
    items: 1,
    total: 1800,
    itemsPreview: ["Jogger Pants"],
  },
];

const mockListings = [
  {
    id: "LST-001",
    title: "Vintage Denim Jacket",
    price: 4500,
    status: "active",
    views: 124,
    likes: 18,
    image: "/src/assets/shirt-6.jpg",
  },
  {
    id: "LST-002",
    title: "Nike Air Max 270",
    price: 8900,
    status: "sold",
    views: 312,
    likes: 45,
    image: "/src/assets/shoe-1.jpg",
  },
  {
    id: "LST-003",
    title: "Designer Silk Tie",
    price: 1200,
    status: "pending",
    views: 67,
    likes: 8,
    image: "/src/assets/tie-3.jpg",
  },
  {
    id: "LST-004",
    title: "Oversized Linen Shirt",
    price: 2800,
    status: "draft",
    views: 0,
    likes: 0,
    image: "/src/assets/shirt-9.jpg",
  },
];

const styleTags = [
  "Weekend layers",
  "Neutral tones",
  "Statement accessories",
  "Comfort first",
  "Vintage finds",
  "Sustainable fashion",
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
  const [showPostItemModal, setShowPostItemModal] = useState(false);
  const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false);
  const [user, setUser] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);
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
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await axios.get(
          `http://localhost:5000/profile/${userId}`,
        );

        if (response.data.success) {
          setUser(response.data.user);

          // Save seller profile separately
          setSellerProfile(response.data.sellerProfile || null);

          // Debug
          console.log("User:", response.data.user);
          console.log("Seller:", response.data.sellerProfile);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  /* ─── fetch seller products & collections if user is a seller ─── */
  const [sellerProducts, setSellerProducts] = useState([]);
  const [sellerCollections, setSellerCollections] = useState([]);
  const [sellerLoading, setSellerLoading] = useState(false);

  useEffect(() => {
    if (sellerProfile?.seller_id) {
      const fetchSellerData = async () => {
        setSellerLoading(true);
        try {
          const [productsRes, collectionsRes] = await Promise.all([
            axios.get(
              `http://localhost:5000/api/seller/${sellerProfile.seller_id}/products`,
            ),
            axios.get(
              `http://localhost:5000/api/seller/${sellerProfile.seller_id}/collections`,
            ),
          ]);
          if (productsRes.data.success)
            setSellerProducts(productsRes.data.products);
          if (collectionsRes.data.success)
            setSellerCollections(collectionsRes.data.collections);
        } catch (err) {
          console.error("Error fetching seller data:", err);
        } finally {
          setSellerLoading(false);
        }
      };
      fetchSellerData();
    } else {
      setSellerProducts([]);
      setSellerCollections([]);
    }
  }, [sellerProfile?.seller_id]);

  const initials = user?.username ? getInitials(user.username) : "?";
  const location =
    [user?.city, user?.country].filter(Boolean).join(", ") || "Not set";

  /* ─── save profile ─── */
  const saveProfile = async () => {
    try {
      await axios.put(`http://localhost:5000/profile/${userId}`, {
        username: editForm.username,
        phone: editForm.phone,
        country: editForm.country,
        city: editForm.city,
        bio: editForm.bio,
        nationality: editForm.nationality,
        postal_code: editForm.postal_code,
        street_address: editForm.street_address,
      });
      setUser(editForm);
    } catch (err) {
      console.error(err);
    }
    setIsEditing(false);
  };

  /* ─── avatar handlers ─── */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarError("");
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowed.includes(file.type)) {
      setAvatarError("Only JPG, PNG, GIF or WEBP images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image must be smaller than 5 MB.");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setAvatarError("Please select an image first.");
      return;
    }
    try {
      setAvatarUploading(true);
      setAvatarError("");
      const formData = new FormData();
      formData.append("profilePicture", avatarFile);
      const response = await axios.post(
        `http://localhost:5000/profile/${userId}/avatar`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          profile_picture: response.data.profile_picture,
        }));
        setShowAvatarModal(false);
        setAvatarFile(null);
        setAvatarPreview(null);
      } else {
        setAvatarError(response.data.message || "Upload failed.");
      }
    } catch (err) {
      setAvatarError(
        err.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setAvatarUploading(false);
    }
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
  const isOwnProfile = userId === localStorage.getItem("user_id");
  const isVerifiedSeller =
    sellerProfile?.verification_status === "Approved";

  const tabs = [
    { id: "overview", label: "Overview", icon: FiUser },
    {
      id: "orders",
      label: "Orders",
      icon: FiPackage,
      count: mockOrders.length,
    },
    {
      id: "listings",
      label: "Listings",
      icon: FiShoppingBag,
      count: mockListings.filter((l) => l.status !== "draft").length,
    },
    // Show Seller Storefront for any verified/approved seller
    ...(isVerifiedSeller
      ? [
          { id: "storefront", label: "Seller Storefront", icon: FiGrid },
        ]
      : []),
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  // Sub-navigation state for Seller Storefront
  const [storefrontTab, setStorefrontTab] = useState("items");

  /* ─── loading / not found ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-[3px] border-slate-200 border-t-indigo-500 animate-spin" />
          <p className="text-slate-400 text-sm tracking-wide">
            Loading profile…
          </p>
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
                onClick={() => {
                  setAvatarFile(null);
                  setAvatarPreview(null);
                  setAvatarError("");
                  setShowAvatarModal(true);
                }}
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
            <span className="font-bold text-slate-800">
              {user?.followers_count ?? 0}
            </span>{" "}
            follower{(user?.followers_count ?? 0) !== 1 ? "s" : ""}
            <span className="mx-2 text-slate-300">·</span>
            <span className="font-bold text-slate-800">
              {user?.following_count ?? 0}
            </span>{" "}
            following
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
        <nav
          className="flex justify-center gap-1 rounded-full bg-slate-50 p-1"
          aria-label="Profile sections"
        >
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
                  <span
                    className={`text-[11px] font-semibold rounded-full px-1.5 py-0.5 ${
                      isActive
                        ? "bg-indigo-50 text-indigo-500"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
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
                  <h2 className="text-sm font-semibold text-slate-700">
                    Account Details
                  </h2>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={saveProfile}
                        className="rounded-full bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditForm(user);
                          setIsEditing(false);
                        }}
                        className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition hover:text-indigo-500"
                    >
                      <FiEdit className="w-3 h-3" /> Edit
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-50">
                  {[
                    {
                      label: "Username",
                      value: user.username,
                      icon: FiUser,
                      editable: true,
                      field: "username",
                    },
                    {
                      label: "Email",
                      value: user.email,
                      icon: FiMail,
                      editable: false,
                    },
                    {
                      label: "Phone",
                      value: user.phone,
                      icon: FiPhone,
                      editable: true,
                      field: "phone",
                    },
                    {
                      label: "Nationality",
                      value: user.nationality,
                      icon: FiGlobe,
                      editable: true,
                      field: "nationality",
                    },
                    {
                      label: "Country",
                      value: user.country,
                      icon: FiMapPin,
                      editable: true,
                      field: "country",
                    },
                    {
                      label: "City",
                      value: user.city,
                      icon: FiMapPin,
                      editable: true,
                      field: "city",
                    },
                    {
                      label: "Address",
                      value: user.street_address,
                      icon: FiHome,
                      editable: true,
                      field: "street_address",
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 px-5 py-3.5"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                          <Icon className="w-3.5 h-3.5" />
                        </span>
                        <span className="w-24 shrink-0 text-xs text-slate-400">
                          {item.label}
                        </span>
                        <span className="flex-1 text-sm text-slate-700 text-right">
                          {isEditing && item.editable ? (
                            <input
                              value={editForm[item.field] || ""}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  [item.field]: e.target.value,
                                })
                              }
                              className="w-full text-right bg-transparent border-b border-indigo-200 focus:border-indigo-400 focus:outline-none py-0.5 text-sm"
                            />
                          ) : (
                            <span
                              className={
                                item.value ? "font-medium" : "text-slate-300"
                              }
                            >
                              {item.value || "Not set"}
                            </span>
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
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    className="mt-3 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-50 focus:outline-none resize-none"
                    rows={3}
                    placeholder="Tell people about yourself…"
                  />
                ) : (
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    {user.bio || (
                      <span className="italic text-slate-300">
                        No bio added yet.
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Style Tags */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5">
                <h2 className="text-sm font-semibold text-slate-700">
                  Style Preferences
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {styleTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Seller Storefront - Items Posted & Collection Sets */}
              

              {/* Seller CTA */}
              {!isVerifiedSeller && (
                <div className="rounded-2xl bg-linear-to-r from-indigo-500 to-violet-500 p-6 text-white mb-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-indigo-200">
                    Start selling
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">
                    Become a Verified Seller
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-indigo-100/80">
                    List your items, reach buyers, and grow your fashion
                    business.
                  </p>
                  <button
                    onClick={() => setShowSellerModal(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 cursor-pointer"
                  >
                    Apply Now <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Quick Links */}
              <div className="rounded-2xl border border-slate-100 bg-white divide-y divide-slate-50">
                {[
                  {
                    label: "Favorites",
                    to: "/favorites",
                    icon: FiHeart,
                    desc: "Items you've saved",
                  },
                  {
                    label: "Cart",
                    to: "/cart",
                    icon: FiShoppingBag,
                    desc: "Ready for checkout",
                  },
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
                      <p className="text-sm font-medium text-slate-700">
                        {link.label}
                      </p>
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
                    <p className="text-xs text-red-300">
                      Sign out of your account
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === "orders" && (
            <div className="space-y-4 animate-[fadeIn_0.25s_ease]">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-700">
                  Order History
                </h2>
                <span className="text-xs text-slate-400">
                  {mockOrders.length} orders
                </span>
              </div>

              {mockOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-slate-100 bg-white p-5 transition hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {order.id}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${badge.bg} ${badge.text}`}
                      >
                        {badge.icon}
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-3">
                      <div>
                        <p className="text-xs text-slate-400">
                          {order.items} item{order.items > 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                          {order.itemsPreview.join(", ")}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        ₨{order.total.toLocaleString()}
                      </p>
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
                <h2 className="text-sm font-semibold text-slate-700">
                  My Listings
                </h2>
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                >
                  <FiPlus className="w-3.5 h-3.5" /> New
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {mockListings.map((listing) => {
                  const badge = getStatusBadge(listing.status);
                  return (
                    <article
                      key={listing.id}
                      className="group rounded-2xl border border-slate-100 bg-white overflow-hidden transition hover:shadow-md"
                    >
                      <div className="relative aspect-4/3 bg-slate-50 overflow-hidden">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = "/src/assets/shirt-1.jpg";
                          }}
                        />
                        <span
                          className={`absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm ${badge.bg} ${badge.text}`}
                        >
                          {badge.icon}
                          {listing.status.charAt(0).toUpperCase() +
                            listing.status.slice(1)}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-slate-700 line-clamp-1">
                          {listing.title}
                        </h3>
                        <p className="mt-1 text-base font-bold text-indigo-500">
                          ₨{listing.price.toLocaleString()}
                        </p>
                        <div className="mt-2.5 flex items-center gap-4 text-[11px] text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <FiHeart className="w-3 h-3" /> {listing.likes}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <FiTrendingUp className="w-3 h-3" /> {listing.views}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SELLER STOREFRONT ── */}
          {activeTab === "storefront" && isVerifiedSeller && (
            <div className="space-y-6 animate-[fadeIn_0.25s_ease]">
              {/* Sub-navigation for Storefront */}
              <nav className="flex gap-2 rounded-full bg-slate-50 p-1" aria-label="Storefront sections">
                {[
                  { id: "items", label: "Items Posted", icon: FiGrid, count: sellerProducts.length },
                  { id: "collections", label: "Collection Sets", icon: FiLayers, count: sellerCollections.length },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStorefrontTab(tab.id)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      storefrontTab === tab.id
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`text-[11px] font-semibold rounded-full px-1.5 py-0.5 ${
                        storefrontTab === tab.id ? "bg-indigo-50 text-indigo-500" : "bg-slate-100 text-slate-400"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* ── ITEMS POSTED ── */}
              {storefrontTab === "items" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-700">Items Posted</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{sellerProducts.length} item{sellerProducts.length !== 1 ? "s" : ""}</span>
                      <button
                        onClick={() => setShowPostItemModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-600"
                      >
                        <FiPlus className="w-3.5 h-3.5" />
                        Post New Item
                      </button>
                    </div>
                  </div>

                  {sellerLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-indigo-500 animate-spin" />
                    </div>
                  ) : sellerProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <FiPackage className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500">No items</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {sellerProducts.map((product) => {
                        const primaryImage = product.primary_image || `/src/assets/shirt-1.jpg`;
                        return (
                          <article key={product.product_id} className="group rounded-2xl border border-slate-100 bg-white overflow-hidden transition hover:shadow-md">
                            <div className="relative aspect-4/3 bg-slate-50 overflow-hidden">
                              <img
                                src={`http://localhost:5000${primaryImage}`}
                                alt={product.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => { e.currentTarget.src = "/src/assets/shirt-1.jpg"; }}
                              />
                              <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium bg-emerald-50 text-emerald-600">
                                <FiCheckCircle className="w-3 h-3" />
                                Active
                              </span>
                            </div>
                            <div className="p-4">
                              <h3 className="text-sm font-semibold text-slate-700 line-clamp-1">{product.title}</h3>
                              <p className="mt-1 text-base font-bold text-indigo-500">₨{Number(product.price).toLocaleString()}</p>
                              <div className="mt-2.5 flex items-center gap-4 text-[11px] text-slate-400">
                                <span className="inline-flex items-center gap-1"><FiHeart className="w-3 h-3" /> {product.views || 0}</span>
                                <span className="inline-flex items-center gap-1"><FiTrendingUp className="w-3 h-3" /> {product.views || 0}</span>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ── COLLECTION SETS ── */}
              {storefrontTab === "collections" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-700">Collection Sets</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{sellerCollections.length} collection{sellerCollections.length !== 1 ? "s" : ""}</span>
                      <button
                        onClick={() => setShowCreateCollectionModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-600"
                      >
                        <FiPlus className="w-3.5 h-3.5" />
                        Create Collection
                      </button>
                    </div>
                  </div>

                  {sellerLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-indigo-500 animate-spin" />
                    </div>
                  ) : sellerCollections.length === 0 ? (
                    <div className="text-center py-12">
                      <FiLayers className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-slate-500">No items</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {sellerCollections.map((collection) => {
                        const itemCount = collection.item_count || 0;
                        const coverImage = collection.cover_image || `/src/assets/shirt-1.jpg`;
                        return (
                          <article key={collection.category_id} className="group rounded-2xl border border-slate-100 bg-white overflow-hidden transition hover:shadow-md">
                            <div className="relative aspect-4/3 bg-slate-50 overflow-hidden">
                              <img
                                src={`http://localhost:5000${coverImage}`}
                                alt={collection.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => { e.currentTarget.src = "/src/assets/shirt-1.jpg"; }}
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute bottom-3 left-3 right-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium">
                                  <FiGrid className="w-3 h-3" /> {itemCount} item{itemCount !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="text-sm font-semibold text-slate-700 line-clamp-1">{collection.name}</h3>
                              <p className="mt-1 text-xs text-slate-400">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
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
                    {
                      label: "Order Updates",
                      desc: "Shipping & delivery alerts",
                      on: true,
                    },
                    {
                      label: "Promotions",
                      desc: "Sales and special offers",
                      on: true,
                    },
                    {
                      label: "New Arrivals",
                      desc: "Weekly fresh inventory",
                      on: false,
                    },
                    {
                      label: "Price Drops",
                      desc: "Saved items go on sale",
                      on: true,
                    },
                    {
                      label: "Seller Updates",
                      desc: "Listing performance",
                      on: true,
                    },
                  ].map((item, i) => (
                    <label
                      key={i}
                      className="flex items-center justify-between px-5 py-3.5 cursor-pointer transition hover:bg-slate-50/50"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-600">
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={item.on}
                        className="h-4 w-4 rounded border-slate-300 accent-indigo-500"
                      />
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
                    {
                      label: "Two-Step Verification",
                      desc: "Extra security layer",
                      action: "Enable",
                    },
                    {
                      label: "Change Password",
                      desc: "Last changed 3 months ago",
                      action: "Update",
                    },
                    {
                      label: "Active Sessions",
                      desc: "2 devices logged in",
                      action: "Manage",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-5 py-3.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-600">
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.desc}
                        </p>
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
                    <label
                      key={theme}
                      className="flex-1 rounded-xl border-2 border-slate-100 bg-slate-50/50 p-3 text-center cursor-pointer transition hover:border-indigo-200 has-checked:border-indigo-400 has-checked:bg-indigo-50"
                    >
                      <input
                        type="radio"
                        name="theme"
                        defaultChecked={theme === "System"}
                        className="sr-only"
                      />
                      <p className="text-sm font-medium text-slate-600">
                        {theme}
                      </p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="rounded-2xl border border-red-100 bg-red-50/30 p-5">
                <h2 className="text-xs font-semibold text-red-400 uppercase tracking-widest">
                  Danger Zone
                </h2>
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
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-slate-800">
              Update Photo
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              JPG, PNG, GIF or WEBP · max 5 MB
            </p>

            {/* Preview */}
            <div className="flex justify-center my-5">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="h-24 w-24 rounded-full object-cover ring-[3px] ring-indigo-100"
                />
              ) : user.profile_picture ? (
                <img
                  src={`http://localhost:5000${user.profile_picture}`}
                  alt={user.username}
                  className="h-24 w-24 rounded-full object-cover ring-[3px] ring-indigo-100"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-indigo-400 to-violet-500 text-2xl font-bold text-white">
                  {initials}
                </div>
              )}
            </div>

            {/* File picker */}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              id="avatar-upload"
              onChange={handleAvatarChange}
            />
            <label
              htmlFor="avatar-upload"
              className="flex flex-col items-center gap-1.5 w-full rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center cursor-pointer transition hover:border-indigo-300 hover:bg-indigo-50/30"
            >
              <FiCamera className="w-5 h-5 text-slate-300" />
              <span className="text-xs font-medium text-slate-500">
                {avatarFile ? avatarFile.name : "Choose a photo"}
              </span>
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
                  <>
                    <span className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />{" "}
                    Uploading…
                  </>
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
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  POST NEW ITEM MODAL                                     */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showPostItemModal && <PostItemModal
        isOpen={showPostItemModal}
        onClose={() => setShowPostItemModal(false)}
        sellerId={sellerProfile?.seller_id}
        onSuccess={() => {
          setShowPostItemModal(false);
        }}
      />}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  CREATE COLLECTION MODAL                                 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {showCreateCollectionModal && <CreateCollectionModal
        isOpen={showCreateCollectionModal}
        onClose={() => setShowCreateCollectionModal(false)}
        sellerId={sellerProfile?.seller_id}
        onSuccess={() => {
          setShowCreateCollectionModal(false);
        }}
      />}

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/*  SELLER VERIFICATION MODAL                               */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <SellerVerificationModal
        isOpen={showSellerModal}
        onClose={() => setShowSellerModal(false)}
      />

      <Footer />
    </div>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  POST NEW ITEM MODAL                                              */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const PostItemModal = ({ isOpen, onClose, sellerId, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    description: "",
    category: "",
    subcategory: "",
    // Pricing
    price: "",
    compareAtPrice: "",
    // Inventory
    sku: "",
    quantity: "",
    // Clothing Specific
    brand: "",
    condition: "new",
    size: "",
    color: "",
    material: "",
    pattern: "",
    sleeveLength: "",
    neckline: "",
    fit: "",
    occasion: "",
    season: "",
    // Measurements
    chest: "",
    waist: "",
    hips: "",
    length: "",
    shoulder: "",
    sleeve: "",
    // Shipping
    weight: "",
    length_dim: "",
    width_dim: "",
    height_dim: "",
    // Tags
    tags: "",
  });

  if (!isOpen) return null;

  const categories = [
    { value: "tops", label: "Tops", subcategories: ["T-Shirts", "Shirts", "Blouses", "Tank Tops", "Crop Tops", "Bodysuits", "Sweaters", "Cardigans", "Hoodies", "Sweatshirts"] },
    { value: "bottoms", label: "Bottoms", subcategories: ["Jeans", "Trousers", "Shorts", "Skirts", "Leggings", "Joggers", "Cargo Pants", "Chinos"] },
    { value: "dresses", label: "Dresses", subcategories: ["Mini", "Midi", "Maxi", "Mini", "Bodycon", "A-Line", "Wrap", "Shift", "Slip", "Sundress"] },
    { value: "outerwear", label: "Outerwear", subcategories: ["Jackets", "Coats", "Blazers", "Vests", "Parkas", "Trench Coats", "Puffer Jackets", "Leather Jackets", "Denim Jackets"] },
    { value: "activewear", label: "Activewear", subcategories: ["Sports Bras", "Leggings", "Shorts", "Tank Tops", "Jackets", "Joggers", "Yoga Pants", "Running Shorts"] },
    { value: "swimwear", label: "Swimwear", subcategories: ["One-Piece", "Bikinis", "Tankinis", "Swim Trunks", "Board Shorts", "Rash Guards"] },
    { value: "shoes", label: "Shoes", subcategories: ["Sneakers", "Boots", "Sandals", "Heels", "Flats", "Loafers", "Oxfords", "Slides"] },
    { value: "accessories", label: "Accessories", subcategories: ["Bags", "Belts", "Hats", "Scarves", "Jewelry", "Sunglasses", "Wallets", "Gloves"] },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50", "One Size"];
  const conditions = [
    { value: "new", label: "New with Tags" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
  ];
  const fits = ["Slim", "Regular", "Relaxed", "Oversized", "Skinny", "Straight", "Bootcut", "Tapered"];
  const occasions = ["Casual", "Work", "Formal", "Party", "Wedding", "Date Night", "Travel", "Gym", "Beach", "Festival"];
  const seasons = ["Spring", "Summer", "Fall", "Winter", "All Season"];
  const sleeveLengths = ["Sleeveless", "Short Sleeve", "3/4 Sleeve", "Long Sleeve", "Cap Sleeve"];
  const necklines = ["Crew Neck", "V-Neck", "Scoop Neck", "Boat Neck", "Off-Shoulder", "Halter", "Square Neck", "Sweetheart", "Turtleneck", "Collared"];
  const patterns = ["Solid", "Striped", "Floral", "Polka Dot", "Plaid", "Animal Print", "Geometric", "Abstract", "Tie-Dye", "Camouflage"];
  const materials = ["Cotton", "Polyester", "Wool", "Silk", "Linen", "Denim", "Leather", "Suede", "Velvet", "Chiffon", "Satin", "Jersey", "Knit", "Fleece", "Nylon", "Spandex", "Rayon", "Viscose", "Cashmere", "Tweed"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(f => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024);
    if (validFiles.length + images.length > 10) {
      setError("Maximum 10 images allowed");
      return;
    }
    setImages(prev => [...prev, ...validFiles]);
    validFiles.forEach(file => {
      setImagePreviews(prev => [...prev, URL.createObjectURL(file)]);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.title.trim()) return "Title is required";
      if (!formData.category) return "Category is required";
      if (!formData.condition) return "Condition is required";
      if (!formData.size) return "Size is required";
      if (!formData.color) return "Color is required";
    }
    if (step === 2) {
      if (!formData.price || Number(formData.price) <= 0) return "Valid price is required";
      if (!formData.quantity || Number(formData.quantity) < 0) return "Valid quantity is required";
    }
    if (step === 3) {
      if (images.length === 0) return "At least one image is required";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setError("");
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("seller_id", sellerId);
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null) fd.append(key, value);
      });
      images.forEach((img, i) => fd.append(`images`, img));

      const response = await axios.post(
        `http://localhost:5000/api/seller/${sellerId}/products`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        onSuccess?.();
      } else {
        setError(response.data.message || "Failed to create item");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const progressSteps = [
    { num: 1, label: "Basic Info" },
    { num: 2, label: "Pricing & Stock" },
    { num: 3, label: "Images" },
    { num: 4, label: "Details" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h3 className="text-lg font-semibold text-slate-800">Post New Clothing Item</h3>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            {progressSteps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition ${
                    step >= s.num ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-400"
                  }`}>
                    {step > s.num ? <FiCheck className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`hidden sm:block text-xs font-medium ${
                    step >= s.num ? "text-indigo-500" : "text-slate-400"
                  }`}>{s.label}</span>
                </div>
                {i < progressSteps.length - 1 && (
                  <div className={`hidden md:block flex-1 h-1 mx-2 rounded ${
                    step > s.num ? "bg-indigo-500" : "bg-slate-200"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Basic Information</h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Item Title *</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Vintage Levi's 501 Straight Leg Jeans"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select category</option>
                    {categories.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Subcategory *</label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    disabled={!formData.category}
                  >
                    <option value="">Select subcategory</option>
                    {categories.find(c => c.value === formData.category)?.subcategories.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Brand</label>
                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g., Nike, Zara, Vintage"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Condition *</label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    {conditions.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Size *</label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select size</option>
                    {sizes.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Color *</label>
                  <input
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g., Navy Blue, Black, Floral Print"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Material</label>
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select material</option>
                    {materials.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Pattern</label>
                  <select
                    name="pattern"
                    value={formData.pattern}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select pattern</option>
                    {patterns.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Fit</label>
                  <select
                    name="fit"
                    value={formData.fit}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select fit</option>
                    {fits.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Occasion</label>
                  <select
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select occasion</option>
                    {occasions.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Season</label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select season</option>
                    {seasons.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Sleeve Length</label>
                  <select
                    name="sleeveLength"
                    value={formData.sleeveLength}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select sleeve length</option>
                    {sleeveLengths.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Neckline</label>
                  <select
                    name="neckline"
                    value={formData.neckline}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">Select neckline</option>
                    {necklines.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the item in detail: fabric feel, fit notes, any flaws, styling suggestions..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: Pricing & Inventory */}
          {step === 2 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Pricing & Inventory</h4>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Price (₨) *</label>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Compare at Price (₨)</label>
                  <input
                    name="compareAtPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={handleChange}
                    placeholder="Original price (for discount display)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Quantity *</label>
                  <input
                    name="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="1"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">SKU</label>
                  <input
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Auto-generated if empty"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {step === 3 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Product Images</h4>
              <p className="text-xs text-slate-500">Upload up to 10 images. First image will be the main thumbnail.</p>

              <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center cursor-pointer transition hover:border-indigo-300 hover:bg-indigo-50/30">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleImageChange}
                  disabled={images.length >= 10}
                />
                <FiUpload className="w-8 h-8 text-slate-300" />
                <span className="text-sm font-medium text-slate-500">
                  {images.length >= 10 ? "Maximum images reached" : "Click or drag images"}
                </span>
              </label>

              {images.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {imagePreviews.map((preview, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200">
                      <img src={preview} alt={`Preview ${i + 1}`} className="h-full w-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-2 left-2 rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] font-medium text-white">Main</span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                        aria-label="Remove image"
                      >
                        <FiX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Measurements & Details */}
          {step === 4 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Measurements (cm) - Optional but Recommended</h4>
              <p className="text-xs text-slate-500">Flat lay measurements help buyers choose the right size.</p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Chest/Bust</label>
                  <input
                    name="chest"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.chest}
                    onChange={handleChange}
                    placeholder="e.g., 50"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Waist</label>
                  <input
                    name="waist"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.waist}
                    onChange={handleChange}
                    placeholder="e.g., 40"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Hips</label>
                  <input
                    name="hips"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.hips}
                    onChange={handleChange}
                    placeholder="e.g., 52"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Length</label>
                  <input
                    name="length"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.length}
                    onChange={handleChange}
                    placeholder="e.g., 70"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Shoulder</label>
                  <input
                    name="shoulder"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.shoulder}
                    onChange={handleChange}
                    placeholder="e.g., 45"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Sleeve</label>
                  <input
                    name="sleeve"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.sleeve}
                    onChange={handleChange}
                    placeholder="e.g., 60"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Shipping Dimensions (cm) & Weight</h4>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Weight (kg)</label>
                    <input
                      name="weight"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="0.5"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Length</label>
                    <input
                      name="length_dim"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.length_dim}
                      onChange={handleChange}
                      placeholder="30"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Width</label>
                    <input
                      name="width_dim"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.width_dim}
                      onChange={handleChange}
                      placeholder="20"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Height</label>
                    <input
                      name="height_dim"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.height_dim}
                      onChange={handleChange}
                      placeholder="5"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Tags (comma-separated)</label>
                <input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="vintage, summer, cotton, sale, handmade"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              disabled={loading}
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
              disabled={loading}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                  Posting...
                </>
              ) : (
                "Post Item"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*  CREATE COLLECTION MODAL                                          */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const CreateCollectionModal = ({ isOpen, onClose, sellerId, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sellerProductsList, setSellerProductsList] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true,
  });

  useEffect(() => {
    if (isOpen && sellerId) {
      const fetchProducts = async () => {
        setProductsLoading(true);
        try {
          const res = await axios.get(`http://localhost:5000/api/seller/${sellerId}/products`);
          if (res.data.success) setSellerProductsList(res.data.products || []);
        } catch (err) {
          console.error("Failed to fetch products:", err);
        } finally {
          setProductsLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen, sellerId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Cover image must be smaller than 5 MB");
      return;
    }
    setCoverImage(file);
    setCoverPreview(URL.createObjectURL(file));
    setError("");
  };

  const toggleProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) return "Collection name is required";
      if (!formData.description.trim()) return "Description is required";
    }
    if (step === 2) {
      if (selectedProducts.length === 0) return "Select at least one product for the collection";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setError("");
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setLoading(true);
    setError("");

    try {
      const fd = new FormData();
      fd.append("seller_id", sellerId);
      fd.append("name", formData.name);
      fd.append("description", formData.description);
      fd.append("is_public", formData.isPublic);
      fd.append("product_ids", JSON.stringify(selectedProducts));
      if (coverImage) fd.append("cover_image", coverImage);

      const response = await axios.post(
        `http://localhost:5000/api/seller/${sellerId}/collections`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        onSuccess?.();
      } else {
        setError(response.data.message || "Failed to create collection");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create collection. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = sellerProductsList.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <h3 className="text-lg font-semibold text-slate-800">Create Collection Set</h3>
          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Details" },
              { num: 2, label: "Products" },
              { num: 3, label: "Cover" },
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex items-center gap-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition ${
                    step >= s.num ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-400"
                  }`}>
                    {step > s.num ? <FiCheck className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`hidden sm:block text-xs font-medium ${
                    step >= s.num ? "text-indigo-500" : "text-slate-400"
                  }`}>{s.label}</span>
                </div>
                {i < 2 && (
                  <div className={`hidden md:block flex-1 h-1 mx-2 rounded ${
                    step > s.num ? "bg-indigo-500" : "bg-slate-200"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Collection Details */}
          {step === 1 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Collection Details</h4>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Collection Name *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Summer Essentials, Vintage Denim, Workwear Capsule"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  maxLength={80}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the theme, style inspiration, occasion, or what makes this collection special..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-500"
                  id="isPublic"
                />
                <label htmlFor="isPublic" className="flex-1 cursor-pointer">
                  <p className="text-sm font-medium text-slate-700">Public Collection</p>
                  <p className="text-xs text-slate-500 mt-0.5">Visible to all users on your storefront</p>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Select Products */}
          {step === 2 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Add Products to Collection</h4>
              <p className="text-xs text-slate-500">Select items from your inventory. Minimum 1 product required.</p>

              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-indigo-500 animate-spin" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-slate-100 bg-white">
                  <FiPackage className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">No products found. Add items first.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <label key={product.product_id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.product_id)}
                        onChange={() => toggleProduct(product.product_id)}
                        className="h-4 w-4 rounded border-slate-300 accent-indigo-500"
                      />
                      <img
                        src={`http://localhost:5000${product.primary_image || '/src/assets/shirt-1.jpg'}`}
                        alt={product.title}
                        className="h-12 w-12 rounded-lg object-cover border border-slate-100"
                        onError={e => { e.currentTarget.src = "/src/assets/shirt-1.jpg"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{product.title}</p>
                        <p className="text-xs text-slate-400">₨{Number(product.price).toLocaleString()} • {product.category}</p>
                      </div>
                      {selectedProducts.includes(product.product_id) && (
                        <FiCheckCircle className="w-5 h-5 text-indigo-500" />
                      )}
                    </label>
                  ))}
                </div>
              )}

              <div className="rounded-xl bg-indigo-50 p-4 border border-indigo-100">
                <p className="text-sm text-indigo-700">
                  <strong>{selectedProducts.length}</strong> product{selectedProducts.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Cover Image */}
          {step === 3 && (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease]">
              <h4 className="text-sm font-semibold text-slate-700">Collection Cover Image</h4>
              <p className="text-xs text-slate-500">This image represents your collection on the storefront.</p>

              <label className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center cursor-pointer transition hover:border-indigo-300 hover:bg-indigo-50/30">
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleCoverChange}
                />
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="h-32 w-32 rounded-lg object-cover border border-slate-200" />
                ) : (
                  <>
                    <FiImage className="w-10 h-10 text-slate-300" />
                    <span className="text-sm font-medium text-slate-500">Click to upload cover image</span>
                  </>
                )}
                <p className="text-xs text-slate-400">Recommended: 800x800px, JPG/PNG/WebP, max 5MB</p>
              </label>

              {coverPreview && (
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setCoverImage(null); setCoverPreview(null); }}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCoverImage(null); setCoverPreview(null); }}
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              disabled={loading}
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
              disabled={loading}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create Collection"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
