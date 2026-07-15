import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiMiniArrowUpRight } from "react-icons/hi2";
import google from "../assets/google.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/signup", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      console.log(response.data);

       navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

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
          <form className="mt-5" onSubmit={handleSubmit}>
            <h1 className="text-4xl font-semibold leading-none tracking-tight text-[#101219]">
              Sign up
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Create your account and get started{" "}
              <span aria-hidden="true">✨</span>
            </p>

            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <img src={google} alt="google" className="h-4 w-4" />
              Sign up with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium text-slate-400">
                or Sign up with Email
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <label
              htmlFor="name"
              className="mb-2 block text-base font-medium text-slate-700"
            >
              Full Name
            </label>
            <input
              id="name"
              name="fullName"
              type="text"
              placeholder="E.g. John Doe"
              value={formData.fullName}
              onChange={handleChange}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4e46ff]"
              required
            />

            <label
              htmlFor="email"
              className="mb-2 mt-4 block text-base font-medium text-slate-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="E.g. johndoe@email.com"
              value={formData.email}
              onChange={handleChange}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4e46ff]"required
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
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4e46ff]"
                required
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

            <label
              htmlFor="confirmPassword"
              className="mb-2 mt-4 block text-base font-medium text-slate-700"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#4e46ff]"
                required
              />
              <button
                type="button"
                aria-label="Toggle confirm password visibility"
                onClick={() => setShowConfirmPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showConfirmPassword ? (
                  <FiEye className="text-lg" aria-hidden="true" />
                ) : (
                  <FiEyeOff className="text-lg" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="mt-3 flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1 h-3.5 w-3.5 rounded border-slate-300 accent-[#4e46ff]"
              />
              <p className="text-sm text-slate-600">
                I agree to the{" "}
                <a
                  href="#"
                  className="font-semibold text-[#4e46ff] hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="font-semibold text-[#4e46ff] hover:underline"
                >
                  Privacy Policy
                </a>
              </p>
            </div>

            <button
              type="submit"
              className="mt-4 h-10 w-full rounded-lg bg-[#4e46ff] text-sm font-medium text-white transition hover:bg-[#3f38e6]"
            >
              Sign up
            </button>

            <p className="mt-5 text-center text-sm text-slate-500">
              Already have an account?
              <Link
                to="/signin"
                className="inline-flex items-center gap-1 font-semibold text-[#4e46ff] hover:underline"
              >
                {" "}
                Login
                <HiMiniArrowUpRight aria-hidden="true" />
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default SignUp;
