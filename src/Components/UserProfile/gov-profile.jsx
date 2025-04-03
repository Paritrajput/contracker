"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function GovProfile() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("gov-token");
    if (token) {
      axios
        .get("/api/gov-sec/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("gov-token"));
    }
  }, []);

  const handleLogout = async () => {
    // await axios.post("/api/contractor/logout");
    localStorage.removeItem("gov-token");
    router.push("/authenticate/gov-auth/login");
  };

  return (
    <div className="fixed bottom-32 right-6">
      {/* Floating User Icon */}
      <button
        onClick={() => setShowPopup(!showPopup)}
        className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-lg hover:bg-teal-600"
      >
        👤
      </button>

      {/* Popup Box */}
      {showPopup && (
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white w-64 p-4 rounded-lg shadow-lg">
          {user ? (
            <>
              <p className="font-bold text-teal-400">👤 {user.name}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <button
                onClick={handleLogout}
                className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white p-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <p className="text-gray-400">Not Logged In</p>
          )}
        </div>
      )}
    </div>
  );
}
