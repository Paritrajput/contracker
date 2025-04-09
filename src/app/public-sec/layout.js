"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { useGovUser } from "@/Context/govUser";

export default function ContractorLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {user}=useGovUser()

  // useEffect(() => {
  //   // signOut()
  
  //   const token = localStorage.getItem("token");
  
  //   if (!token) {
  //     router.push("/authenticate/public-auth/login");
  //   } else {
  //     setIsAuthenticated(true);
  //   }
  // }, []);

 

  return (
    <>
      <SessionProvider>
        {children}
        {/* <PublicProfile /> */}
      </SessionProvider>
    </>
  );
}
