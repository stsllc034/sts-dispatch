import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import DriverTripForm from "./DriverTripForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DriverTripPage({ params }: Props) {
  const { id } = await params;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sts_driver_session")?.value;

  if (!sessionToken) {
    redirect("/driver-login");
  }

  const driver = await prisma.driver.findFirst({
    where: {
      sessionToken,
      sessionExpiresAt: {
        gt: new Date(),
      },
      active: true,
    },
  });

  if (!driver) {
    redirect("/driver-login");
  }

  const trip = await prisma.trip.findFirst({
    where: {
      id: Number(id),
      assignments: {
        some: {
          driverId: driver.id,
        },
      },
    },
    include: {
      charterParty: true,
      assignments: {
        where: {
          driverId: driver.id,
        },
        include: {
          driver: true,
          bus: true,
        },
      },
    },
  });

  if (!trip) {
    notFound();
  }

  const assignment = trip.assignments[0];

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">
            Driver Trip
          </h1>

          <p className="text-gray-600 mt-1">
            Trip #{trip.tripNumber}
          </p>
        </div>

        <Link
          href="/driver"
          className="bg-gray-300 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-400"
        >
          Back to Portal
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">Trip Date</p>
            <p className="text-lg font-semibold">
              {new Date(trip.tripDate).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="text-lg font-semibold">
              {trip.status}
            </p>
          </div>
<div>
  <p className="text-sm text-gray-500">Scheduled On-Duty Time</p>
  <p className="text-lg font-semibold">
    {trip.scheduledOnDutyTime || "Not scheduled"}
  </p>
</div>
          <div>
            <p className="text-sm text-gray-500">Charter Party</p>
            <p className="text-lg font-semibold">
              {trip.charterParty?.companyName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Driver</p>
            <p className="text-lg font-semibold">
              {assignment?.driver?.firstName}{" "}
              {assignment?.driver?.lastName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Bus</p>
            <p className="text-lg font-semibold">
              {assignment?.bus?.busNumber}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Passenger Count</p>
            <p className="text-lg font-semibold">
              {trip.passengerCount ?? "Not specified"}
            </p>
          </div>

        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            Trip Details
          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-sm text-gray-500">
                Pickup Location
              </p>
              <p className="text-lg">
                {trip.pickupLocation}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Destination
              </p>
              <p className="text-lg">
                {trip.destination}
              </p>
            </div>

            <div>
  <p className="text-sm text-gray-500">
    Charter Party Contact
  </p>

  <p className="text-lg">
    {trip.contactName || "Not specified"}
  </p>

  <p className="text-lg">
    {trip.contactPhone || "Not specified"}
  </p>

  {trip.contactEmail && (
    <p className="text-lg">
      {trip.contactEmail}
    </p>
  )}
</div>

{trip.tripDetails && (
  <div>
    <p className="text-sm text-gray-500">
      Trip Details
    </p>

    <p className="text-lg whitespace-pre-wrap">
      {trip.tripDetails}
    </p>
  </div>
)}

          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <p className="text-sm text-gray-500">
                Arrival Time
              </p>
              <p className="text-lg">
                {trip.arrivalTime || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Departure Time
              </p>
              <p className="text-lg">
                {trip.departureTime || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Event Time
              </p>
              <p className="text-lg">
                {trip.eventTime || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Return Time
              </p>
              <p className="text-lg">
                {trip.returnToSchoolTime || "Not specified"}
              </p>
            </div>

          </div>
        </div>

        <DriverTripForm
  tripId={trip.id}
  assignmentId={assignment.id}
/>
      </div>
    </main>
  );
}