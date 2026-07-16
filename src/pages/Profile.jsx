import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCreditCard,
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
  FiDollarSign,
  FiArchive,
  FiHelpCircle,
  FiChevronDown,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTruck,
  FiStar,
  FiPlus,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useCartContext } from "../context/CartContext";
import { useFavoriteContext } from "../context/FavoriteContext";

const defaultProfile = {
  name: "Alex Morgan",
  email: "alex.morgan@sellmystyle.com",
  city: "Kathmandu, Nepal",
  memberSince: "2024",
  stylePreference: "Minimal streetwear",
  bio: "Curating easy outfits, clean layers, and standout accessories.",
  phone: "+977 981-234-5678",
};

const styleTags = [
  "Weekend layers",
  "Neutral tones",
  "Statement accessories",
  "Comfort first",
  "Vintage finds",
  "Sustainable fashion",
];

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

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const getStatusBadge = (status) => {
  const styles = {
    delivered: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    processing: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    active: "bg-green-100 text-green-700",
    sold: "bg-purple-100 text-purple-700",
    pending: "bg-amber-100 text-amber-700",
    draft: "bg-slate-100 text-slate-700",
  };
  const icons = {
    delivered: <FiCheckCircle className="w-3.5 h-3.5" />,
    shipped: <FiTruck className="w-3.5 h-3.5" />,
    processing: <FiClock className="w-3.5 h-3.5" />,
    cancelled: <FiXCircle className="w-3.5 h-3.5" />,
    active: <FiCheckCircle className="w-3.5 h-3.5" />,
    sold: <FiDollarSign className="w-3.5 h-3.5" />,
    pending: <FiClock className="w-3.5 h-3.5" />,
    draft: <FiArchive className="w-3.5 h-3.5" />,
  };
  return { className: styles[status] || "bg-slate-100 text-slate-700", icon: icons[status] || <FiHelpCircle className="w-3.5 h-3.5" /> };
};

