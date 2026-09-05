"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";

interface Trip {
  id: number;
  tripNumber: string;
  tripDate: string;
  pickupLocation: string;
  destination: string;
  status: string;
  passengerCount: number | null;
  charterParty?: {
    companyName: string;
  };
  assignments?: {
    driver?: {
      firstName: string;
      lastName: string;
    };
    bus?: {
      busNumber: string;
    };
  }[];
}

export default function CompletedTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCompletedTrips();
  }, []);

  async function loadCompletedTrips() {
    try {
      const response = await fetch("/api/trips");
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to load trips.");
      }

      const completed = Array.isArray(data)
        ? data.filter((trip: Trip) => trip.status === "Completed")
        : [];

      setTrips(completed);
    } catch (error) {
      console.error("Error loading completed trips:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTrips = trips.filter((trip) => {
  const searchText = search.trim().toLowerCase();

  return trip.tripNumber?.toLowerCase().includes(searchText);
});

  return (
    <AppLayout title="Completed Trips">
      <div className="max-w-7xl mx-auto p-6">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900">
            Completed Trips
          </h1>

          <p className="text-gray-600 mt-1">
            Access completed trip records for invoicing and documentation.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <div className="text-sm text-gray-500">
                Completed Trips
              </div>

              <div className="text-3xl font-bold text-blue-900">
                {trips.length}
              </div>
            </div>

            <input
              type="text"
              placeholder="Search by Trip ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 border rounded-lg px-4 py-3"
            />

          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-8 text-gray-600">
            Loading completed trips...
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              No Completed Trips Found
            </h2>

            <p className="text-gray-500">
              Completed trips will appear here once a trip has been completed.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Trip ID</th>
                    <th className="text-left p-4">Charter Party</th>
                    <th className="text-left p-4">Destination</th>
                    <th className="text-left p-4">Driver</th>
                    <th className="text-left p-4">Bus</th>
                    <th className="text-left p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTrips.map((trip) => (
                    <tr
                      key={trip.id}
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="p-4">
                        {new Date(
                          trip.tripDate
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-4 font-semibold text-blue-700">
                        {trip.tripNumber}
                      </td>

                      <td className="p-4">
                        {trip.charterParty?.companyName ?? "-"}
                      </td>

                      <td className="p-4">
                        {trip.destination ?? "-"}
                      </td>

                      <td className="p-4">
                        {trip.assignments?.[0]?.driver
                          ? `${trip.assignments[0].driver.firstName} ${trip.assignments[0].driver.lastName}`
                          : "Unassigned"}
                      </td>

                      <td className="p-4">
                        {trip.assignments?.[0]?.bus?.busNumber
                          ? `Bus ${trip.assignments[0].bus.busNumber}`
                          : "Unassigned"}
                      </td>

                      <td className="p-4">
  <div className="flex gap-2">
    <Link
      href={`/completed-trips/${trip.id}`}
      className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg inline-block"
    >
      View Trip
    </Link>

    <Link
  href={`/completed-trips/${trip.id}/edit`}
  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg inline-block"
>
  Edit
</Link>
  </div>
</td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>
        )}

      </div>
    </AppLayout>
  );
}