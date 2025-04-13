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

  const [milestones, setMilestones] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [contractId, setContractId] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [vote, setVote] = useState("approve");
  const [review, setReview] = useState("");
  const [image, setImage] = useState(null);
  const [showReviewModal, setShowReviewModel] = useState();
  const [reviewPayment, setReviewPayment] = useState([]);
  // const [requestedPayments, setRequestedPayments] = useState([]);
  // const [tenders, setTenders] = useState([]);
  // const [myTender, setMyTender] = useState(null);
  // const [contractor, setContractor] = useState(null);

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

  const getPayment = async () => {
    if (!contractData?._id) return;

    try {
      const response = await fetch(
        `/api/payment/get-payments/${contractData._id}`
      );
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
    getPayment();
  }, [contractData?._id]);

  const progressPercentage = contractData?.bidAmount
    ? (contractData.paidAmount / contractData.bidAmount) * 100
    : 0;
  const openReviewModal = (payment) => {
    setReviewPayment(payment);
    setShowReviewModel(true);
    console.log(payment.approvalVotes.length);
  };

  return (
    <div className="min-h-screen bg-[#060611] text-white p-1 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Contract Details
      </h1>

      {contractor ? (
        <div className="bg-gray-900 md:p-6 p-3 rounded-lg shadow-md mb-6 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl font-semibold text-teal-400">
              Contractor Details
            </h2>
            <p className="text-gray-400">Name: {contractor.name}</p>
            <p className="text-gray-400">Email: {contractor.email}</p>
            <p className="text-gray-400">
              Experience: {contractor.experienceYears} years
            </p>
            <p className="text-yellow-400 font-semibold">
              Rating: {contractorRating} ⭐
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <h3 className="text-lg font-semibold text-teal-400">
              Rate the Contractor
            </h3>
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
        <p className="text-gray-400 text-center">
          Loading contractor details...
        </p>
      )}

      <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-teal-400">
          Contract Details
        </h2>
        <p className="text-gray-400">ID: {contractData?._id}</p>
        <p className="text-gray-400">Title: {myTender?.title || "N/A"}</p>
        <p className="text-gray-400">
          Description: {myTender?.description || "N/A"}
        </p>
        <p className="text-gray-400">
          Total Budget: ₹{contractData?.bidAmount}
        </p>
      </div>

      <div className="bg-gray-800 p-4 rounded-md shadow-md mb-6">
        <h3 className="text-lg font-semibold text-teal-400">
          Contract Progress
        </h3>
        <div className="w-full bg-gray-700 h-4 rounded-md overflow-hidden mt-2">
          <div
            className="bg-green-500 h-4 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-gray-400 mt-2">
          {progressPercentage.toFixed(2)}% Completed
        </p>
      </div>

      {/* <MilestoneTracker contractData={contractData} /> */}
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
                          <div>
                            <button
                              onClick={() => openVoteModal(payment)}
                              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
                            >
                              Vote
                            </button>
                            <button onClick={() => setShowReviewModel(payment)}>
                              View votes
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p>Voting Over</p>
                            <button onClick={() => openReviewModal(payment)}>
                              View votes
                            </button>
                          </div>
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

        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 text-white">
                Votes and reviews
              </h2>

              <div className="text-lg justify-self-center">Votes in Fabour</div>
              {reviewPayment.approvalVotes.map((payment, index) => (
                <div key={index} className="flex gap-3">
                   {payment.image && <img className="h-10 w-10" src={payment.image}/>}
                  <h1 className="text-white">{payment.description}</h1>
                 
                </div>
              ))}
              <div className="text-lg justify-self-center">Votes against Fabour</div>
              {reviewPayment.rejectionVotes.map((payment, index) => (
                <div key={index}>
                  <h1 className="text-white">{payment.description}</h1>
                  {payment.image && <h1>{payment.image}</h1>}
                </div>
              ))}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReviewModel(false)}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  Close
                </button>
                {/* <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                >
                  Submit Vote
                </button> */}
              </div>
            </div>
          </div>
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

      <h2 className="text-xl sm:text-2xl mt-4 justify-self-center font-semibold text-white mb-4 text-center sm:text-left">
        Payment History
      </h2>

      {loading ? (
        <p className="text-center text-gray-400">Loading payments...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : requestedPayments.filter((p) => p.status === "Completed").length >
        0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {requestedPayments
            .filter((payment) => payment.status === "Completed")
            .map((payment) => (
              <div
                key={payment._id}
                className="bg-gray-900 md:p-6 p-3 rounded-lg shadow-md"
              >
                <p className="text-lg text-teal-400">ID: {payment._id}</p>
                <p className="text-gray-400">
                  Bid Amount: ₹{payment.bidAmount}
                </p>
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