const Profile = () => {
  const navigate = useNavigate();
  const { cart } = useCartContext();
  const { favorite } = useFavoriteContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(defaultProfile);
  const [initials, setInitials] = useState(getInitials(defaultProfile.name));
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(defaultProfile);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      const parsed = JSON.parse(stored);
      setProfile(parsed);
      setInitials(getInitials(parsed.name));
      setEditForm(parsed);
    }
    const loggedInUser = localStorage.getItem("userEmail");
    if (loggedInUser && !stored) {
      setProfile((prev) => ({ ...prev, email: loggedInUser }));
      setEditForm((prev) => ({ ...prev, email: loggedInUser }));
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(editForm));
    setProfile(editForm);
    setInitials(getInitials(editForm.name));
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/signup", { replace: true });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <FiUser className="w-4 h-4" /> },
    { id: "orders", label: "Orders", icon: <FiPackage className="w-4 h-4" />, count: mockOrders.length },
    { id: "listings", label: "My Listings", icon: <FiShoppingBag className="w-4 h-4" />, count: mockListings.filter(l => l.status !== "draft").length },
    { id: "settings", label: "Settings", icon: <FiSettings className="w-4 h-4" /> },
  ];

  const stats = [
    { label: "Total Spent", value: "₨42,350", icon: FiDollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Orders", value: mockOrders.length.toString(), icon: FiPackage, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active Listings", value: mockListings.filter(l => l.status === "active").length.toString(), icon: FiTrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Wishlist", value: favorite.length.toString(), icon: FiHeart, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar />

      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.18),transparent_42%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_36%)]" />

        <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 via-violet-600 to-amber-400 text-3xl font-bold text-white shadow-lg shadow-indigo-200">
                    {initials}
                  </div>
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute bottom-0 right-0 rounded-full bg-white p-2 text-indigo-600 shadow-lg hover:bg-slate-50 transition"
                    aria-label="Change avatar"
                  >
                    <FiCamera className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                    <HiOutlineSparkles aria-hidden="true" />
                    Your Profile
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    {isEditing ? (
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="bg-transparent border-b-2 border-indigo-500 focus:outline-none text-inherit font-inherit w-auto"
                      />
                    ) : (
                      profile.name
                    )}
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    {isEditing ? (
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        className="bg-transparent border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full max-w-md"
                        rows={2}
                      />
                    ) : (
                      profile.bio
                    )}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600">
                  <FiMail className="w-4 h-4 text-slate-400" />
                  {isEditing ? (
                    <input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="bg-transparent border-none focus:outline-none text-sm w-48"
                    />
                  ) : (
                    profile.email
                  )}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600">
                  <FiMapPin className="w-4 h-4 text-slate-400" />
                  {profile.city}
                </div>
                {isEditing ? (
                  <div className="flex gap-2">
                    <button onClick={saveProfile} className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                      Save
                    </button>
                    <button onClick={() => { setEditForm(profile); setIsEditing(false); }} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <FiEdit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
                    </div>
                    <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                      <Icon aria-hidden="true" className="w-6 h-6" />
                    </span>
                  </div>
                  <p className="mt-4 text-xs leading-5 text-slate-500">Updated just now</p>
                </article>
              );
            })}
          </div>

          {/* Tab Navigation */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <nav className="flex border-b border-slate-200" aria-label="Profile sections">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition relative ${activeTab === tab.id
                    ? "text-indigo-600 bg-indigo-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">{tab.icon} {tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-100 px-1.5 text-[11px] font-semibold text-indigo-700">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Tab Panels */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Account Details */}
                  <section>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <h2 className="text-lg font-semibold text-slate-950">Account Details</h2>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Private</span>
                    </div>
                    <dl className="space-y-4">
                      {[
                        { label: "Full Name", value: profile.name, icon: FiUser },
                        { label: "Email Address", value: profile.email, icon: FiMail },
                        { label: "Phone Number", value: profile.phone || "Not set", icon: FiMapPin },
                        { label: "Location", value: profile.city, icon: FiMapPin },
                        { label: "Style Preference", value: profile.stylePreference, icon: FiPackage },
                        { label: "Member Since", value: profile.memberSince, icon: FiUser },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                          <dt className="flex items-center gap-3 text-slate-500">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-400">
                              <item.icon className="w-4 h-4" aria-hidden="true" />
                            </span>
                            <span>{item.label}</span>
                          </dt>
                          <dd className="font-medium text-slate-900 text-right max-w-xs truncate">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>

                  {/* Style Tags */}
                  <section>
                    <h2 className="text-lg font-semibold text-slate-950 mb-4">Style Preferences</h2>
                    <div className="flex flex-wrap gap-2">
                      {styleTags.map((tag) => (
                        <span key={tag} className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* Seller CTA */}
                  <section className="rounded-2xl bg-linear-to-r from-indigo-600 via-violet-600 to-amber-400 p-6 text-white shadow-lg shadow-indigo-200">
                    <div className="max-w-xl">
                      <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-100">Want to Start Selling?</p>
                      <h3 className="mt-2 text-2xl font-semibold">Become a Verified Seller</h3>
                      <p className="mt-2 text-sm leading-6 text-indigo-100/90">
                        Join our community of sellers. List your items, reach buyers, and grow your fashion business.
                      </p>
                      <Link to="/signup" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50">
                        Apply Now <FiPlus className="w-4 h-4" />
                      </Link>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-950">Order History</h2>
                    <span className="text-sm text-slate-500">{mockOrders.length} orders</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full" role="table">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Order</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Items</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Total</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {mockOrders.map((order) => {
                          const { className, icon } = getStatusBadge(order.status);
                          return (
                            <tr key={order.id} className="hover:bg-slate-50 transition">
                              <td className="px-4 py-4 font-medium text-slate-900">{order.id}</td>
                              <td className="px-4 py-4 text-slate-600">{new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                              <td className="px-4 py-4">
                                <div className="text-sm text-slate-900">{order.items} item{order.items > 1 ? "s" : ""}</div>
                                <div className="text-xs text-slate-500 line-clamp-1">{order.itemsPreview.join(", ")}</div>
                              </td>
                              <td className="px-4 py-4 font-medium text-slate-900">₨{order.total.toLocaleString()}</td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${className}`}>
                                  {icon} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">View</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "listings" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-950">My Listings</h2>
                    <Link to="/sell" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                      <FiPlus className="w-4 h-4" /> New Listing
                    </Link>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {mockListings.map((listing) => {
                      const { className, icon } = getStatusBadge(listing.status);
                      return (
                        <article key={listing.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm transition hover:shadow-lg">
                          <div className="relative aspect-square bg-slate-100 overflow-hidden">
                            <img
                              src={listing.image}
                              alt={listing.title}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => { e.currentTarget.src = "/src/assets/shirt-1.jpg"; }}
                            />
                            <span className={`absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${className}`}>
                              {icon} {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                            </span>
                          </div>
                          <div className="p-4 space-y-3">
                            <h3 className="font-semibold text-slate-950 line-clamp-1">{listing.title}</h3>
                            <p className="text-xl font-bold text-indigo-600">₨{listing.price.toLocaleString()}</p>
                            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                              <span className="flex items-center gap-1"><FiStar className="w-3.5 h-3.5" /> {listing.likes}</span>
                              <span className="flex items-center gap-1"><FiTrendingUp className="w-3.5 h-3.5" /> {listing.views}</span>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">Edit</button>
                              <button className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700">View</button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="max-w-2xl space-y-8">
                  {/* Notifications */}
                  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
                      <FiBell className="w-5 h-5 text-indigo-600" />
                      Notifications
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">Choose what emails and push notifications you receive.</p>
                    <div className="mt-5 space-y-4">
                      {[
                        { label: "Order Updates", desc: "Shipping, delivery, and order confirmations", default: true },
                        { label: "Promotions & Offers", desc: "Sales, discounts, and special deals", default: true },
                        { label: "New Arrivals", desc: "Weekly updates on fresh inventory", default: false },
                        { label: "Price Drops", desc: "Alerts when saved items go on sale", default: true },
                        { label: "Seller Updates", desc: "Listing performance and buyer messages", default: true },
                      ].map((item, i) => (
                        <label key={i} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer hover:bg-white transition">
                          <div>
                            <p className="font-medium text-slate-900">{item.label}</p>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                          </div>
                          <input type="checkbox" defaultChecked={item.default} className="h-5 w-5 rounded border-slate-300 accent-indigo-600" />
                        </label>
                      ))}
                    </div>
                  </section>

                  {/* Security */}
                  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
                      <FiShield className="w-5 h-5 text-indigo-600" />
                      Security
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">Manage your password and login security.</p>
                    <div className="mt-5 space-y-4">
                      <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900">Two-Step Verification</p>
                          <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                        </div>
                        <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white">Enable</button>
                      </div>
                      <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900">Change Password</p>
                          <p className="text-sm text-slate-500">Last changed 3 months ago</p>
                        </div>
                        <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white">Update</button>
                      </div>
                      <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900">Active Sessions</p>
                          <p className="text-sm text-slate-500">2 devices currently logged in</p>
                        </div>
                        <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white">Manage</button>
                      </div>
                    </div>
                  </section>

                  {/* Appearance */}
                  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950">
                      <FiSettings className="w-5 h-5 text-indigo-600" />
                      Appearance
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">Customize how SellMyStyle looks on your device.</p>
                    <div className="mt-5">
                      <p className="text-sm font-medium text-slate-700 mb-3">Theme</p>
                      <div className="flex gap-4">
                        {["Light", "Dark", "System"].map((theme) => (
                          <label key={theme} className="flex-1 rounded-xl border-2 border-slate-200 bg-white p-4 text-center cursor-pointer transition hover:border-indigo-300">
                            <input type="radio" name="theme" defaultChecked={theme === "System"} className="sr-only" />
                            <p className="font-medium text-slate-900">{theme}</p>
                            <p className="text-xs text-slate-500 mt-1">{theme === "System" ? "Matches your device" : `${theme} mode always`}</p>
                          </label>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Danger Zone */}
                  <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-red-900">
                      <FiXCircle className="w-5 h-5" />
                      Danger Zone
                    </h2>
                    <p className="mt-2 text-sm text-red-700">Irreversible actions. Please proceed with caution.</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button className="rounded-lg border-2 border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:border-red-400">
                        Deactivate Account
                      </button>
                      <button className="rounded-lg border-2 border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:border-red-400">
                        Delete All Data
                      </button>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Sidebar (Mobile) */}
          <div className="mt-8 hidden lg:block">
            <aside className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">Quick Actions</h2>
                <p className="mt-2 text-sm text-slate-600">Jump to frequently used sections.</p>
                <div className="mt-5 space-y-2">
                  {[
                    { title: "View Favorites", desc: "Items you've saved for later", to: "/favorites", icon: FiHeart },
                    { title: "Go to Cart", desc: "Complete your purchase", to: "/cart", icon: FiShoppingBag },
                    { title: "Start Selling", desc: "List your first item", to: "/sell", icon: FiPlus },
                    { title: "Help Center", desc: "FAQs and support", to: "/help", icon: FiHelpCircle },
                  ].map((action) => (
                    <Link key={action.title} to={action.to} className="group block rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-x-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-md">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <action.icon className="w-4.5 h-4.5" aria-hidden="true" />
                          </span>
                          <h3 className="font-semibold text-slate-950">{action.title}</h3>
                        </div>
                        <FiChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600 pl-10">{action.desc}</p>
                    </Link>
                  ))}
                  <button onClick={handleLogout} className="group w-full rounded-xl border border-red-200 bg-red-50 p-4 transition hover:bg-red-100 hover:border-red-300 text-left">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
                          <FiLogOut className="w-4.5 h-4.5" aria-hidden="true" />
                        </span>
                        <h3 className="font-semibold text-red-700">Log Out</h3>
                      </div>
                    </div>
                  </button>
                </div>
              </section>

              {/* Shopping Snapshot */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-950">Shopping Snapshot</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4 text-center">
                    <p className="text-sm font-medium text-slate-500">Wishlist Items</p>
                    <p className="mt-2 text-4xl font-bold text-slate-950">{favorite.length}</p>
                    <p className="mt-1 text-xs text-slate-500">{favorite.length === 0 ? "Start saving items you love" : "Items waiting for you"}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 text-center">
                    <p className="text-sm font-medium text-slate-500">Cart Items</p>
                    <p className="mt-2 text-4xl font-bold text-slate-950">{cart.length}</p>
                    <p className="mt-1 text-xs text-slate-500">{cart.length === 0 ? "Your cart is empty" : "Ready for checkout"}</p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </main>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowAvatarModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-950 mb-4">Update Avatar</h3>
            <p className="text-sm text-slate-600 mb-6">Upload a profile photo (JPG, PNG up to 5MB)</p>
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-slate-100 mx-auto mb-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 via-violet-600 to-amber-400 text-3xl font-bold text-white">
                  {initials}
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload" className="block w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center cursor-pointer transition hover:border-indigo-400 hover:bg-indigo-50">
                <FiCamera className="w-8 h-8 mx-auto text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-700">Click to upload</p>
                <p className="text-xs text-slate-500">or drag and drop</p>
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowAvatarModal(false)} className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Cancel
              </button>
              <button className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Profile;