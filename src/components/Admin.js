import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [responses, setResponses] = useState([]);
  const [newGuest, setNewGuest] = useState({ firstName: "", lastName: "", seats: 1 });
  const [editingGuest, setEditingGuest] = useState(null); 
  const [showEditModal, setShowEditModal] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin-login");
  };

  const fetchResponses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "guests"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setResponses(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    const first = newGuest.firstName.trim();
    const last = newGuest.lastName.trim();
    const seats = Number(newGuest.seats);

    if (!first || !last || seats < 1) return;

    try {
      const q = collection(db, "guests");
      const querySnapshot = await getDocs(q);
      const duplicate = querySnapshot.docs.find(
        (doc) => doc.data().firstName === first && doc.data().lastName === last
      );
      if (duplicate) {
        alert("This guest is already added.");
        return;
      }

      await addDoc(collection(db, "guests"), {
  firstName: first,
  lastName: last,
  seats,
  attendance: "Not yet RSVPed",
  timestamp: null,
});


      setNewGuest({ firstName: "", lastName: "", seats: 1 });
      fetchResponses();
    } catch (error) {
      console.error("Error adding guest:", error);
    }
  };

  const openEditModal = (guest) => {
    setEditingGuest({ ...guest });
    setShowEditModal(true);
  };

  const handleEditGuest = async (e) => {
    e.preventDefault();
    const { id, firstName, lastName, seats } = editingGuest;

    if (!firstName.trim() || !lastName.trim() || seats < 1) return;

    try {
      await setDoc(doc(db, "guests", id), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        seats,
        attendance: editingGuest.attendance || "Not yet RSVPed",
        timestamp: editingGuest.timestamp || null,
      });
      setShowEditModal(false);
      fetchResponses();
    } catch (error) {
      console.error("Error editing guest:", error);
    }
  };

  const handleDeleteGuest = async () => {
    if (!editingGuest) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete ${editingGuest.firstName} ${editingGuest.lastName}?`
    );
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "guests", editingGuest.id));
      setShowEditModal(false);
      fetchResponses();
    } catch (error) {
      console.error("Error deleting guest:", error);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  // Summary counts
  const totalGuests = responses.length;
  const attendingCount = responses.filter(r => r.attendance === "Yes, I’ll be there!").length;
  const notAttendingCount = responses.filter(r => r.attendance === "Sorry, I can’t make it").length;
  const noAnswerCount = responses.filter(r => r.attendance === "Not yet RSVPed").length;
  const totalSeatsReserved = responses
    .filter(r => r.attendance === "Yes, I’ll be there!")
    .reduce((sum, r) => sum + Number(r.seats), 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF3F3] to-[#E9E4D4] p-6 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#CB8587]">RSVP Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Add Guest Form */}
      <form
        onSubmit={handleAddGuest}
        className="bg-white/70 p-4 rounded-lg shadow-md mb-6 flex gap-3 items-center flex-wrap"
      >
        <input
          type="text"
          placeholder="First Name"
          value={newGuest.firstName}
          onChange={(e) => setNewGuest({ ...newGuest, firstName: e.target.value })}
          className="flex-1 p-2 rounded border border-gray-300"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newGuest.lastName}
          onChange={(e) => setNewGuest({ ...newGuest, lastName: e.target.value })}
          className="flex-1 p-2 rounded border border-gray-300"
        />
        <input
          type="number"
          min="1"
          placeholder="Reserved Seats"
          value={newGuest.seats}
          onChange={(e) => setNewGuest({ ...newGuest, seats: e.target.value })}
          className="w-24 p-2 rounded border border-gray-300"
        />
        <button
          type="submit"
          className="bg-[#CB8587] text-white px-4 py-2 rounded hover:bg-[#b46c6e]"
        >
          Add
        </button>
      </form>

      {/* Summary Section */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
  <div className="bg-blue-200 text-blue-800 rounded-lg shadow-md p-3 flex flex-col items-center justify-center h-20">
    <div className="text-xl font-bold">{totalGuests}</div>
    <div>Total Guests</div>
  </div>
  <div className="bg-green-200 text-green-800 rounded-lg shadow-md p-3 flex flex-col items-center justify-center h-20">
    <div className="text-xl font-bold">{attendingCount}</div>
    <div>Attending</div>
  </div>
  <div className="bg-red-200 text-red-800 rounded-lg shadow-md p-3 flex flex-col items-center justify-center h-20">
    <div className="text-xl font-bold">{notAttendingCount}</div>
    <div>Not Attending</div>
  </div>
  <div className="bg-yellow-200 text-yellow-800 rounded-lg shadow-md p-3 flex flex-col items-center justify-center h-20">
    <div className="text-xl font-bold">{noAnswerCount}</div>
    <div>No Answer Yet</div>
  </div>
  <div className="bg-gray-300 text-gray-600 rounded-lg shadow-md p-3 flex flex-col items-center justify-center h-20">
    <div className="text-xl font-bold">{totalSeatsReserved}</div>
    <div>Total Seats Reserved</div>
  </div>
</div>

      {/* Guests List */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/30">
        {responses.length === 0 ? (
          <p className="text-center text-gray-600 italic">No guests added yet.</p>
        ) : (
          <ul className="space-y-3">
            {responses.map((res) => (
              <li
                key={res.id}
                className={`p-4 rounded-lg border flex justify-between items-center flex-wrap ${
                  res.attendance === "Not yet RSVPed"
                    ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                    : res.attendance === "Yes, I’ll be there!"
                    ? "bg-green-50 border-green-300 text-green-800"
                    : "bg-red-50 border-red-300 text-red-800"
                }`}
              >
                <div>
                  <strong>{res.firstName} {res.lastName}</strong> - Seats: {res.seats}
                </div>
                <button
                  onClick={() => openEditModal(res)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  &#x22EE;
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingGuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form
            onSubmit={handleEditGuest}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col gap-3 w-80"
          >
            <h2 className="text-xl font-bold mb-2">Edit Guest</h2>
            <input
              type="text"
              value={editingGuest.firstName}
              onChange={(e) =>
                setEditingGuest({ ...editingGuest, firstName: e.target.value })
              }
              className="p-2 rounded border border-gray-300"
              placeholder="First Name"
            />
            <input
              type="text"
              value={editingGuest.lastName}
              onChange={(e) =>
                setEditingGuest({ ...editingGuest, lastName: e.target.value })
              }
              className="p-2 rounded border border-gray-300"
              placeholder="Last Name"
            />
            <input
              type="number"
              min="1"
              value={editingGuest.seats}
              onChange={(e) =>
                setEditingGuest({ ...editingGuest, seats: e.target.value })
              }
              className="p-2 rounded border border-gray-300"
              placeholder="Reserved Seats"
            />
            <div className="flex justify-between gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteGuest}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#CB8587] text-white hover:bg-[#b46c6e]"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
