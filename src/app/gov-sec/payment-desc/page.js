"use client";
import { Suspense, useEffect, useState } from "react";
import Page1 from "@/Components/Gov/Payment/page1";
import Page2 from "@/Components/Gov/Payment/page2";

import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <ContractBottom />
    </Suspense>
  );
}

export const ContractBottom = () => {
  const [activeTab, setActiveTab] = useState("Active Payments");
  const router = useRouter();
  const searchParams = useSearchParams();
  const contract = searchParams.get("contract");
  const contractData = contract ? JSON.parse(contract) : null;

  const renderScene = () => {
    switch (activeTab) {
      case "Active Payments":
        return <Page1 contract={contractData} />;
      case "Contract Status":
        return <Page2 contract={contractData} />;
      default:
        return <Page1 contract={contractData} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#060611] text-white pb-20"> {/* Added pb-20 to prevent overlap with bottom nav */}
      <div className="flex-1 md:p-4 p-1">{renderScene()}</div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
        <div className="flex justify-around items-center p-3 sm:p-4">
          {["Active Payments", "Contract Status"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition ${
                activeTab === tab
                  ? "text-teal-400 border-b-2 border-teal-400"
                  : "text-gray-400 hover:text-teal-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
