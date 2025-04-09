"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ContractsPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [contractorId, setContractorId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/contractor/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setContractorId(res.data._id);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setError("Failed to fetch contractor profile");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError("Unauthorized: No token found");
    }
  }, []);

  useEffect(() => {
    if (!contractorId) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/contracts/${contractorId}`);
        setContracts(response.data.contracts);
      } catch (error) {
        console.error("Could not get contracts", error);
        setError("Could not get contracts");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contractorId]);

  return (
    <div className="flex flex-col items-center min-h-screen md:p-6 p-3 bg-[#060611] text-white">
      <h1 className="md:text-3xl text-2xl font-bold mb-6 text-teal-400">Your Contracts</h1>
      <div className="w-full max-w-3xl">
        {loading ? (
          <SkeletonCards />
        ) : error ? (
          <p className="text-lg text-center mt-6 text-red-500">{error}</p>
        ) : contracts.length === 0 ? (
          <p className="text-gray-500 text-center">No contracts found</p>
        ) : (
          contracts.map((item) => (
            <CardComponent
              key={item.contractId}
              title={`Contract ID: ${item.mongoContractId}`}
              content={`Bid Amount: ${item.contractAmount} Rs`}
              status={`Status: ${item.isCompleted ? "Completed" : "Pending"}`}
              onClick={() =>
                router.push(
                  `/contractor-sec/contract-desc?contract=${encodeURIComponent(
                    JSON.stringify(item)
                  )}`
                )
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

function CardComponent({ title, content, status, onClick }) {
  return (
    <div
      className="bg-gray-900 p-4 rounded-lg shadow-lg mb-4 cursor-pointer transition-transform transform hover:scale-105 hover:bg-gray-800 border border-gray-700"
      onClick={onClick}
    >
      <h2 className="md:text-xl text-lg font-semibold text-white">{title}</h2>
      <p className="text-green-400 font-medium">{content}</p>
      <p className="text-green-400 font-medium">{status}</p>
    </div>
  );
}

function SkeletonCards() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-gray-800 animate-pulse p-4 rounded-lg mb-4 border border-gray-700"
        >
          <div className="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </div>
      ))}
    </>
  );
}
