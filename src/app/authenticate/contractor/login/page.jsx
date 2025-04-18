"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useGovUser } from "@/Context/govUser";
import { jwtDecode } from "jwt-decode";

export default function ContractorLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { user, setUser } = useGovUser();
  const [loading, setLoading]=useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true)

    try {
      const res = await axios.post("/api/contractor/login", formData);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setUser(decoded);
          setLoading(false)
          router.push("/contractor-sec");
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      setLoading(false)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#060611] text-white p-3">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-teal-400 text-center">
          Contractor Login
        </h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-2 mb-3 rounded bg-gray-800 text-white border border-gray-600"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 mb-3 rounded bg-gray-800 text-white border border-gray-600"
            onChange={handleChange}
            required
          />
          <button className="w-full bg-teal-500 hover:bg-teal-600 text-white p-2 rounded transition">
            {loading?"Logging In..":"Login"}
            
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-3">
          Don't have an account?{" "}
          <a href="/authenticate/contractor/signup" className="text-teal-400">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
