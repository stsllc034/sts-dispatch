"use client";

import { useState } from "react";

export default function TripForm() {
  const [tripDate, setTripDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [passengerCount, setPassengerCount] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    alert(
      "Trip form connected successfully!\n\nThe save function will be added next."
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-lg p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-blue-900">
        New Trip
      </h2>

      <div>
        <label className="block font-semibold mb-1">
          Trip Date
        </label>

        <input
          type="date"
          value={tripDate}
          onChange={(e) => setTripDate(e.target.value)}
          className="border rounded w-full p-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">
          Pickup Location
        </label>

        <input
          type="text"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          className="border rounded w-full p-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">
          Destination
        </label>

        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border rounded w-full p-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">
          Passenger Count
        </label>

        <input
          type="number"
          value={passengerCount}
          onChange={(e) => setPassengerCount(e.target.value)}
          className="border rounded w-full p-2"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">
          Notes
        </label>

        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border rounded w-full p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg"
      >
        Save Trip
      </button>
    </form>
  );
}