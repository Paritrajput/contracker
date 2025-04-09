"use client";
import { createContext, useState, useContext } from "react";
import React from "react";

import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const GovContext = createContext();

export const GovProvider = ({ children }) => {
  const [govProfile, setGovProfile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isSuperOwner, setIsSuperOwner] = useState(false);
  const [user, setUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");

      console.log(token);
      if (!token) {
        setUser(null);
      } else {
        const decoded = jwtDecode(token);
        setUser(decoded);
        console.log(decoded);
      }
    } catch (error) {
      console.error("Token decode error:", error);
    }
  }, []);

  return (
    <GovContext.Provider
      value={{
        showPopup,
        setShowPopup,
        user,
        govProfile,
        setGovProfile,
        isOwner,
        setIsOwner,
        isSuperOwner,
        setIsSuperOwner,
      }}
    >
      {children}
    </GovContext.Provider>
  );
};

export const useGovUser = () => useContext(GovContext);
