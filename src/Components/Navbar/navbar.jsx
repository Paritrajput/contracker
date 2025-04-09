"use client";

import { useGovUser } from "@/Context/govUser";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, setShowPopup } = useGovUser();
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll lock on open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Services", href: "/our-services" },
  ];

  return (
    <nav className="bg-black px-1 py-4 shadow-md sticky top-0 z-50">
      <div className="max-md:max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500"
        >
          Contracker
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 text-white">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>

        {/* Profile/Login */}
        <div className="hidden md:flex text-white items-center">
          {user ? (
            <img
              src="/user-icon.png"
              alt="User"
              className="h-9 w-9 cursor-pointer"
              onClick={() => setShowPopup(true)}
            />
          ) : (
            <Link href="/login" className="bg-white px-3 py-2 rounded-xl text-black">
              Login
            </Link>
          )}
        </div>

        {/* Hamburger (Mobile Only) */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden text-white">
          <Menu size={28} />
        </button>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-full bg-black text-white z-50 md:hidden"
          >
         
            <div className="flex p-3 text-2xl font-bold text-teal-400 "><h1>Contracker</h1>
            <div className="absolute top-4 right-4">
             
              <X size={28} className="cursor-pointer" onClick={() => setMenuOpen(false)} />
            </div>
            </div>

            <div className="flex flex-col mt-20 ml-10  h-full space-y-6 text-xl">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}

              {user ? (
                <div
                  className="flex items-center gap-3 pt-4 cursor-pointer"
                  onClick={() => {
                    setShowPopup(true);
                    setMenuOpen(false);
                  }}
                >
                  <img src="/user-icon.png" alt="User" className="h-8 w-8" />
                  <span>Profile</span>
                </div>
              ) : (
                <Link
                  href="/login"
                  className=" text-white px-1 py-1 rounded"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
