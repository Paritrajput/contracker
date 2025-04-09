"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page1() {
  const [issues2, setIssues2] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [all, setAll] = useState(true);
  const router = useRouter();

  // Get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => console.error("Failed to get location"),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Fetch all issues
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get("/api/public-issue");
        setIssues2(response.data.issues);
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // Calculate distance (in km)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter issues within 5km
  useEffect(() => {
    if (userLocation && issues2.length > 0) {
      const nearby = issues2.filter((contract) => {
        const lat = contract.location?.lat;
        const lng = contract.location?.lng;
        if (lat && lng) {
          const distance = getDistance(
            userLocation.lat,
            userLocation.lng,
            lat,
            lng
          );
          return distance <= 10;
        }
        return false;
      });
      setFilteredIssues(nearby);
    }
  }, [userLocation, issues2]);

  return (
    <div className="md:p-6 p-3 min-h-screen bg-[#060611] text-white overflow-y-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="md:text-3xl text-2xl  font-bold text-teal-400 mb-4 sm:mb-0">
          Reported Issues
        </h1>
        <select
          value={all ? "all" : "nearby"}
          onChange={(e) => setAll(e.target.value === "all")}
          className="bg-gray-800 text-white border border-gray-600 rounded px-4 py-2"
        >
          <option value="all">All Issues</option>
          <option value="nearby">Nearby Issues</option>
        </select>
      </div>

      <div className="grid gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-900 p-5 rounded-lg shadow-lg border border-gray-700 animate-pulse"
            >
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
              <div className="h-10 bg-gray-700 rounded mt-4"></div>
            </div>
          ))
        ) : (all ? issues2 : filteredIssues)?.length > 0 ? (
          (all ? issues2 : filteredIssues).map((issue) => (
            <div
              key={issue._id}
              className="bg-gray-900 p-5 rounded-lg shadow-lg border border-gray-700"
            >
              <h2 className="text-xl font-semibold text-teal-400">
                {issue.issue_type}
              </h2>
              <p className="text-gray-300 max-md:hidden">{issue.description}</p>
              <p className="text-gray-300">
                <strong className="text-teal-400">Location:</strong>{" "}
                {issue.placename}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-0">
                <p className="max-md:hidden">
                  <strong className="text-teal-400">Votes:</strong> Approvals:{" "}
                  {issue.approval}, Denials: {issue.denial}
                </p>
                <p>
                  <strong className="text-teal-400">Date:</strong>{" "}
                  {issue.date_of_complaint}
                </p>
              </div>

              <button
                onClick={() =>
                  router.push(`/public-sec/people-voting/${issue._id}`)
                }
                className="mt-3 px-4 py-2 bg-teal-500 text-black font-medium rounded-lg hover:bg-teal-400 transition"
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No issues found.</p>
        )}
      </div>
    </div>
  );
}
