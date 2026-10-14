import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RiAdminLine } from "react-icons/ri";
import { toast, Bounce } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogIn = async (e) => {
    e.preventDefault();
    if (cooldown) return;
    setLoading(true);
    setCooldown(true);

    try {
      const payload = {
        email,
        password,
        role: "superadmin",
      };

      const response = await axios.post(
        `${API_URL}/api/loginsuperAdmin`,
        payload,
        { withCredentials: true }
      );

      if (response.data?.success) {
        login();
        toast.success("Login Successfully", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        });
        navigate("/");
      } else {
        toast.warn("Invalid Credentials", {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred!";
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
      setTimeout(() => setCooldown(false), 15000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-md p-8 w-full max-w-md">
        <div className="flex justify-center items-center mb-6 gap-2 text-[#FFD700]">
          <RiAdminLine className="size-6" />
          <h2 className="text-2xl font-bold text-center">Super Admin Login</h2>
        </div>
        <form onSubmit={handleLogIn} className="space-y-4">
          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Ex: astrocaptain@gmail.com"
            />
            <label className="block font-semibold mt-5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              placeholder="Ex: Astro@123"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#FFD700] py-2 px-4 rounded-xl hover:bg-yellow-500 disabled:opacity-50"
            disabled={loading || cooldown}
          >
            {loading ? "Verifying..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
