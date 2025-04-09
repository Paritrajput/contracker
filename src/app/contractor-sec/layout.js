"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ContractorProfile from "@/Components/UserProfile/contractor-profile";
import { useGovUser } from "@/Context/govUser";

export default function ContractorLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user } = useGovUser();

  useEffect(() => {
    if (user) {
      console.log(user);
      if (user.role !== "contractor") {
        setIsAuthenticated(false)
        router.push("/authenticate/contractor/login");
      }
      else{
        setIsAuthenticated(true)
      }
    } else {
      setIsAuthenticated(false)
      router.push("/authenticate/contractor/login");
    }
  }, []);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
