"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";



export default function IssuesList() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();




  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await axios.get("/api/public-issue");

        console.log(response.data);
        setIssues(response.data.issues);
        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    };
    fetchIssue();
  }, []);



  return (
    <div className="md:p-6 p-3 min-h-screen bg-[#060611] text-white">
      <h1 className="md:text-3xl text-2xl text-teal-400 font-bold mb-6 text-center">Reported Issues</h1>
      <div className="grid gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gray-900 p-5 rounded-lg animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-600 rounded w-5/6"></div>
            </div>
          ))
        ) : issues.length > 0 ? (
          issues.map((item, index) => (
            <div
              key={index}
              className="bg-gray-900 md:p-5 p-3 rounded-lg shadow-lg border border-gray-700 transition transform hover:scale-105 hover:border-teal-400"
            >
              <h2 className="text-xl font-semibold text-teal-300">{item.issue_type}</h2>
              <p className="text-gray-300 mt-1 md:mt-2">{item.description}</p>
              <button
                onClick={() =>
                  router.push(`/gov-sec/issue-details?issue=${encodeURIComponent(JSON.stringify(item))}`)
                }
                className="mt-2 md:mt-4 bg-teal-500 text-black font-semibold px-4 py-2 rounded-md hover:bg-teal-400 transition"
              >
                🔍 View Details
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
