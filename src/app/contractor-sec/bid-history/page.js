"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useGovUser } from "@/Context/govUser";

const BidHistory = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useGovUser();

  console.log(user.id);
  const contractorId=user.id

  useEffect(() => {
    const fetchBidHistory = async () => {
      console.log(user.id);
      try {
        const response = await axios.post("/api/contractor/bid-history", {
          contractorId,
        });
        console.log(response);
        setBids(response.data);
      } catch (error) {
        console.error("Error fetching bid history", error);
      } finally {
        setLoading(false);
      }
    };

    if (contractorId) {
      fetchBidHistory();
    }
  }, [contractorId]);

  return (
    <div className="bg-black min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold text-center text-teal-400 mb-6">
        My Bid History
      </h1>

      {loading ? (
        <p className="text-gray-400 text-center">Loading bid history...</p>
      ) : bids.length === 0 ? (
        <p className="text-gray-400 text-center">No bids found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bids.map((bid) => (
            <div key={bid._id} className="bg-gray-900 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-teal-300 mb-2">
                {bid.tenderTitle}
              </h2>
              <p className="text-gray-400 mb-1">
                Description: {bid.tenderDescription}
              </p>
              <p className="text-gray-400 mb-1">Bid Amount: ₹{bid.bidAmount}</p>
              <p className="text-gray-400 mb-1">
                Experience Offered: {bid.experience} yrs
              </p>
              <p className="text-gray-400 text-sm">
                Submitted on: {new Date(bid.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BidHistory;
