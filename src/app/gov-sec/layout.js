"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GovProfile from "@/Components/UserProfile/gov-profile";
import { GovProvider } from "@/Context/govUser";
import axios from "axios";

export default function ContractorLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("gov-token");
    if (!token) {
      router.push("/authenticate/gov-auth/login"); // Redirect to login if no token
    } else {
      console.log(token);
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) return null;

  return (
    <GovProvider>
      {children}
      <GovProfile />
    </GovProvider>
  );
}
