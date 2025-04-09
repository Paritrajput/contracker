"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GovProvider, useGovUser } from "@/Context/govUser";

export default function ContractorLayout({ children }) {
  const router = useRouter();
  const { user, loading } = useGovUser();


  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== "gov") {
        router.push("/authenticate/gov-auth/login");
      }
    }
  }, [user, loading]); 
  if (loading) {
    return <div className="h-full flex justify-center items-center">Checking credentials...</div>;
  }

  if (!user || user.role !== "gov") {
    return null; 
  }

  return (
    <GovProvider>
      {children}
    </GovProvider>
  );
}
