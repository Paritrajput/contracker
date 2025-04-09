"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const MilestoneTracker = ({ contractData }) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [contractId, setContractId] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [vote, setVote] = useState("approve");
  const [review, setReview] = useState("");
  const [image, setImage] = useState(null);
  const [requestedPayments, setRequestedPayments] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [myTender, setMyTender] = useState(null);
  const [contractor, setContractor] = useState(null);

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

  useEffect(() => {
    if (contractData) {
      // setMilestones(contractData.milestones);
      setContractId(contractData._id);
      setLoading(false);
    }
  }, [contractData]);

  // Timer to update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Separate function for vote status check
  const voteStatus = async (contractId, index) => {
    try {
      await axios.post("/api/contract-voting/public-voting", {
        contractId,
        index,
      });
      // console.log(`Checked vote status for milestone ${index}`);
    } catch (error) {
      console.error("Auto vote status failed", error);
    }
  };

  // Trigger voteStatus after deadline + 12 hrs
  // useEffect(() => {
  //   const checkMilestoneVotes = async () => {
  //     if (!milestones || milestones.length === 0) return;

  //     for (let i = 0; i < milestones.length; i++) {
  //       const milestone = milestones[i];
  //       const deadline = new Date(milestone.dueDate);
  //       const timeDiff = (currentTime - deadline) / 1000;
  //       const isClosingTime = timeDiff >= 12 * 3600;

  //       if (isClosingTime && milestone.status !== "Closed") {
  //         await voteStatus(contractId, i);
  //       }
  //     }
  //   };

  //   checkMilestoneVotes();
  // }, [currentTime, milestones, contractId]);

  const [selectedPayment, setSelectedPayment] = useState(null);

  // Open Modal & Set Selected Payment
  const openVoteModal = (payment) => {
    console.log(payment);
    setSelectedPayment(payment);
    setShowModal(true);
  };

  // Submit Vote
  const handleSubmit = async () => {
    if (!selectedPayment) return alert("No payment selected.");

    const formData = new FormData();
    formData.append("contractId", contractId);
    formData.append("paymentId", selectedPayment._id);
    formData.append("contractorId", selectedPayment.contractorId);
    formData.append("vote", vote);
    formData.append("review", review);
    if (image) formData.append("image", image);

    try {
      const response = await axios.put(
        "/api/contract-voting/public-voting",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response.status == 200) {
        alert("Vote submitted successfully!");
        setShowModal(false);
        getPayments();
      }
    } catch (err) {
      console.error("Vote submission failed:", err);
      alert("Failed to submit vote.");
    }
  };

  return (
    <div className=" bg-black/25 text-white md:p-6 p-1 ">
      <h2 className="md:text-2xl text-xl font-semibold text-white mb-4 justify-self-center">
        Payment Requested
      </h2>
      {loading ? (
        <p className="text-center text-gray-400">Loading payments...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : requestedPayments.filter((payment) => payment.status === "Pending")
          .length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requestedPayments
            .filter((payment) => payment.status === "Pending")
            .map((payment) => {
              const paymentTime = new Date(payment.createdAt);
              const timeSinceRequest =
                (new Date() - paymentTime) / (1000 * 60 * 60);
              const votingAvailable = timeSinceRequest <= 0.8;
              return (
                <div
                  key={payment._id}
                  className="bg-gray-900 md:p-6 p-3 rounded-lg shadow-md"
                >
                  <p className="text-lg text-teal-400">ID: {payment._id}</p>
                  <p className="text-gray-400">
                    Bid Amount: ₹{payment.bidAmount}
                  </p>
                  <p className="text-gray-400">
                    Payment Requested: ₹{payment.paymentMade}
                  </p>
                  {payment.progress && (
                    <p className="text-gray-400">
                      Work Progress: {payment.progress}
                    </p>
                  )}
                  <p className="text-gray-400">Reason: {payment.reason}</p>
                  <p className="text-yellow-400">Status: {payment.status}</p>
                  <div className="mt-4">
                    {Math.max(0, 0.8 - timeSinceRequest).toFixed(1) > 0 && (
                      <p className="text-sm text-gray-400">
                        Time left:{" "}
                        {Math.max(0, 0.8 - timeSinceRequest).toFixed(1)} hrs
                      </p>
                    )}
                    <div className="flex gap-4 mt-2">
                      {votingAvailable ? (
                        <button
                          onClick={() => openVoteModal(payment)}
                          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
                        >
                          Vote
                        </button>
                      ) : (
                        <p>Voting Over</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <p className="text-center text-gray-400">No pending payment found.</p>
      )}
      {showModal && (
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
              <label className="block mb-2 font-medium">
                Upload Progress Image:
              </label>
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
      )}
    </div>
  );
};

export default MilestoneTracker;
