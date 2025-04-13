"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ContractDesc() {
  const searchParams = useSearchParams();
  const contracts = searchParams.get("contract");
  const contractData = contracts ? JSON.parse(contracts) : null;
  console.log("contract data:", contractData);

  const [paymentMade, setPaymentMade] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState(null);
  const [requestedPayments, setRequestedPayments] = useState([]);
  const [progress, setProgress] = useState("");
  const [pendingPayment, setPendingPayment] = useState({
    contractorId: "",
    contractId: "",
    bidAmount: "",
    amountUsed: "",
    reason: "",
    paymentMade: "",
    status: "",
    progress: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (paymentMade > contractData.bidAmount - contractData.paidAmound) {
      alert("Your requested amount exceeds the available limit.");
      return;
    }

    const formData = new FormData();
    formData.append("contractorId", contractData.contractorMongoId);
    formData.append("contractorWallet", contractData.contractor);
    formData.append("contractId", contractData.mongoContractId);
    formData.append("bidAmount", contractData.contractAmount);
    formData.append("reason", otherText || selectedOption);
    formData.append("progress", progress);
    formData.append("paymentMade", paymentMade);
    formData.append("status", "Pending");

    // if (imageFile) {
    formData.append("workImage", imageFile);
    // }

    try {
      const response = await fetch("/api/payment/create-payment", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        alert("Payment details saved!");
        setPaymentMade("");
        setSelectedOption("");
        setOtherText("");
        setProgress("");
        setImageFile(null);
        getPayments();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Payment submission failed", error);
      alert("Failed to submit payment details.");
    }
  };

  const getPayments = async () => {
    const contractId = contractData.mongoContractId;

    try {
      const response = await fetch(`/api/payment/get-payments/${contractId}`, {
        method: "GET",
      });

      const data = await response.json();

      if (data) {
        console.log(data);
        setRequestedPayments(data);
      } else {
        alert("Error: " + data.massage);
      }
    } catch (error) {
      console.error("Payment submission failed", error);
      alert("Failed to submit payment details.");
    }
  };
  useEffect(() => {
    getPayments();
  }, []);

  return (
    <div className="min-h-screen bg-[#060611] text-white md:p-6 p-3 flex flex-col items-center">
      <div className="md:text-3xl text-2xl font-bold text-teal-400 mb-4 text-center">
        Request Payment
      </div>
      <div className="w-full max-w-2xl bg-[#1a1a1a] shadow-lg rounded-lg p-6 border border-gray-700">
        <h1 className="md:text-3xl text-2xl font-bold text-white mb-4 text-center">
          Contract Details
        </h1>
        <div className="space-y-4">
          <InfoRow label="Contract Title" value={contractData.projectTitle} />
          <InfoRow label="Reference ID" value={contractData.contractId} />
          <InfoRow
            label="Bid Amount"
            value={`₹${contractData.contractAmount}`}
          />
        </div>
        <div className="mt-6">
          <label className="block text-gray-300 font-semibold mb-1">
            Requirement:
          </label>
          <select
            className="w-full p-2 border border-gray-600 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">Select</option>
            <option value="rods">Rods</option>
            <option value="sand">Sand</option>
            <option value="cement">Cement</option>
            <option value="other">Other</option>
          </select>

          {selectedOption === "other" && (
            <input
              type="text"
              placeholder="Enter Material"
              value={otherText || ""}
              onChange={(e) => setOtherText(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-600 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          )}
        </div>
        <div className="mt-6">
          <label className="block text-gray-300 font-semibold mb-1">
            Work Progress:
          </label>
          <input
            type="text"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            className="w-full p-2 border border-gray-600 bg-black rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="mt-6">
          <label className="block text-gray-300 font-semibold mb-1">
            Upload Work Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full p-2 bg-black border border-gray-600 rounded-md text-white"
          />
        </div>
        <div className="mt-6">
          <label className="block text-gray-300 font-semibold mb-1">
            Payment Required:
          </label>
          <input
            type="number"
            value={paymentMade}
            onChange={(e) => setPaymentMade(e.target.value)}
            className="w-full p-2 border border-gray-600 bg-black rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-teal-500 text-black font-semibold p-3 mt-4 rounded-lg hover:bg-teal-400 transition duration-200"
        >
          Submit Payment
        </button>
        <h2 className="text-2xl font-bold text-teal-400 mt-8 text-center">
          Pending Payment Approvals
        </h2>
        {requestedPayments.filter((payment) => payment.status === "Pending")
          .length > 0 ? (
          requestedPayments
            .filter((payment) => payment.status === "Pending")
            .map((payment, index) => (
              <div
                key={index}
                className="bg-[#222] p-4 mt-4 rounded-lg shadow-md border border-gray-700"
              >
                <InfoRow label="Bid Amount" value={`₹${payment.bidAmount}`} />
                <InfoRow
                  label="Requested Amount"
                  value={`₹${payment.paymentMade}`}
                />
                <InfoRow
                  label="Remaining Amount"
                  value={`₹${payment.bidAmount - payment.paymentMade}`}
                />
                <InfoRow
                  label="Status"
                  value={
                    payment.status == "Completed" ? (
                      <span className="text-green-400 font-semibold">
                        Completed
                      </span>
                    ) : (
                      <span className="text-red-400 font-semibold">
                        Pending
                      </span>
                    )
                  }
                />
              </div>
            ))
        ) : (
          <div className="my-2 justify-self-center">No Pending Payments</div>
        )}
      </div>
      <div className="w-full">
        <h2 className="text-2xl font-bold text-teal-400 mt-8 text-center">
          Payments History
        </h2>
        {requestedPayments.filter((payment) => payment.status === "Completed")
          .length > 0 ? (
          requestedPayments
            .filter((payment) => payment.status === "Completed")
            .map((payment, index) => (
              <div
                key={index}
                className="bg-[#222] p-4 mt-4 rounded-lg shadow-md border border-gray-700"
              >
                <InfoRow label="Bid Amount" value={`₹${payment.bidAmount}`} />
                <InfoRow
                  label="Requested Amount"
                  value={`₹${payment.paymentMade}`}
                />
                <InfoRow
                  label="Remaining Amount"
                  value={`₹${payment.bidAmount - payment.paymentMade}`}
                />
                <InfoRow
                  label="Status"
                  value={
                    payment.status == "Completed" ? (
                      <span className="text-green-400 font-semibold">
                        Completed
                      </span>
                    ) : (
                      <span className="text-red-400 font-semibold">
                        Pending
                      </span>
                    )
                  }
                />
              </div>
            ))
        ) : (
          <div className="my-2 justify-self-center"> No Payments Available</div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-700 py-2">
      <span className="text-gray-300 font-semibold">{label}:</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
