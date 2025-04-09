"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function OwnerDashboard() {
  const params = useParams();
  const ownerId = params?.ownerId; // Safe access

  const [adminRequests, setAdminRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin");
      setAdminRequests(res.data.data);
    } catch (error) {
      console.error("Error fetching admin requests", error);
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id) => {
    if (!ownerId) {
      alert("Owner ID not found.");
      return;
    }

    try {
      const response = await axios.post(`/api/admin/${id}`, { ownerId });
      console.log(response.data);
      setAdminRequests((prev) => prev.filter((req) => req._id !== id));
      alert("Admin request approved!");
    } catch (error) {
      console.error("Error approving admin", error);
    }
  };

  useEffect(() => {
    fetchAdminRequests();
  }, []);

  return (
    <div className="p-6 bg-[#060611] rounded-lg min-h-screen">
      <h2 className="text-xl text-teal-400 font-bold mb-4">
        Pending Admin Requests
      </h2>

      {loading ? (
        <p className="text-gray-400">Loading requests...</p>
      ) : adminRequests.length === 0 ? (
        <p className="text-gray-400">No pending requests</p>
      ) : (
        <ul className="space-y-3">
          {adminRequests.map((admin) => (
            <li
              key={admin._id}
              className="flex justify-between bg-gray-700 p-3 rounded-md"
            >
              <div>
                <p className="font-semibold">{admin.name}</p>
                <p className="text-sm text-gray-400">{admin.email}</p>
              </div>
              <button
                onClick={() => approveRequest(admin._id)}
                className="bg-green-500 px-3 py-1 rounded-md hover:bg-green-600"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
