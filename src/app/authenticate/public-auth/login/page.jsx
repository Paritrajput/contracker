"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession, signIn } from "next-auth/react";
import { jwtDecode } from "jwt-decode";

export default function ContractorLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/public-sec/login", formData);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);

        router.push("/public-sec");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#060611] text-white">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-teal-400 text-center">
          Public Login
        </h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4 mb-3">
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
            Login
          </button>
        </form>
        <hr />
        <div className="flex justify-center">
          <LoginWithGoogle />
        </div>
        <p className="text-gray-400 text-sm text-center mt-3">
          Don't have an account?{" "}
          <a href="/authenticate/public-auth/signup" className="text-teal-400">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export function LoginWithGoogle() {
  const router = useRouter();
  const { data: session } = useSession();
  console.log(session?.user.jwt);
  useEffect(() => {
    if (session?.user?.jwt) {
      const userData = {
        token: session.user.jwt,
        id: session.user.id,
        name: session.user.username,
        email: session.user.email,
        role: session.user.role,
      };
      console.log("token:", session.user.jwt);
      const decoded = jwtDecode(session.user.jwt);

      console.log(decoded);
      localStorage.setItem("token", session.user.jwt); // ✅

      // localStorage.setItem("token", JSON.stringify(userData));
      router.push("/public-sec");
    }
  }, [session]);

  return (
    <button
      onClick={() => signIn("google")}
      className="bg-gray-700 text-white px-9 py-2 rounded-3xl my-3 justify-self-center border-2 border-gray-600"
    >
      Login with Google
    </button>
  );
}
