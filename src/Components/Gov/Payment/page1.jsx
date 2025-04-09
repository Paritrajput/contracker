"use client";

import { useEffect, useState } from "react";

const AdminPaymentPage = (contract) => {
  const contractData = contract.contract;
  const [loading, setLoading] = useState(true);
  const [requestedPayments, setRequestedPayments] = useState([]);
  const [error, setError] = useState("");

  const getPayments = async () => {
    const contractId = contractData._id;

    try {
      const response = await fetch(`/api/payment/get-payments/${contractId}`);
      const data = await response.json();
      if (data) {
        setRequestedPayments(data);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Payment fetch failed", error);
      setError("Failed to fetch payment details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayments();
  }, []);

  const handleAction = async (action, paymentId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payment/approve-payment/${paymentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Payment ${action}d successfully!`);
        getPayments(); // Refresh the list
      } else {
        alert(data.message || `Failed to ${action} payment`);
      }
    } catch (error) {
      console.error(`Error ${action}ing payment:`, error);
      alert("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#060611] text-white p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Admin Payment Dashboard
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading payments...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : requestedPayments.filter((p) => p.status === "Pending").length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {requestedPayments
            .filter((p) => p.status === "Pending")
            .map((payment) => (
              <div
                key={payment._id}
                className="bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md"
              >
                <p className="text-sm sm:text-lg text-teal-400 break-words">
                  ID: {payment.contractId}
                </p>
                <p className="text-gray-400 text-sm sm:text-base">
                  Bid Amount: ₹{payment.bidAmount}
                </p>
                <p className="text-gray-400 text-sm sm:text-base">
                  Requested: ₹{payment.paymentMade}
                </p>
                <p className="text-gray-400 text-sm sm:text-base">
                  Reason: {payment.reason}
                </p>
                <p className="text-gray-400 text-sm sm:text-base">
                  Votes - Approvals: {payment.approvalVotes?.length}, Rejections:{" "}
                  {payment.rejectionVotes?.length}
                </p>
                <p className="text-yellow-400 font-semibold mt-2 text-sm sm:text-base">
                  Status: {payment.status}
                </p>

                <div className="flex flex-col sm:flex-row gap-2 justify-between mt-4">
                  <button
                    onClick={() => handleAction("Approve", payment._id)}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md"
                  >
                    {loading ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction("Deny", payment._id)}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md"
                  >
                    {loading ? "Processing..." : "Deny"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No pending payments found.</p>
      )}
    </div>
  );
};

export default AdminPaymentPage;
