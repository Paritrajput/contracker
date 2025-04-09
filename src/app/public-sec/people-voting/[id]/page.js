"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import ProtectedRoute from "@/Components/ProtectedRoutes/protected-routes";

const PeopleVote = () => {
  const router = useRouter();
  const { id } = useParams();
  const [issue2, setIssue2] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [eligible, setEligible] = useState(null);
  const [issueLocation, setIssueLocation] = useState(null);
  const [loading, setLoading] = useState(true); // 🔄

  // Fetch issue details
  useEffect(() => {
    const getIssue = async () => {
      try {
        const response = await axios.get(`/api/public-issue/${id}`);
        setIssue2(response.data);
        setIssueLocation(response.data.location);
      } catch {
        console.log("Failed to fetch issue");
      } finally {
        setLoading(false); // ⛔ loading done
      }
    };
    if (id) getIssue();
  }, [id]);

  // Get user's geolocation
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Location access is required to verify voting eligibility.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  // Check eligibility only when both issue location & user location are available
  useEffect(() => {
    if (userLocation && issueLocation) {
      checkEligibility(userLocation.lat, userLocation.lon);
    }
  }, [userLocation, issueLocation]);

  const checkEligibility = async (lat, lon) => {
    try {
      const response = await fetch("/api/check-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userLat: lat,
          userLon: lon,
          issueLat: issueLocation.lat,
          issueLon: issueLocation.lng,
        }),
      });

      const data = await response.json();
      console.log(data);
      setEligible(data.eligible);
    } catch (error) {
      console.error("Error checking eligibility:", error);
    }
  };

  const handleVoting = async (vote) => {
    if (!eligible) {
      alert("You are not eligible for voting.");
      return;
    }

    try {
      setIsVoting(true);
      const response = await fetch("/api/public-issue/vote", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId: issue2._id, vote }),
      });
      alert("Voted Successfully");
      setIsVoting(false);
    } catch {
      console.log("Failed to vote");
      setIsVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black p-6">
        <div className="bg-gray-900 shadow-lg border border-gray-700 rounded-lg p-6 w-full max-w-lg text-white animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
          <div className="h-48 bg-gray-800 rounded mb-6"></div>
          <div className="flex gap-4">
            <div className="h-10 w-24 bg-gray-700 rounded"></div>
            <div className="h-10 w-24 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!issue2)
    return <p className="text-center text-white">Issue not found.</p>;

  return (
      <ProtectedRoute>
    <div className=" min-h-screen bg-[#060611] md:p-6 p-3">
      <h1 className="text-3xl font-extrabold justify-self-center my-5 text-teal-400">Vote Issue</h1>
      <div className="bg-gray-900 shadow-lg border border-gray-700 rounded-lg p-6 w-full max-w-lg text-white justify-self-center">
        <h2 className="text-2xl font-bold text-teal-400">
          {issue2.issue_type}
        </h2>
        <p className="text-gray-300 mt-2">{issue2.description}</p>
        <h2 className="text-gray-300 mt-2">
          {issue2.placename}
        </h2>
        {issue2.image && (
          <img
            src={issue2.image}
            alt="Issue Image"
            className="mt-4 rounded-lg border border-gray-700"
          />
        )}

        {!isVoting ? (
          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={() => handleVoting(true)}
              className="px-4 py-2 bg-green-500 text-black font-semibold rounded-md hover:bg-green-400 transition shadow-lg"
            >
              ✅ Approve
            </button>
            <button
              onClick={() => handleVoting(false)}
              className="px-4 py-2 bg-red-500 text-black font-semibold rounded-md hover:bg-red-400 transition shadow-lg"
            >
              ❌ Deny
            </button>
          </div>
        ) : (
          <button className="mt-6 px-4 py-2 bg-gray-700 text-gray-300 font-semibold rounded-md cursor-not-allowed shadow-lg w-full">
            Voting in progress...
          </button>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default PeopleVote;
