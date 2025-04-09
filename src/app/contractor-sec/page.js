"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useGovUser } from "@/Context/govUser";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ContractorHomePage() {
  const router = useRouter();
  const { user } = useGovUser();
  console.log(user);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0f2c] to-[#061e1e] text-white">
      {/* Hero Section */}
      <section className="px-6 md:px-20 pt-20 pb-10 text-center space-y-6 bg-gradient-to-t from-[#0a0f2c] to-[#1e1f5b]">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold leading-tight text-white"
        >
          Contractor Dashboard
        </motion.h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
          Manage your tenders, track contracts, and update work—all in one
          place.
        </p>

        <div className="flex justify-center flex-wrap gap-4 pt-6">
          {!user ? (
            <Link href="/contractor-login">
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

      {/* Features Section */}
      <section className="px-6 md:px-20 py-14 bg-gradient-to-br from-[#061e1e] to-[#0a0f2c] text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
          Contractor Tools
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="View Active Tenders"
            desc="Browse available government tenders and start bidding."
            href="/contractor-sec/active-tenders"
          />
          <FeatureCard
            title="My Bids"
            desc="Track your bidding history and current bid statuses."
            href="/contractor-sec/bid-history"
          />
          <FeatureCard
            title="My Contracts"
            desc="Monitor progress and payments for your awarded contracts."
            href="/contractor-sec/my-contracts"
          />
          {/* <FeatureCard
            title="Upload Work Progress"
            desc="Submit milestone updates and media proof for verification."
            href="/contractor/upload-progress"
          />
          <FeatureCard
            title="Messages & Alerts"
            desc="View messages from officials and notifications on contracts."
            href="/contractor-sec/messages"
          /> */}
          {/* <FeatureCard
            title="Contractor Profile"
            desc="Manage your profile, documents, and qualifications."
            href="/contractor/profile"
          /> */}
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ title, desc, href }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-[#1b2a3d] rounded-2xl p-6 shadow-xl flex flex-col justify-between border border-[#29394d]"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
        <p className="text-gray-300 mb-4">{desc}</p>
      </div>
      <Link href={href}>
        <span className="text-[#1b2a3d] bg-white hover:bg-orange-300 px-3 py-2 rounded-2xl font-medium inline-flex items-center group transition">
          Go to{" "}
          <ArrowRight
            className="ml-2 group-hover:translate-x-1 transition"
            size={18}
          />
        </span>
      </Link>
    </motion.div>
  );
}
