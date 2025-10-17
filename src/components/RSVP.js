import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const RSVP = () => {
  const [attendance, setAttendance] = useState("");
  const [message, setMessage] = useState("");
  const [guestData, setGuestData] = useState(null);
  const [rsvpLocked, setRsvpLocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  
  const firstName = localStorage.getItem("guestFirstName") || "";
const lastName = localStorage.getItem("guestLastName") || "";





  useEffect(() => {
    if (firstName && lastName) {
      fetchGuestData(firstName, lastName);
    } else {
      setMessage("Guest not recognized. Please use GuestGate.");
      setRsvpLocked(true);
    }
  }, [firstName, lastName]);



  const fetchGuestData = async (first, last) => {
    try {
      const q = query(
        collection(db, "guests"),
        where("firstName", "==", first),
        where("lastName", "==", last)
      );
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.empty);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setGuestData({ ...data, docId: querySnapshot.docs[0].id });

        if (data.attendance && data.attendance !== "Not yet RSVPed") {
          setAttendance(data.attendance);
          setRsvpLocked(true);

          // Only show reserved seats if they said "Yes, I’ll be there!"
          if (data.attendance === "Yes, I’ll be there!" && data.seats) {
            setMessage(`You’ve already submitted your RSVP: ${data.attendance}\nReserved seats: ${data.seats}`);
          } else {
            setMessage(`You’ve already submitted your RSVP: ${data.attendance}`);
          }
        }
      } else {
        setMessage("Guest not found in database.");
        setRsvpLocked(true);
      }
    } catch (error) {
      console.error("Error fetching guest data:", error);
      setMessage("An error occurred. Please try again later.");
      setRsvpLocked(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("guestAccess");
    localStorage.removeItem("guestName");
    navigate("/guest-gate");
  };

  return (
    <section className="relative py-12 bg-gradient-to-b from-[#CB8587] to-[#8E8B63] text-white text-center">
      <h2 className="text-3xl font-bold mb-6">RSVP</h2>
      {guestData && (
        <p className="mb-4">
          Hello, {guestData.firstName} {guestData.lastName}! Will you attend?
        </p>
      )}
      <div className="absolute top-6 left-6">
        <button
        onClick={() => setShowModal(true)}
        className="bg-red-500 text-white text-base px-4 py-2 rounded hover:bg-red-600 shadow-lg"
      >
        Exit
      </button>
      </div>
      

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white text-gray-800 rounded-lg p-6 w-80 text-center shadow-lg">
            <p className="mb-4 font-semibold">Are you sure you want to exit?</p>
            <div className="flex justify-around mt-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes, Exit
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {guestData && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!attendance) return setMessage("Please select attendance");
            try {
              await updateDoc(doc(db, "guests", guestData.docId), {
                attendance,
                timestamp: new Date(),
              });

              // Show reserved seats only if attendance is "Yes"
              if (attendance === "Yes, I’ll be there!" && guestData.seats) {
                setMessage(`Thank you, ${guestData.firstName}! RSVP confirmed: ${attendance}\nReserved seats: ${guestData.seats}`);
              } else {
                setMessage(`Thank you, ${guestData.firstName}! RSVP confirmed: ${attendance}`);
              }

              setRsvpLocked(true);
            } catch (err) {
              setMessage("Error submitting RSVP. Try again.");
            }
          }}
          className="flex flex-col items-center space-y-4 max-w-sm mx-auto"
        >
          <select
            className="w-full p-3 rounded-lg text-[#8E8B63] focus:outline-none"
            value={attendance}
            onChange={(e) => setAttendance(e.target.value)}
            disabled={rsvpLocked}
            required
          >
            <option value="">Select your response</option>
            <option value="Yes, I’ll be there!">Yes, I’ll be there!</option>
            <option value="Sorry, I can’t make it">Sorry, I can’t make it</option>
          </select>

          <button
            type="submit"
            className="bg-[#EDDADA] text-[#CB8587] px-6 py-2 rounded-full font-semibold hover:scale-105 duration-200 shadow-md disabled:opacity-50"
            disabled={rsvpLocked}
          >
            Submit
          </button>
        </form>
      )}

      {message && (
        <p className="mt-4 text-sm bg-white/20 p-2 rounded-lg whitespace-pre-line inline-block">
          {message}
        </p>
      )}
    </section>
  );
};

export default RSVP;
