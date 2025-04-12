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
  const searchParams = useSearchParams();
  const issueParam = searchParams.get("issue");
  const parsedIssue = issueParam
    ? JSON.parse(decodeURIComponent(issueParam))
    : null;

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
  // const [blockchainTenderId, setBlockchainTenderId] = useState("");

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

      // const receipt = await tx.wait();
      // console.log(receipt)

      // // const transactionHash = receipt.transactionHash;
      // let tempTenderId = "";

      // for (const log of receipt.logs) {
      //   try {
      //     const parsedLog = contract.interface.parseLog(log);
      //     if (parsedLog.name === "TenderCreated") {
      //       tempTenderId = parsedLog.args[0].toString();
      //       break;
      //     }
      //   } catch (error) {
      //     continue;
      //   }
      // }
      
      // if (!tempTenderId) {
      //   throw new Error("Tender ID not found in blockchain event logs");
      // }

      // console.log(tempTenderId)
      
      // setBlockchainTenderId(tempTenderId);
      

      // Store in MongoDB
      const mongoResponse = await fetch("/api/tender/create-tender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          issueDetails: parsedIssue,
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

  if (!parsedIssue) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#060611] text-white">
        <p className="text-red-500 text-lg">Error: Issue details not found.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center bg-[#060611] text-white p-6 min-h-screen">
      {/* Issue Details */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-teal-400">Issue Details</h2>
        <p className="mt-2">
          <strong>Type:</strong> {parsedIssue.issue_type}
        </p>
        <p>
          <strong>Description:</strong> {parsedIssue.description}
        </p>
        <p className="mt-2">
          <strong>Location:</strong> {parsedIssue.placename}
        </p>
        {parsedIssue.image && (
          <img
            src={parsedIssue.image}
            alt="Issue"
            className="w-full h-48 object-cover mt-3 rounded-md shadow-md"
          />
        )}
        <p className="mt-2">
          <strong>Date:</strong> {parsedIssue.date_of_complaint}
        </p>
      </div>

      {/* Tender Form */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg mt-6">
        <h2 className="text-2xl font-bold text-teal-400">
          Enter Tender Details
        </h2>

        <div className="grid gap-4">
          {[
            { label: "Tender Title", name: "title", type: "text" },
            {
              label: "Tender Description",
              name: "description",
              type: "textarea",
            },
            { label: "Category", name: "category", type: "text" },
            { label: "Min Bid Amount", name: "minBidAmount", type: "number" },
            { label: "Max Bid Amount", name: "maxBidAmount", type: "number" },
            { label: "Bid Opening Date", name: "bidOpeningDate", type: "date" },
            { label: "Bid Closing Date", name: "bidClosingDate", type: "date" },
            { label: "Work Location", name: "location", type: "text" },
          ].map(({ label, name, type }) => (
            <div className="mt-2" key={name}>
              <label className="block font-semibold text-gray-300">
                {label}
              </label>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-700 bg-gray-800 p-2 rounded-md text-white placeholder-gray-400 mt-1 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            onClick={submitTender}
            className="bg-teal-400 text-black p-2 rounded-lg font-bold"
            disabled={loading}
          >
            {loading ? "Creating Tender..." : "Submit Tender"}
          </button>

          {/* {success && <p className="text-green-500 mt-2">{success}</p>} */}
          {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
        </div>
      </div>
    </div>
  );
};
