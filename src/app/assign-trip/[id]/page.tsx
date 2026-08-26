"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AssignTripPage() {
  const { id } = useParams();
  const router = useRouter();

  const [trip, setTrip] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);

  const [driverId, setDriverId] = useState("");
  const [busId, setBusId] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
  const [tripRes, driverRes, busRes] = await Promise.all([
    fetch(`/api/trips/${id}`),
    fetch("/api/drivers"),
    fetch("/api/fleet"),
  ]);

  const tripData = await tripRes.json();
  const driverData = await driverRes.json();
  const busData = await busRes.json();

  setTrip(tripData);
  setDrivers(driverData);
  setBuses(busData);

  // Load the existing assignment, if one exists
    if (tripData.assignments?.length > 0) {
    const assignment = tripData.assignments[0];

    setDriverId(String(assignment.driverId));
    setBusId(String(assignment.busId));
  }
}

async function saveAssignment() {
  if (!driverId || !busId) {
    alert("Please select both a driver and a bus.");
    return;
  }

  try {
    const response = await fetch("/api/assign-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tripId: id,
        driverId,
        busId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save assignment.");
    }

    alert("Assignment saved successfully.");

    router.push("/trips");
  } catch (error) {
    console.error(error);
    alert("Failed to save assignment.");
  }
}
  return (
    <main className="max-w-4xl mx-auto p-8">

      <h1 className="text-3xl font-bold text-blue-900 mb-8">
        Assign Driver & Bus
      </h1>

      {!trip ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow p-8 space-y-6">

          <div>
            <h2 className="text-xl font-bold">
              Trip #{trip.tripNumber}
            </h2>

            <p>{trip.charterParty?.companyName}</p>

            <p>{trip.destination}</p>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Driver
            </label>

            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Driver</option>

              {drivers.map((driver: any) => (
                <option
                  key={driver.id}
                  value={driver.id}
                >
                  {driver.firstName} {driver.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Bus
            </label>

            <select
              value={busId}
              onChange={(e) => setBusId(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Select Bus</option>

              {buses.map((bus: any) => (
                <option
                  key={bus.id}
                  value={bus.id}
                >
                  {bus.busNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">

           <button
  onClick={saveAssignment}
  className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
>
  Save Assignment
</button>

            <button
              onClick={() => router.push("/trips")}
              className="bg-gray-300 px-6 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </main>
  );
}