"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BrowserProvider, Contract } from "ethers";
import Tender from "@/contracts/TenderCreation";
import { useGovUser } from "@/Context/govUser";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <MakeTender />
    </Suspense>
  );
}

export const MakeTender = () => {
  // const searchParams = useSearchParams();
  // const issueParam = searchParams.get("issue");
  // const parsedIssue = issueParam
  //   ? JSON.parse(decodeURIComponent(issueParam))
  //   : null;

  const [creator, setCreator] = useState(null);
  const { user } = useGovUser();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    minBidAmount: "",
    maxBidAmount: "",
    bidOpeningDate: "",
    bidClosingDate: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setCreator(user);
  }, [user]);

  console.log(creator);

  const contractAddress = "0x65287e595750b26423761930F927e084B4175245";

  const submitTender = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("Metamask is not installed.");
      }

      const TenderABI = Tender.abi;
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, TenderABI, signer);

      const deadline = Math.floor(
        new Date(formData.bidClosingDate).getTime() / 1000
      );
      const starting = Math.floor(
        new Date(formData.bidOpeningDate).getTime() / 1000
      );

      const tx = await contract.createTender(
        formData.title,
        formData.description,
        formData.category,
        formData.minBidAmount,
        formData.maxBidAmount,
        starting,
        deadline,
        formData.location,
        creator?.id
      );

      await tx.wait();
      console.log("✅ Tender successfully created on Blockchain");

      // Store in MongoDB
      const mongoResponse = await fetch("/api/tender/create-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          creator,
        }),
      });

      const mongoData = await mongoResponse.json();
      if (!mongoResponse.ok) {
        throw new Error(mongoData.error || "Failed to store in MongoDB");
      }

      setSuccess("Tender successfully created on MongoDB and Blockchain!");
      setFormData({
        title: "",
        description: "",
        category: "",
        minBidAmount: "",
        maxBidAmount: "",
        bidOpeningDate: "",
        bidClosingDate: "",
        location: "",
      });

      alert("tender created successfully");
    } catch (err) {
      console.error("❌ Error submitting tender:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const [creator, setCreator] = useState(null);

  // const [formData, setFormData] = useState({
  //   title: "",
  //   description: "",
  //   category: "",
  //   minBidAmount: "",
  //   maxBidAmount: "",
  //   bidOpeningDate: "",
  //   bidClosingDate: "",
  //   location: "",
  // });

  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  // const [success, setSuccess] = useState(null);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     axios
  //       .get("/api/gov-sec/profile", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       })
  //       .then((res) => setCreator(res.data))
  //       .catch(() => localStorage.removeItem("gov-token"));
  //   }
  // }, []);
  // console.log(creator);

  // const submitTender = async () => {
  //   setLoading(true);
  //   setError(null);
  //   setSuccess(null);

  //   try {
  //     const mongoResponse = await fetch("/api/tender/create-tender", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         ...formData,
  //         creator,
  //       }),
  //     });

  //     const mongoData = await mongoResponse.json();
  //     if (!mongoResponse.ok)
  //       throw new Error(mongoData.error || "Failed to store in MongoDB");

  //     setSuccess("Tender successfully created on MongoDB and Blockchain!");
  //     setFormData({
  //       title: "",
  //       description: "",
  //       category: "",
  //       minBidAmount: "",
  //       maxBidAmount: "",
  //       bidOpeningDate: "",
  //       bidClosingDate: "",
  //     });
  //   } catch (err) {
  //     console.error("Error submitting tender:", err);
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  return (
    <div className="flex flex-col items-center bg-[#060611] text-white md:p-6 p-3 min-h-screen">
      <div className="md:text-3xl text-2xl font-bold text-teal-400 mb-4 text-center">
        Create Tender
      </div>
      <div className="bg-gray-900 p-3 md:p-6 rounded-lg shadow-lg w-full max-w-lg mt-6">
        <h2 className="text-2xl font-bold text-white">Enter Tender Details</h2>

        <div className="grid gap-4">
          <div className="mt-2">
            <label className="block font-semibold text-gray-300">
              Tender Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Tender Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <div className="mt-2">
            <label className="block font-semibold text-gray-300">
              Tender Description
            </label>
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <div className="mt-2">
            <label className="block font-semibold text-gray-300">
              Category
            </label>
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <div className="mt-2">
            <label className="block font-semibold text-gray-300">
              Min Bid Amount
            </label>
            <input
              type="number"
              name="minBidAmount"
              placeholder="Min Bid Amount "
              value={formData.minBidAmount}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <div className="mt-2">
            <label className="block font-semibold text-gray-300">
              Max Bid Amount
            </label>
            <input
              type="number"
              name="maxBidAmount"
              placeholder="Max Bid Amount "
              value={formData.maxBidAmount}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <div className="mt-2">
            <label className="block font-semibold text-gray-300">
              Bid Opening Date
            </label>
            <input
              type="date"
              name="bidOpeningDate"
              value={formData.bidOpeningDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <div className="mt-2">
            <label className="block font-semibold text-gray-300">
              Bid Closing Date
            </label>
            <input
              type="date"
              name="bidClosingDate"
              value={formData.bidClosingDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <div className="mt-2">
            <label className="block font-semibold text-gray-300">
              Work Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="Work Location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            onClick={submitTender}
            className="bg-teal-400 text-black p-2 rounded-lg font-bold"
            disabled={loading}
          >
            {loading ? "Creating Tender..." : "Submit Tender"}
          </button>
        </div>
      </div>
    </div>
  );
};
