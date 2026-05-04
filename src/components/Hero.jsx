import React, { useEffect, useState } from "react";
import heroImage1 from "../assets/image-1.jpg";
import heroImage2 from "../assets/image-2.jpg";
import heroImage3 from "../assets/image-3.jpg";
import heroImage4 from "../assets/image-4.jpg";
import heroImage5 from "../assets/image-5.jpg";
import heroImage6 from "../assets/image-6.jpg";
import heroImage7 from "../assets/image-7.jpg";
import heroImage8 from "../assets/image-8.jpg";
import heroImage9 from "../assets/image-9.jpg";
import heroImage10 from "../assets/image-10.jpg";
import { FaShippingFast } from "react-icons/fa";
import { GoChecklist } from "react-icons/go";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Hero = () => {
    const images = [
        heroImage1,
        heroImage2,
        heroImage3,
        heroImage4,
        heroImage5,
        heroImage6,
        heroImage7,
        heroImage8,
        heroImage9,
        heroImage10,
    ];
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setActiveImageIndex((currentIndex) => (currentIndex + 1) % images.length);
        }, 4000);

        return () => window.clearInterval(intervalId);
    }, [images.length]);

    const goToPreviousImage = () => {
        setActiveImageIndex((currentIndex) => (currentIndex - 1 + images.length) % images.length);
    };

    const goToNextImage = () => {
        setActiveImageIndex((currentIndex) => (currentIndex + 1) % images.length);
    };

    return (
        <section className="bg-slate-50 py-8 ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-stretch">
                    <div className="flex h-full flex-col justify-between gap-6 bg-slate-50 shadow-2xl p-4">
                        <div className="rounded-lg bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="text-3xl font-extrabold uppercase leading-tight sm:text-5xl text-indigo-700">
                                Sell My Style
                            </h2>
                            <h2 className="mt-2 text-2xl font-extrabold sm:text-4xl">
                                Wear It, Sell It, Repeat It.
                            </h2>
                            <p className="mt-4 max-w-prose text-sm text-slate-600">
                                Your community-driven C2C fashion hub to buy, sell, and discover unique styles where wardrobes meet opportunity.
                            </p>
                            <button className="mt-6 inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50">
                                Shop Now
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex flex-col items-start gap-4">
                                    <FaShippingFast className="mt-1 text-2xl text-slate-700" />
                                    <div>
                                        <h3 className="text-sm font-semibold">Fast & Reliable Shipping</h3>     
                                        <p className="mt-2 text-xs text-slate-500">
                                            Get your orders delivered quickly with real-time tracking so you always know where your fashion items are.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-white p-6 shadow-sm">
                                <div className="flex flex-col items-start gap-4">
                                    <GoChecklist className="mt-1 text-2xl text-slate-700" />
                                    <div>
                                        <h3 className="text-sm font-semibold">Easy Listing for Sellers</h3>
                                        <p className="mt-2 text-xs text-slate-500">
                                            Upload and sell your clothes in just a few steps with a simple and user-friendly interface.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex h-full items-stretch">
                        <div className="relative w-full h-128 overflow-hidden rounded-lg bg-white shadow-sm sm:h-152 lg:h-176">
                            <img
                                src={images[activeImageIndex]}
                                alt={`Hero slide ${activeImageIndex + 1}`}
                                key={activeImageIndex}
                                className="hero-slide-image h-full w-full object-cover object-center"
                            />

                            <button
                                type="button"
                                onClick={goToPreviousImage}
                                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20"
                                aria-label="Previous image"
                            >
                                <FaChevronLeft />
                            </button>

                            <button
                                type="button"
                                onClick={goToNextImage}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20"
                                aria-label="Next image"
                            >
                                <FaChevronRight />
                            </button>

                            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-md">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`h-2.5 rounded-full transition-all ${
                                            index === activeImageIndex ? "w-8 bg-white" : "w-2.5 bg-white/50"
                                        }`}
                                        aria-label={`Go to image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
