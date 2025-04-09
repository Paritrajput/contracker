"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useGovUser } from "@/Context/govUser";

export default function Profile() {
  const router = useRouter();
  const { showPopup, setShowPopup, user } = useGovUser();

  const { data: session } = useSession();

  const handleLogout = async () => {
    if (session) {
      await signOut();
    }

    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    showPopup && (
      <div className="fixed flex w-full h-full  z-50 backdrop-brightness-25 backdrop-blur-sm">
        {/* Floating User Icon */}
        {/* <button
        onClick={() => setShowPopup(!showPopup)}
        className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center shadow-lg hover:bg-teal-600"
      >
        👤
      </button> */}

        {/* Popup Box */}

        <div className="z-[80] mt-[10%] ml-[40%] justify-center h-56 items-center justify-self-center bg-gray-900 text-white w-80 p-4 rounded-lg shadow-lg">
          {user ? (
            <>
            <div className="flex flex-row-reverse justify-between items-center">
               
            <div className="justify-self-end text-teal-400 text-xl cursor-pointer" onClick={()=>setShowPopup(false)}>X</div>
              <p className="font-extrabold text-2xl text-teal-400 justify-self-center mb-3">{user.role}</p>
              <div></div></div>
               <div></div>
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
      </div>
    )
  );
}
