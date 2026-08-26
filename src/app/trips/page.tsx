"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const response = await fetch("/api/trips");

      console.log("Response Status:", response.status);

      const data = await response.json();

      console.log("Trips:", data);

      setTrips(data);
    } catch (error) {
      console.error("Error loading trips:", error);
    } finally {
      setLoading(false);
    }
  }
  

  const filteredTrips = trips.filter((trip) => {
  const searchText = search.toLowerCase();

  const matchesSearch =
    trip.tripNumber?.toLowerCase().includes(searchText) ||
    trip.charterParty?.companyName?.toLowerCase().includes(searchText) ||
    trip.destination?.toLowerCase().includes(searchText);

  const matchesStatus =
    statusFilter === "All" ||
    trip.status === statusFilter;

  const tripDate = new Date(trip.tripDate);
  const today = new Date();

  // Normalize today's date
  today.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

 
const matchesDate =
  dateFilter === "All" ||
  (dateFilter === "Today" &&
    tripDate.toDateString() === today.toDateString()) ||
  (dateFilter === "Week" &&
    tripDate >= today &&
    tripDate <= endOfWeek) ||
  (dateFilter === "Month" &&
    tripDate.getMonth() === today.getMonth() &&
    tripDate.getFullYear() === today.getFullYear());

  return matchesSearch && matchesStatus && matchesDate;
});
  return (
    <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-gray-500">Total Trips</h3>

    <p className="text-4xl font-bold text-blue-700">
      {trips.length}
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-gray-500">Scheduled</h3>

    <p className="text-4xl font-bold text-green-600">
      {
        trips.filter(
          trip => trip.status === "Scheduled"
        ).length
      }
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-gray-500">
      Need Assignment
    </h3>

    <p className="text-4xl font-bold text-red-600">
      {
        trips.filter(
          trip =>
            !trip.assignments ||
            trip.assignments.length === 0
        ).length
      }
    </p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-gray-500">
      Completed
    </h3>

    <p className="text-4xl font-bold text-purple-600">
      {
        trips.filter(
          trip => trip.status === "Completed"
        ).length
      }
    </p>
  </div>

</div>
<div className="bg-white rounded-xl shadow p-4 mb-6">

  <div className="flex flex-col md:flex-row gap-4">

    <input
      type="text"
      placeholder="Search Trip Number, Charter Party or Destination..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
    />
<select
  value={dateFilter}
  onChange={(e) => setDateFilter(e.target.value)}
  className="border rounded-lg px-4 py-3 md:w-56"
>
  <option value="All">All Upcoming</option>
  <option value="Today">Today</option>
  <option value="Week">This Week</option>
  <option value="Month">This Month</option>
</select>
    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border rounded-lg px-4 py-3 md:w-56"
    >
      <option value="All">All Statuses</option>
      <option value="Draft">Draft</option>
      <option value="Scheduled">Scheduled</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
    </select>

  </div>

</div>

    <div className="flex justify-between items-center mb-8"></div>

      <div className="flex justify-between items-center mb-8">

  <div className="flex items-center gap-3">
    <Link
      href="/dashboard"
      className="bg-white hover:bg-gray-200 text-blue-900 px-4 py-2 rounded-lg shadow font-semibold"
    >
      🏠 Dashboard
    </Link>

    <h1 className="text-3xl font-bold text-blue-900">
      Trips
    </h1>
  </div>

  <Link
    href="/new-trip"
    className="bg-blue-900 text-white px-5 py-3 rounded-lg hover:bg-blue-800"
  >
    + New Trip
  </Link>

</div>

      {loading ? (

        <p>Loading trips...</p>

      ) : trips.length === 0 ? (

        <div className="bg-white rounded-xl shadow p-8">
          <p>No trips have been created yet.</p>
        </div>

      ) : (

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-gray-100">

              <tr>

               <th className="text-left p-4">Trip #</th>
<th className="text-left p-4">Date</th>
<th className="text-left p-4">Charter Party</th>
<th className="text-left p-4">Driver</th>
<th className="text-left p-4">Bus</th>
<th className="text-left p-4">Destination</th>
<th className="text-left p-4">Status</th>
<th className="text-left p-4">Actions</th>
              </tr>

            </thead>

            <tbody>

              {filteredTrips.map((trip) => (

                <tr
                  key={trip.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="text-blue-700 hover:underline font-semibold"
                    >
                      {trip.tripNumber}
                    </Link>
                  </td>

                  <td className="p-4">
                    {new Date(trip.tripDate).toISOString().split("T")[0]}
                  </td>

                  <td className="p-4">
  {trip.charterParty?.companyName}
</td>

<td className="p-4">
  {trip.assignments?.[0]?.driver
    ? `${trip.assignments[0].driver.firstName} ${trip.assignments[0].driver.lastName}`
    : "Awaiting Assignment"}
    </td>

<td className="p-4">
  {trip.assignments?.[0]?.bus?.busNumber ?? "_"}
</td>

<td className="p-4">
  {trip.destination}
</td>

<td className="p-4">

  <span
    className={`px-3 py-1 rounded-full text-sm font-semibold
      ${
        trip.status === "Scheduled"
          ? "bg-green-100 text-green-700"

        : trip.status === "Draft"
          ? "bg-yellow-100 text-yellow-700"

        : trip.status === "Completed"
          ? "bg-blue-100 text-blue-700"

        : trip.status === "Cancelled"
          ? "bg-red-100 text-red-700"

        : "bg-gray-100 text-gray-700"
      }
    `}
  >
    {trip.status}
  </span>

</td>
<td className="p-4">
  {trip.assignments?.length ? (
  <Link
    href={`/assign-trip/${trip.id}`}
    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 inline-block"
  >
    Reassign
  </Link>
) : (
  <Link
    href={`/assign-trip/${trip.id}`}
    className="bg-blue-900 text-white px-3 py-1 rounded hover:bg-blue-800 inline-block"
  >
    Assign
  </Link>
)}
</td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </main>
  );
}