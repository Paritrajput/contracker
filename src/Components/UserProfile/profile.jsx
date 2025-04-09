"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useGovUser } from "@/Context/govUser";

export default function Profile() {
  const router = useRouter();
  const { showPopup, setShowPopup, user } = useGovUser();
  const { data: session } = useSession();

  const handleLogout = async () => {
    if (session) await signOut();
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleBackdropClick = () => {
    setShowPopup(false);
  };

  return (
    showPopup && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-80 max-w-sm bg-gray-900 text-white rounded-2xl shadow-xl p-6"
        >
          {/* Close button */}
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
          >
            &times;
          </button>

          {user ? (
            <>
              <div className="mb-4 ">
                <p className="text-2xl font-bold text-teal-400 capitalize justify-self-center">
                  {user.role}
                </p>
                <p className="text-lg font-semibold mt-2 text-white pl-2">
                  Username: {user.name}
                </p>
                <p className="text-gray-400 text-sm pl-2">Email: {user.email}</p>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setShowPopup(false);
                }}
                className="w-full mt-4 bg-red-500 hover:bg-red-600 transition-colors duration-200 text-white font-semibold py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <p className="text-center text-gray-400">Not Logged In</p>
          )}
        </div>
      </div>
    )
  );
}
