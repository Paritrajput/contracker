"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const PeopleIssue = () => {
  const [issueName, setIssueName] = useState("");
  const [description, setDescription] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [position, setPosition] = useState({ lat: 20, lng: 78 });
  const [placeName, setPlaceName] = useState("");
  const [issueImg, setIssueImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [publicId, setPublicId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [dateOfComplaint, setDateOfComplaint] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("public-token");
      if (token) {
        axios
          .get("/api/public-sec/profile", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => setPublicId(res.data._id))
          .catch(() => localStorage.removeItem("public-token"));
      }
    }
  }, []);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        fetchPlaceName(lat, lng);
      },
    });
    return <Marker position={position} />;
  }

  async function fetchPlaceName(lat, lng) {
       try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      setPlaceName(data.display_name || "Unknown Location");
    } catch (error) {
      console.error("Error fetching place name:", error);
    }
  }

  async function handleSearchLocation() {
    if (!searchLocation) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setPlaceName(data[0].display_name);
      } else {
        alert("Location not found");
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  }

  function ChangeMapView() {
    const map = useMap();
    map.setView([position.lat, position.lng], 13);
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issueName || !description || !placeName) {
      return alert("All fields are required!");
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userId", publicId);
      formData.append("issue_type", issueName);
      formData.append("description", description);
      formData.append("approval", 0);
      formData.append("denial", 0);
      formData.append("location", JSON.stringify(position)); // Fixed this line
      formData.append("placename", placeName);
      formData.append("status", "Pending");
      formData.append("date_of_complaint", dateOfComplaint);
      if (issueImg) formData.append("image", issueImg);

      await axios.post("/api/public-issue", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Issue submitted successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchLocation(query);
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await res.json();
      setSuggestions(data.map((place) => place.display_name));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-900 text-white shadow-lg rounded-lg my-5">
      <h1 className="text-2xl font-bold mb-4">Raise a Public Issue</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Issue Name *" value={issueName} onChange={(e) => setIssueName(e.target.value)} className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-white" required />
        <textarea placeholder="Description *" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-white" required></textarea>
        <div className="flex gap-2 relative">
          <input type="text" placeholder="Search Location *" value={searchLocation} onChange={handleSearchChange} className="w-full p-2 border rounded bg-gray-800 border-gray-700 text-white" />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-gray-800 text-white border border-gray-700 rounded mt-12 w-full max-h-96 overflow-auto">
              {suggestions.map((s, i) => (
                <li key={i} className="p-2 hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setSearchLocation(s);
                    setSuggestions([]);
                    handleSearchLocation();
                  }}>
                  {s}
                </li>
              ))}
            </ul>
          )}
          <button type="button" onClick={handleSearchLocation} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-500">Search</button>
        </div>
        <div className="w-full h-96 mt-2">
          <MapContainer center={[position.lat, position.lng]} zoom={5} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationMarker />
            <ChangeMapView />
          </MapContainer>
        </div>
        <div className="mt-2 p-2 bg-gray-800 rounded-lg">
          <p><strong>Selected Location:</strong> {placeName}</p>
          <p><strong>Coordinates:</strong> {position.lat}, {position.lng}</p>
        </div>
        <input type="file" accept="image/*" onChange={(e) => setIssueImg(e.target.files[0])} className="p-2 border rounded bg-gray-800 border-gray-700 text-white" />
        <button type="submit" className={`w-full px-4 py-2 rounded-lg transition font-semibold ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"} text-white`} disabled={loading}>{loading ? "Submitting..." : "Submit Issue"}</button>
      </form>
    </div>
  );
};

export default PeopleIssue;
