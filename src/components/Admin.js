import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import {getAuth, signOut} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [responses, setResponses] = useState([]);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout= async () =>{
    await signOut(auth);
    navigate('admin-login');
  }

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "responses"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setResponses(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchResponses();
  }, []);

  // Summary counts
  const attendingCount = responses.filter(
    (r) => r.attendance === "Yes, I’ll be there!"
  ).length;

  const notAttendingCount = responses.filter(
    (r) => r.attendance === "Sorry, I can’t make it"
  ).length;

  // Format Firestore timestamp to readable date/time
  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    const date =
      timestamp.seconds
        ? new Date(timestamp.seconds * 1000) // Firestore Timestamp object
        : new Date(timestamp); // plain JS Date object fallback
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF3F3] to-[#E9E4D4] p-8 text-gray-800">
      <button
        onClick={handleLogout}
        className="w-auto bg-red-500 text-white px-4 py-2 rounded"
      >Logout</button>
      <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/30">
        <h1 className="text-3xl font-bold text-center text-[#CB8587] mb-8">
          RSVP Dashboard
        </h1>

        {/* Summary Section */}
        <div className="flex justify-around mb-8 text-center">
          <div className="bg-green-100 text-green-700 px-6 py-3 rounded-xl shadow-md w-40">
            <p className="text-xl font-semibold">{attendingCount}</p>
            <p className="text-sm font-medium">Attending</p>
          </div>
          <div className="bg-red-100 text-red-700 px-6 py-3 rounded-xl shadow-md w-40">
            <p className="text-xl font-semibold">{notAttendingCount}</p>
            <p className="text-sm font-medium">Not Attending</p>
          </div>
        </div>

        {/* Responses List */}
        {responses.length === 0 ? (
          <p className="text-center text-gray-600 italic">
            No responses yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {responses.map((res, index) => (
              <li
                key={index}
                className={`p-4 rounded-lg shadow-sm border transition-transform duration-200 hover:scale-[1.02] ${
                  res.attendance === "Yes, I’ll be there!"
                    ? "bg-green-50 border-green-300 text-green-800"
                    : "bg-red-50 border-red-300 text-red-800"
                }`}
              >
                <div className="flex justify-between items-center">
                  <strong className="text-lg">
                    {res.firstName} {res.lastName}
                  </strong>
                  <span className="text-sm italic">{res.attendance}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Submitted: {formatDate(res.timestamp)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Admin;
