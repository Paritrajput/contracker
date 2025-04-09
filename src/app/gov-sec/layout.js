"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GovProvider, useGovUser } from "@/Context/govUser";


export default function ContractorLayout({ children }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { user } = useGovUser();
  
    useEffect(() => {
      if (user) {
        console.log(user);
        if (user.role == "gov") {
          setIsAuthenticated(true);
        }
      } else {
        router.push("/authenticate/gov-auth/login");
      }
    }, []);
  
    if (!isAuthenticated) return null;
  return (
    <GovProvider>
      {children}
    </GovProvider>
  );
}
