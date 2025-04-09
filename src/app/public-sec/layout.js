"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";

export default function ContractorLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // signOut()
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      router.push("/authenticate/public-auth/login");
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) return null;

  return (
    <>
      <SessionProvider>
        {children}
        {/* <PublicProfile /> */}
      </SessionProvider>
    </>
  );
}
