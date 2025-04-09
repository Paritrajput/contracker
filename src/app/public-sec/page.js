"use client";

import { useState } from "react";
import Page1 from "@/Components/People/page1";
import Page2 from "@/Components/People/page2";
import { useRouter } from "next/navigation";

const PublicSec = () => {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const routes = [
    { key: "Issues", title: "Issues", icon: "📄" },
    { key: "Contracts", title: "Contracts", icon: "✍️" },
  ];

  const renderScene = () => {
    switch (index) {
      case 0:
        return <Page1 />;
      case 1:
        return <Page2 />;

      default:
        return <Page1 />;
    }
  };

  return (
    <div className="flex flex-col  bg-black text-white ">
      <div className="flex justify-between items-center p-3 bg-[#111] border-t border-gray-700 fixed  w-full z-50 px-3">
        <div className="text-white justify-self-start text-xl font-semibold">
          Public Corner
        </div>
        <div className="flex  gap-20">
          {routes.map((route, i) => (
            <button
              key={route.key}
              className={`flex  items-center p-2 transition-all duration-300 ${
                index === i
                  ? "text-teal-400 scale-110"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setIndex(i)}
            >
              {/* <span className="text-2xl">{route.icon}</span> */}
              <span className="text-sm">{route.title}</span>
            </button>
          ))}
        </div>
        <button
          onClick={() => router.push("/public-sec/public-issue")}
          className="  bg-green-500 text-black px-3 py-1 rounded-full text-xl font-bold shadow-xl hover:bg-green-400 transition"
        >
          +
        </button>
      </div>
      <div className="flex-grow  p-6 mt-5">{renderScene()}</div>
      {/* <div className="fixed bottom-52 right-5 z-50"></div> */}
    </div>
  );
};

export default PublicSec;
