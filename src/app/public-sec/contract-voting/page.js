"use client";

import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import MilestoneTracker from "@/Components/People/voting";
import ProtectedRoute from "@/Components/ProtectedRoutes/protected-routes";
export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <AdminPaymentPage />
    </Suspense>
  );
}
export const AdminPaymentPage = () => {
  const searchParams = useSearchParams();
  const contractParam = searchParams.get("contract");
  const contractData = contractParam
    ? JSON.parse(decodeURIComponent(contractParam))
    : null;

  console.log(contractData);
  console.log("Contract Data milestones:", contractData.milestones);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestedPayments, setRequestedPayments] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [myTender, setMyTender] = useState(null);
  const [contractor, setContractor] = useState(null);
  const [contractorRating, setContractorRating] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [vote, setVote] = useState("approve");
  const [review, setReview] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    console.log("Vote:", vote);
    console.log("Review:", review);
    console.log("Image:", image);
    // You can now send this data to your backend
    setShowModal(false);
  };

  useEffect(() => {
    const fetchContractor = async () => {
      if (!contractData.winner) return;

      try {
        console.log(contractData.winner);
        const response = await axios.post("/api/contractor/get-profile", {
          contractorId: contractData.winner,
        });
        console.log("Contractor Data:", response.data);

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
  }, [contractData.winner]);

  const [newRating, setNewRating] = useState("");

  const submitRating = async () => {
    if (!newRating || newRating < 1 || newRating > 5) {
      alert("Please enter a valid rating between 1 and 5.");
      return;
    }

    try {
      await axios.post("/api/contractor/rating", {
        contractorId: contractData.winner,
        userId: "currentUserId",
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
        console.log("Tenders Data:", response.data);
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
      const foundTender = tenders.find((m) => m._id === contractData.tenderId);
      setMyTender(foundTender);
    }
  }, [tenders, contractData.tenderId]);

  const getPayments = async () => {
    if (!contractData._id) return;

    try {
      const response = await fetch(
        `/api/payment/get-payments/${contractData._id}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Payments Data:", data);
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
  }, [contractData._id]);

  const totalPaymentsMade = requestedPayments.reduce(
    (sum, payment) => sum + payment.paymentMade,
    0
  );
  const progressPercentage = contractData.bidAmount
    ? (totalPaymentsMade / contractData.bidAmount) * 100
    : 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#060611] text-white md:p-6 p-3">
        <h1 className="text-3xl font-bold text-center mb-6">
          Contract Details
        </h1>

        {contractor ? (
          <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6 flex max-md:flex-col gap-5 md:gap-20">
            <div>
              <h2 className="text-2xl font-semibold text-teal-400">
                Contractor Details
              </h2>
              <p className="text-gray-400">Name: {contractor.name}</p>
              <p className="text-gray-400">Email: {contractor.email}</p>
              <p className="text-gray-400">
                Experience: {contractor.experienceYears || 0} years
              </p>
              <p className="text-yellow-400 font-semibold">
                Rating: {contractorRating || 0} ⭐
              </p>
            </div>
            <div className="">
              <h3 className="text-lg font-semibold text-teal-400">
                Rate the Contractor
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="5"
                  className="p-2 bg-gray-800 text-white rounded"
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
          <p className="text-gray-400">Loading contractor details...</p>
        )}

        <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-teal-400">
            Contract Details
          </h2>
          <p className="text-gray-400">ID: {contractData._id}</p>
          <p className="text-gray-400">
            Contract Title: {myTender?.title || "N/A"}
          </p>
          <p className="text-gray-400">
            Contract Description: {myTender?.description || "N/A"}
          </p>
          <p className="text-gray-400">
            Total Budget: ₹{contractData.bidAmount}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded-md shadow-md mb-6">
          <h3 className="text-lg font-semibold text-teal-400">
            Contract Progress
          </h3>
          <div className="w-full bg-gray-700 h-4 rounded-md overflow-hidden mt-2">
            <div
              className="bg-green-500 h-4"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-gray-400 mt-2">
            {progressPercentage.toFixed(2)}% Completed
          </p>
        </div>

        <MilestoneTracker contractData={contractData} />

        <h2 className="text-2xl font-semibold text-white mb-4 justify-self-center">
          Payment History
        </h2>
        {loading ? (
          <p className="text-center text-gray-400">Loading payments...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : requestedPayments.filter(
            (payment) => payment.status === "Completed"
          ).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requestedPayments
              .filter((payment) => payment.status === "Completed")
              .map((payment) => (
                <div
                  key={payment._id}
                  className="bg-gray-900 p-6 rounded-lg shadow-md"
                >
                  <p className="text-lg text-teal-400">ID: {payment._id}</p>
                  <p className="text-gray-400">
                    Bid Amount: ₹{payment.bidAmount}
                  </p>
                  <p className="text-gray-400">
                    Payment Requested: ₹{payment.paymentMade}
                  </p>
                  <p className="text-gray-400">Reason: {payment.reason}</p>
                  <p className="text-yellow-400">Status: {payment.status}</p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No payment history found.</p>
        )}

        {/* {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Cast Your Vote
            </h2>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Decision:</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="vote"
                    value="approve"
                    checked={vote === "approve"}
                    onChange={(e) => setVote(e.target.value)}
                    className="mr-2"
                  />
                  Approve
                </label>
     
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="vote"
                    value="reject"
                    checked={vote === "reject"}
                    onChange={(e) => setVote(e.target.value)}
                    className="mr-2"
                  />
                  Reject
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Review:</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write your review..."
                className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Upload Progress Image:</label>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="text-white"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
              >
                Submit Vote
              </button>
            </div>
          </div>
        </div>
      )} */}
      </div>
    </ProtectedRoute>
  );
};


