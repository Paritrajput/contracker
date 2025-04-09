"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGovUser } from "@/Context/govUser";

export default function ContractorLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user, loading } = useGovUser(); // <-- make sure loading is available in your context

  useEffect(() => {
    // Wait until loading is done
    if (!loading) {
      if (user?.role === "contractor") {
        console.log(user.role)
        setIsAuthenticated(true);
      } else {
        router.push("/authenticate/contractor/login");
      }
    }
  }, [user, loading]); // <-- run effect when user or loading changes

  if (loading) {
    return <div className="text-white p-4">Loading...</div>;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
