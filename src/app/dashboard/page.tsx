"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Calendar, Users, Bus } from "lucide-react";
import AppLayout from "@/components/AppLayout";

export default function Dashboard() {
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const response = await fetch("/api/trips");
      const data = await response.json();
      setTrips(data);
    } catch (error) {
      console.error(error);
    }
  }

  const today = new Date().toISOString().split("T")[0];
const draftTrips = trips.filter((trip) => trip.status === "Draft").length;
const scheduledTrips = trips.filter((trip) => trip.status === "Scheduled").length;
const inProgressTrips = trips.filter((trip) => trip.status === "In Progress").length;
const completedTrips = trips.filter((trip) => trip.status === "Completed").length;
  const todaysTrips = trips.filter((trip) => {
    const tripDate = new Date(trip.tripDate)
      .toISOString()
      .split("T")[0];

    return tripDate === today;
  });

  return (
    <AppLayout title="Administrator Dashboard">

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

   <div className="bg-white rounded-xl shadow p-6">
  <h3 className="text-gray-500">Today's Trips</h3>
  <p className="text-4xl font-bold text-blue-700">
    {todaysTrips.length}
  </p>
</div>

<div className="bg-white rounded-xl shadow p-6">
  <h3 className="text-gray-500">Draft</h3>
  <p className="text-4xl font-bold text-gray-600">
    {draftTrips}
  </p>
</div>

<div className="bg-white rounded-xl shadow p-6">
  <h3 className="text-gray-500">Scheduled</h3>
  <p className="text-4xl font-bold text-blue-600">
    {scheduledTrips}
  </p>
</div>

<div className="bg-white rounded-xl shadow p-6">
  <h3 className="text-gray-500">In Progress</h3>
  <p className="text-4xl font-bold text-orange-500">
    {inProgressTrips}
  </p>
</div>

<div className="bg-white rounded-xl shadow p-6">
  <h3 className="text-gray-500">Completed</h3>
  <p className="text-4xl font-bold text-green-600">
    {completedTrips}
  </p>
</div>

<div className="bg-white rounded-xl shadow p-6">
  <h3 className="text-gray-500">Awaiting Dispatch</h3>
  <p className="text-4xl font-bold text-red-600">
    {
      trips.filter(
        (trip) =>
          !trip.assignments ||
          trip.assignments.length === 0
      ).length
    }
  </p>
</div>     
        </div>

<Link
  href="/admin-calendar"
  className="mb-6 flex items-center gap-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow p-4 font-semibold"
>
  <Calendar size={24} />
  Administrator Calendar
</Link>

      <div className="bg-white rounded-xl shadow p-8">

        <h2 className="text-2xl font-bold mb-6">
          Today's Schedule
        </h2>

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-gray-100 border-b">

              <th className="text-left p-3">
                Trip ID
              </th>

              <th className="text-left p-3">
                Charter Party
              </th>

              <th className="text-left p-3">
                Destination
              </th>

              <th className="text-left p-3">
                Driver
              </th>

              <th className="text-left p-3">
                Bus
              </th>

              <th className="text-left p-3">
                Status
              </th>

            </tr>

          </thead>

          <tbody>
  {todaysTrips.length === 0 ? (
    <tr>
      <td
        colSpan={6}
        className="text-center py-8 text-gray-500"
      >
        No trips scheduled today.
      </td>
    </tr>
  ) : (
    todaysTrips.map((trip) => (
      <tr
        key={trip.id}
        className="border-b hover:bg-gray-50"
      >
        <td className="p-3">{trip.tripNumber}</td>

        <td className="p-3">
          {trip.charterParty?.companyName}
        </td>

        <td className="p-3">
          {trip.destination}
        </td>

        <td className="p-3">
          {trip.assignments?.[0]?.driver
            ? `${trip.assignments[0].driver.firstName} ${trip.assignments[0].driver.lastName}`
            : "Unassigned"}
        </td>

        <td className="p-3">
          {trip.assignments?.[0]?.bus
            ? trip.assignments[0].bus.busNumber
            : "Unassigned"}
        </td>

        <td className="p-3">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
            {trip.status}
          </span>
        </td>
      </tr>
    ))
  )}
</tbody>
        </table>

      </div>

    </AppLayout>
  );
}