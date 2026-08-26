"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    driverId: number;
    bus?: {
      busNumber: string;
    };
    driver?: {
      firstName: string;
      lastName: string;
    };
  }[];
}

export default function DriverPortalPage() {
 const router = useRouter();

async function handleLogout() {
  await fetch("/api/driver-logout", {
    method: "POST",
  });

  router.push("/driver-login");
  router.refresh();
} 
  const [trips, setTrips] = useState<Trip[]>([]);
const [driverName, setDriverName] = useState("");
const [loading, setLoading] = useState(true);
  useEffect(() => {
  loadDriver();
  loadTrips();
}, []);
async function loadDriver() {
  try {
    const response = await fetch("/api/driver/me");
    const data = await response.json();

    if (!response.ok) {
      router.push("/driver-login");
      router.refresh();
      return;
    }

    setDriverName(`${data.firstName} ${data.lastName}`);
  } catch (error) {
    console.error("Error loading driver:", error);
  }
}

  async function loadTrips() {
    try {
      const response = await fetch("/api/driver/trips");
const data = await response.json();

if (!response.ok) {
  router.push("/driver-login");
  router.refresh();
  return;
}

setTrips(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading driver trips:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout title="">
      <div className="max-w-6xl mx-auto p-6">

        <div className="mb-6 flex items-start justify-between gap-4">
  <div>
    <h1 className="text-3xl font-bold text-blue-900">
  {driverName ? `${driverName} Driver Portal` : "Driver Portal"}
</h1>

    <p className="text-gray-600 mt-1">
      View your assigned trips and complete your trip information.
    </p>
  </div>

  <button
    type="button"
    onClick={handleLogout}
    className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg"
  >
    Logout
  </button>
</div>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-6">
            Loading trips...
          </div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">
              No Trips Assigned
            </h2>

            <p className="text-gray-500">
              You currently have no trips assigned to you.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-xl shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div>
                    <div className="text-blue-800 font-bold text-lg">
                      Trip {trip.tripNumber}
                    </div>

                    <div className="text-gray-600">
                      {new Date(trip.tripDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold">
                      {trip.status}
                    </span>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                  <div>
                    <div className="text-sm text-gray-500">
                      Charter Party
                    </div>

                    <div className="font-semibold">
                      {trip.charterParty?.companyName ?? "-"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">
                      Bus
                    </div>

                    <div className="font-semibold">
                      {trip.assignments?.[0]?.bus?.busNumber
                        ? `Bus ${trip.assignments[0].bus.busNumber}`
                        : "Not Assigned"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">
                      Pickup
                    </div>

                    <div className="font-semibold">
                      {trip.pickupLocation}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">
                      Destination
                    </div>

                    <div className="font-semibold">
                      {trip.destination}
                    </div>
                  </div>

                </div>

                <div className="mt-5">
                  <Link
  href={`/driver/trips/${trip.id}`}
  className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold inline-block"
>
  Open Trip
</Link>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </AppLayout>
  );
}