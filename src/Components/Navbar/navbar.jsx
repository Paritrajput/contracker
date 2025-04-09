"use client";
import { useGovUser } from "@/Context/govUser";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  const { user, setShowPopup } = useGovUser();

  return (
    <nav className="bg-black p-4 shadow-md flex justify-between items-center sticky z-50 top-0">
      {/* Logo */}
      <Link
        href="/"
        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500"
      >
        Contracker
      </Link>

      {/* Center Links */}
      <ul className="flex items-center gap-8 text-white">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about-us">About Us</Link>
        </li>
        <li>
          <Link href="/our-services">Services</Link>
        </li>
      </ul>

      <div className="text-white flex">
        {user? (
          <img className="h-9 w-9" src="/user-icon.png" onClick={() => setShowPopup(true)} />
        ) : (
          <Link href="/login" className="bg-white px-3 py-2 rounded-xl text-black">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
