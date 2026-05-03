import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiMiniArrowUpRight } from "react-icons/hi2";
import google from "../assets/google.png";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 w-full max-w-310 items-center px-6">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-xl font-bold tracking-tight text-indigo-700"
          >
            SellMyStyle
          </a>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-310 flex-1 items-center justify-center px-6 py-4">
        <div className="mx-auto w-full max-w-85">
          <h1 className="text-4xl font-semibold leading-none tracking-tight text-[#101219]">
            Login
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Hi, Welcome back <span aria-hidden="true">👋</span>
          </p>

          <form className="mt-5" onSubmit={(e) => e.preventDefault()}>
            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <img src={google} alt="google" />
              Login with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium text-slate-400">
                or Login with Email
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <label
              htmlFor="email"
              className="mb-2 block text-base font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="E.g. johndoe@email.com"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4e46ff]"
            />

            <label
              htmlFor="password"
              className="mb-2 mt-4 block text-base font-medium text-slate-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4e46ff]"
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? (
                  <FiEye className="text-lg" aria-hidden="true" />
                ) : (
                  <FiEyeOff className="text-lg" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-300 accent-[#4e46ff]"
                />
                Remember Me
              </label>
              <a
                href="#"
                className="text-sm font-semibold text-[#4e46ff] hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="mt-4 h-10 w-full rounded-lg bg-[#4e46ff] text-sm font-medium text-white transition hover:bg-[#3f38e6]"
            >
              Login
            </button>

            <p className="mt-5 text-center text-sm text-slate-500">
              Not registered yet?{" "}
              <Link to="/signup" className="inline-flex items-center gap-1 font-semibold text-[#4e46ff] hover:underline">
                Create an account
                <HiMiniArrowUpRight aria-hidden="true" />
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
