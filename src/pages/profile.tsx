import React from "react";
import { Link } from "react-router-dom";
import {
	FiCreditCard,
	FiHeart,
	FiMail,
	FiMapPin,
	FiPackage,
	FiShield,
	FiShoppingBag,
	FiUser,
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
};

const styleTags = ["Weekend layers", "Neutral tones", "Statement accessories", "Comfort first"];

const supportItems = [
	{
		label: "Saved payment",
		value: "Visa ending in 2418",
		icon: FiCreditCard,
	},
	{
		label: "Shipping address",
		value: "Lalitpur, Bagmati",
		icon: FiMapPin,
	},
	{
		label: "Account security",
		value: "Two-step verification on",
		icon: FiShield,
	},
];

const getInitials = (name: string): string =>
	name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((part: string) => part[0]?.toUpperCase())
		.join("");

const Profile = () => {
	const { cart } = useCartContext();
	const { favorite } = useFavoriteContext();

	const profile = defaultProfile;
	const initials = getInitials(profile.name);

	const stats = [
		{
			label: "Favorites",
			value: favorite.length,
			helper: "Items waiting in your wishlist",
			icon: FiHeart,
		},
		{
			label: "Cart items",
			value: cart.length,
			helper: "Pieces ready for checkout",
			icon: FiShoppingBag,
		},
		{
			label: "Member since",
			value: profile.memberSince,
			helper: "Your style journey started here",
			icon: FiUser,
		},
	];

	const quickActions = [
		{
			title: "Review your favorites",
			description: "Jump back into the pieces you saved for later.",
			to: "/favorites",
			cta: "Open favorites",
		},
		{
			title: "Finish your cart",
			description: "Pick up where you left off and check out faster.",
			to: "/cart",
			cta: "Go to cart",
		},
		{
			title: "Log Out",
			description: "You can come back at any moment you like.",
			to: "/signin",
			cta: "Manage account",
		},
	];

	return (
		<div className="min-h-screen bg-slate-50 text-slate-900">
			<NavBar />

			<main className="relative overflow-hidden">
				<div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.18),transparent_42%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_36%)]" />

				<section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
					<div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
						<div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
							<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
								<div className="flex items-start gap-4">
									<div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 via-violet-600 to-amber-400 text-2xl font-bold text-white shadow-lg shadow-indigo-200">
										{initials}
									</div>

									<div>
										<p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
											<HiOutlineSparkles aria-hidden="true" />
											Your profile
										</p>
										<h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
											{profile.name}
										</h1>
										<p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
											{profile.bio}
										</p>

										<div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
											<span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
												<FiMail aria-hidden="true" className="text-slate-400" />
												{profile.email}
											</span>
											<span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
												<FiMapPin aria-hidden="true" className="text-slate-400" />
												{profile.city}
											</span>
											<span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
												<FiPackage aria-hidden="true" className="text-slate-400" />
												{profile.stylePreference}
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="mt-8 grid gap-4 sm:grid-cols-3">
								{stats.map((item) => {
									const Icon = item.icon;

									return (
										<article
											key={item.label}
											className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
										>
											<div className="flex items-start justify-between gap-3">
												<div>
													<p className="text-sm font-medium text-slate-500">{item.label}</p>
													<p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
												</div>
												<span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
													<Icon aria-hidden="true" />
												</span>
											</div>
											<p className="mt-3 text-sm leading-6 text-slate-600">{item.helper}</p>
										</article>
									);
								})}
							</div>

							<div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
								<section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
									<div className="flex items-center justify-between gap-3">
										<h2 className="text-lg font-semibold text-slate-950">Account details</h2>
										<span className="rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
											Overview
										</span>
									</div>

									<dl className="mt-5 space-y-4 text-sm">
										<div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
											<dt className="text-slate-500">Full name</dt>
											<dd className="font-medium text-slate-900">{profile.name}</dd>
										</div>
										<div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
											<dt className="text-slate-500">Email address</dt>
											<dd className="font-medium text-slate-900">{profile.email}</dd>
										</div>
										<div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
											<dt className="text-slate-500">Preferred style</dt>
											<dd className="font-medium text-slate-900">{profile.stylePreference}</dd>
										</div>
									</dl>

									<div className="mt-5 flex flex-wrap gap-2">
										{styleTags.map((tag) => (
											<span key={tag} className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
												{tag}
											</span>
										))}
									</div>
								</section>

								<section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
									
									<div className="mt-5 rounded-2xl bg-indigo-600 p-5 text-white shadow-lg shadow-indigo-200">
										<p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-100">Wanna Start Your Own Selling PLace?</p>
										<h3 className="mt-2 text-xl font-semibold">Start By Filling Up A Form.</h3>
										<p className="mt-2 text-sm leading-6 text-indigo-100/90">
											Fill this form to verify yourself as a trusted vender.
										</p>
										<Link
											to="/signup"
											className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
										>
											Review sign in
										</Link>
									</div>
								</section>
							</div>
						</div>

						<aside className="space-y-6">
							<section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
								<h2 className="text-lg font-semibold text-slate-950">Quick actions</h2>
								<p className="mt-2 text-sm leading-6 text-slate-600">
									Jump back into the parts of the store you use most often.
								</p>

								<div className="mt-5 space-y-3">
									{quickActions.map((action) => (
										<Link
											key={action.title}
											to={action.to}
											className="group block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-md"
										>
											<div className="flex items-center justify-between gap-3">
												<h3 className="font-semibold text-slate-950">{action.title}</h3>
												<span className="text-sm font-medium text-indigo-700">{action.cta}</span>
											</div>
											<p className="mt-2 text-sm leading-6 text-slate-600">{action.description}</p>
										</Link>
									))}
								</div>
							</section>

							<section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
								<h2 className="text-lg font-semibold text-slate-950">Shopping snapshot</h2>
								<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
									<div className="rounded-2xl bg-slate-50 p-4">
										<p className="text-sm font-medium text-slate-500">Wishlist items</p>
										<p className="mt-2 text-3xl font-semibold text-slate-950">{favorite.length}</p>
									</div>
									<div className="rounded-2xl bg-slate-50 p-4">
										<p className="text-sm font-medium text-slate-500">Cart items</p>
										<p className="mt-2 text-3xl font-semibold text-slate-950">{cart.length}</p>
									</div>
								</div>
							</section>
						</aside>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
};

export default Profile;
