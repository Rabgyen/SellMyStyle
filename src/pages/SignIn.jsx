import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { HiMiniArrowUpRight } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import google from "../assets/google.png";

const SignIn = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error of the field being edited
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({
      email: "",
      password: "",
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        formData,
      );

      if (response.data.success) {
        navigate("/");
      } else {
        setErrors((prev) => ({
          ...prev,
          [response.data.field]: response.data.message,
        }));
      }
    } catch (error) {
      console.log(error);
      console.log(error.response);
      console.log(error.response?.data);

      alert("Server Error");
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 w-full max-w-310 items-center px-6">
          <h1 className="text-xl font-bold text-indigo-700">SellMyStyle</h1>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-310 flex-1 items-center justify-center px-6 py-4">
        <div className="mx-auto w-full max-w-85">
          <h1 className="text-4xl font-semibold">Login</h1>

          <p className="mt-2 text-sm text-slate-600">Hi, Welcome back 👋</p>

          <form className="mt-5" onSubmit={handleSubmit}>
            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300"
            >
              <img src={google} alt="google" className="h-5 w-5" />
              Login with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">
                or Login with Email
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            {/* EMAIL */}

            <label className="mb-2 block font-medium">Email</label>

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="h-10 w-full rounded-lg border border-slate-300 px-3"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}

            {/* PASSWORD */}

            <label className="mb-2 mt-4 block font-medium">Password</label>

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="h-10 w-full rounded-lg border border-slate-300 px-3 pr-10"
              />

              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEye /> : <FiEyeOff />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}

            <button
              type="submit"
              className="mt-6 h-10 w-full rounded-lg bg-indigo-600 text-white"
            >
              Login
            </button>

            <p className="mt-5 text-center text-sm">
              Not registered yet?{" "}
              <Link
                to="/signup"
                className="inline-flex items-center gap-1 font-semibold text-indigo-600"
              >
                Create an account
                <HiMiniArrowUpRight />
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
