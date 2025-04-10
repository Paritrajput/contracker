// "use client";
// import { useEffect, useState } from "react";
// import Page1 from "@/Components/Gov/page1";
// import Page2 from "@/Components/Gov/page2";
// import Page3 from "@/Components/Gov/page3";
// import { useGovUser } from "@/Context/govUser";
// import { useRouter } from "next/navigation";

// const ContractBottom = () => {
//   const [activeTab, setActiveTab] = useState("Issue");
//   const router = useRouter();

//   const {
//     user,
//     govProfile,
//   } = useGovUser();

//   console.log("user", user);

//   //   const token = localStorage.getItem("token");
//   //   console.log(token)
//   //   if (!token) {
//   //     router.push("/authenticate/gov-auth/login");
//   //   } else {
//   //     if (token.role == "gov") {
//   //       axios
//   //         .get("/api/gov-sec/profile", {
//   //           headers: { Authorization: `Bearer ${token}` },
//   //         })
//   //         .then((res) => {
//   //           console.log("my profile:", res.data);
//   //           setMyProfile(res.data.user);
//   //           setGovProfile(res.data.user);
//   //           if (res.data.owner) {
//   //             if (res.data?.isSuperOwner) {
//   //               setIsSuperOwner(true);
//   //             }
//   //             setIsOwner(true);
//   //           }
//   //           //  setUser(res.data)
//   //         })
//   //         .catch(() => localStorage.removeItem("gov-token"));
//   //     }
//   //     console.log(token);
//   //   }
//   // }, []);
//   const handleLogout = async () => {
//     // await axios.post("/api/contractor/logout");
//     localStorage.removeItem("gov-token");
//     router.push("/authenticate/gov-auth/login");
//   };

//   const renderScene = () => {
//     switch (activeTab) {
//       case "Issue":
//         return <Page1 />;
//       case "Tender":
//         return <Page3 />;
//       case "Contract":
//         return <Page2 />;
//       default:
//         return <Page1 />;
//     }
//   };

//   return (
//     <div className="flex flex-col  bg-black text-white">
//       <div className="fixed top-[4.2rem] left-0 w-full bg-gray-900 text-white p-2 shadow-md flex items-center justify-between z-50">
//         <div className="flex items-center gap-4">
//           <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
//             <span className="text-lg font-bold">👤</span>
//           </div>

//           <div>
//             <p className="text-lg font-semibold">
//               {user?.name || "Owner Name"}
//             </p>
//             <p className="text-sm text-gray-400">
//               {user?.email || "owner@example.com"}
//             </p>
//           </div>
//         </div>

//         <div className=" p-4 text-center">
//           {user?.owner && (
//             <div>
//               {user?.superOwner ? (
//                 <div className="text-purple-500 ">You are a SuperOwner</div>
//               ) : (
//                 <div className="text-teal-500">You are an Owner</div>
//               )}
//             </div>
//           )}
//         </div>
//         <div className="flex items-center gap-12">
//           <button
//             onClick={handleLogout}
//             className="  bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
//           >
//             Logout
//           </button>

//           {(user?.owner || user?.superOwner) && (
//             <button
//               onClick={() =>
//                 router.push(`/gov-sec/owner-dashboard/${user.id}`)
//               }
//               className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition"
//             >
//               Owner Dashboard
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="flex-1 p-4 mt-20">{renderScene()}</div>

//       <div className="flex justify-around bg-gray-900 p-4 fixed bottom-0 w-full border-t border-gray-700">
//         {["Issue", "Tender", "Contract"].map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`px-4 py-2 text-sm font-semibold transition ${
//               activeTab === tab
//                 ? "text-teal-400 border-b-2 border-teal-400"
//                 : "text-gray-400 hover:text-teal-300"
//             }`}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ContractBottom;

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useGovUser } from "@/Context/govUser";
import { useRouter } from "next/navigation";

export default function GovHomePage() {
  const router = useRouter();
  const { user } = useGovUser();
  const handleLogout = async () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  console.log("user", user);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="px-6 md:px-20 pt-20 pb-10 text-center space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold leading-tight text-cyan-400"
        >
          Government Dashboard
        </motion.h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Oversee tenders, monitor projects, and ensure public transparency.
        </p>

        <div className="flex justify-center flex-wrap gap-4 pt-6">
          {!user ? (
            <Link href="/login">
              <button className="bg-white hover:bg-orange-400 text-white font-semibold px-4 py-2 rounded-2xl">
                Login
              </button>
            </Link>
          ) : (
            <div className="flex gap-5 max-md:flex-col ">
              <div className="bg-white px-4 py-2 text-black rounded-xl flex items-center">
                welcome, {user.name}
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition"
                  size={18}
                />
              </div>
              <button
                className="bg-red-800 justify-center px-4 py-2 text-white rounded-xl flex items-center"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </section>

      {user?.owner && (
        <div>
          {user?.superOwner ? (
            <section className="px-6 md:px-20 py-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white">
                SuperOwner Specific Actions
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <GovFeatureCard
                  title="Add Owners"
                  desc="View and prioritize public-submitted concerns."
                  href="/gov-sec/add-owner"
                />
                <GovFeatureCard
                  title="Admin Requests"
                  desc="Draft and launch new infrastructure tenders."
                  href={`/gov-sec/owner-dashboard/${user.id}`}
                />
              </div>
            </section>
          ) : (
            <section className="px-6 md:px-20 py-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white">
                Owner Specific Actions
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <GovFeatureCard
                  title="Admin Requests"
                  desc="Draft and launch new infrastructure tenders."
                  href={`/gov-sec/owner-dashboard/${user.id}`}
                />
              </div>
            </section>
          )}
        </div>
      )}

      {/* Government Features */}
      <section className="px-6 md:px-20 py-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white">
          Actions You Can Take
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GovFeatureCard
            title="Active Issues"
            desc="View and prioritize public-submitted concerns."
            href="/gov-sec/active-issues"
          />
          <GovFeatureCard
            title="Create Tenders"
            desc="Draft and launch new infrastructure tenders."
            href="/gov-sec/new-tender"
          />
          <GovFeatureCard
            title="Monitor Contracts"
            desc="Oversee live contracts and track progress."
            href="/gov-sec/active-contracts"
          />
          <GovFeatureCard
            title="Active Tenders"
            desc="Review ongoing tenders and contractor bids."
            href="/gov-sec/active-tenders"
          />
          {/* <GovFeatureCard
            title="Milestone Approvals"
            desc="Manage approval flow for project milestones."
            href="/gov-sec/milestone-approvals"
          />
          <GovFeatureCard
            title="Performance Reports"
            desc="View feedback and performance analytics."
            href="/gov-sec/performance-reports"
          /> */}
        </div>
      </section>
    </main>
  );
}

function GovFeatureCard({ title, desc, href }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors rounded-2xl p-6 shadow-lg flex flex-col justify-between border border-cyan-600"
    >
      <div>
        <h3 className="text-xl font-semibold text-cyan-400 mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{desc}</p>
      </div>
      <Link href={href}>
        <span className="text-black bg-cyan-400 px-3 py-2 rounded-xl font-semibold inline-flex items-center group hover:bg-cyan-300">
          Explore{" "}
          <ArrowRight
            className="ml-2 group-hover:translate-x-1 transition-transform"
            size={18}
          />
        </span>
      </Link>
    </motion.div>
  );
}

