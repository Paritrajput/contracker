"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import MilestoneTracker from "@/Components/People/voting";

const AdminPaymentPage = () => {
  const searchParams = useSearchParams();
  const contractParam = searchParams.get("contract");
  const contractData = contractParam
    ? JSON.parse(decodeURIComponent(contractParam))
    : null;

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestedPayments, setRequestedPayments] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [myTender, setMyTender] = useState(null);
  const [contractor, setContractor] = useState(null);
  const [contractorRating, setContractorRating] = useState(null);
  const [newRating, setNewRating] = useState("");

  useEffect(() => {
    const fetchContractor = async () => {
      if (!contractData?.winner) return;

      try {
        const response = await axios.post("/api/contractor/get-profile", {
          contractorId: contractData.winner,
        });

        setContractor(response.data);
        setContractorRating(response.data.contractorRating);
      } catch (error) {
        console.error("Could not get contractor", error);
        setError("Could not get contractor");
      } finally {
        setLoading(false);
      }
    };

    fetchContractor();
  }, [contractData?.winner]);

  const submitRating = async () => {
    if (!newRating || newRating < 1 || newRating > 5) {
      alert("Please enter a valid rating between 1 and 5.");
      return;
    }

    try {
      await axios.post("/api/contractor/rating", {
        contractorId: contractData.winner,
        userId: "currentUserId", // replace this with actual current user
        rating: parseInt(newRating),
      });
      alert("Rating submitted!");
      setNewRating("");
    } catch (error) {
      console.error("Failed to submit rating", error);
      alert("Failed to submit rating.");
    }
  };

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await axios.get("/api/tender/get-tender");
        setTenders(response.data);
      } catch (error) {
        console.error("Could not get tenders", error);
        setError("Could not get tenders");
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  useEffect(() => {
    if (tenders.length > 0) {
      const foundTender = tenders.find((m) => m._id === contractData?.tenderId);
      setMyTender(foundTender);
    }
  }, [tenders, contractData?.tenderId]);

  const getPayments = async () => {
    if (!contractData?._id) return;

    try {
      const response = await fetch(`/api/payment/get-payments/${contractData._id}`);
      const data = await response.json();
      if (response.ok) {
        setRequestedPayments(data);
      } else {
        setError("No payment history found.");
      }
    } catch (error) {
      console.error("Failed to fetch payments", error);
      setError("Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayments();
  }, [contractData?._id]);

  const progressPercentage = contractData?.bidAmount
    ? (contractData.paidAmount / contractData.bidAmount) * 100
    : 0;

  return (
    <div className="min-h-screen bg-[#060611] text-white p-1 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Contract Details</h1>

      {contractor ? (
        <div className="bg-gray-900 md:p-6 p-3 rounded-lg shadow-md mb-6 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl font-semibold text-teal-400">Contractor Details</h2>
            <p className="text-gray-400">Name: {contractor.name}</p>
            <p className="text-gray-400">Email: {contractor.email}</p>
            <p className="text-gray-400">Experience: {contractor.experienceYears} years</p>
            <p className="text-yellow-400 font-semibold">Rating: {contractorRating} ⭐</p>
          </div>
          <div className="w-full lg:w-1/2">
            <h3 className="text-lg font-semibold text-teal-400">Rate the Contractor</h3>
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
              <input
                type="number"
                min="1"
                max="5"
                className="p-2 bg-gray-800 text-white rounded w-full sm:w-auto"
                value={newRating}
                onChange={(e) => setNewRating(e.target.value)}
              />
              <button
                className="bg-teal-500 text-white px-4 py-2 rounded"
                onClick={submitRating}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-400 text-center">Loading contractor details...</p>
      )}

      <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-teal-400">Contract Details</h2>
        <p className="text-gray-400">ID: {contractData?._id}</p>
        <p className="text-gray-400">Title: {myTender?.title || "N/A"}</p>
        <p className="text-gray-400">Description: {myTender?.description || "N/A"}</p>
        <p className="text-gray-400">Total Budget: ₹{contractData?.bidAmount}</p>
      </div>

      <div className="bg-gray-800 p-4 rounded-md shadow-md mb-6">
        <h3 className="text-lg font-semibold text-teal-400">Contract Progress</h3>
        <div className="w-full bg-gray-700 h-4 rounded-md overflow-hidden mt-2">
          <div
            className="bg-green-500 h-4 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-gray-400 mt-2">{progressPercentage.toFixed(2)}% Completed</p>
      </div>

      <MilestoneTracker contractData={contractData} />

      <h2 className="text-xl sm:text-2xl mt-4 justify-self-center font-semibold text-white mb-4 text-center sm:text-left">
        Payment History
      </h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading payments...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : requestedPayments.filter((p) => p.status === "Completed").length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requestedPayments
            .filter((payment) => payment.status === "Completed")
            .map((payment) => (
              <div
                key={payment._id}
                className="bg-gray-900 md:p-6 p-3 rounded-lg shadow-md"
              >
                <p className="text-lg text-teal-400">ID: {payment._id}</p>
                <p className="text-gray-400">Bid Amount: ₹{payment.bidAmount}</p>
                <p className="text-gray-400">Paid: ₹{payment.paymentMade}</p>
                <p className="text-gray-400">Reason: {payment.reason}</p>
                <p className="text-yellow-400">Status: {payment.status}</p>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No payment history found.</p>
      )}
    </div>
  );
};

export default AdminPaymentPage;
