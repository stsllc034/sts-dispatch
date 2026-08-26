import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import EmailConfirmationButton from "./EmailConfirmationButton";
import DispatchReviewForm from "./DispatchReviewForm";
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TripDetailsPage({ params }: Props) {
  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      charterParty: true,
      assignments: {
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
    <main className="max-w-5xl mx-auto p-8">

      <div className="flex justify-between items-center mb-8">

  <h1 className="text-3xl font-bold text-blue-900">
    Trip {trip.tripNumber}
  </h1>

  <Link
    href={`/trips/${trip.id}/edit`}
    className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-3 rounded-lg"
  >
    Edit Trip
  </Link>

<EmailConfirmationButton tripId={trip.id} />

</div>

      <div className="bg-white rounded-xl shadow p-8 space-y-4">

        <div>
          <strong>Trip Date:</strong>{" "}
          {new Date(trip.tripDate).toLocaleDateString()}
        </div>

        <div>
          <strong>Charter Party:</strong>{" "}
          {trip.charterParty.companyName}
        </div>

        <div>
          <strong>Destination:</strong>{" "}
          {trip.destination}
        </div>

        <div>
          <strong>Status:</strong>{" "}
          {trip.status}
        </div>

<div>
  <strong>Customer Verification:</strong>{" "}
  {trip.customerVerificationStatus === "Verified" ? (
    <span className="text-green-700 font-bold">
      ✓ VERIFIED
    </span>
  ) : trip.customerVerificationStatus === "Change Requested" ? (
    <span className="text-red-700 font-bold">
      ⚠ CHANGE REQUESTED
    </span>
  ) : (
    <span className="text-gray-600">
      PENDING
    </span>
  )}
</div>

{trip.customerChangeRequest && (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <strong>Customer Change Request:</strong>

    <p className="mt-1 text-gray-700">
      {trip.customerChangeRequest}
    </p>

    {trip.customerChangeRequestedAt && (
      <p className="mt-2 text-sm text-gray-500">
        Requested:{" "}
        {trip.customerChangeRequestedAt.toLocaleString()}
      </p>
    )}
  </div>
)}

        <div>
          <strong>Driver:</strong>{" "}
          {trip.assignments[0]?.driver.firstName}{" "}
          {trip.assignments[0]?.driver.lastName}
        </div>

        <div>
          <strong>Bus:</strong>{" "}
          {trip.assignments[0]?.bus.busNumber}
        </div>
<div className="bg-white rounded-xl shadow p-8 mt-8">
  <h2 className="text-2xl font-bold text-blue-900 mb-6">
    Driver Trip Sheet
  </h2>

  {!assignment ? (
    <p className="text-gray-600">
      No driver has been assigned to this trip.
    </p>
  ) : (
    <div className="space-y-6">

      {/* Customer Trip Times */}
      <div>
        <h3 className="text-lg font-bold mb-3">
          Customer Trip Times
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Pickup Departure:</strong>{" "}
            {assignment.pickupDepartureTime || "—"}
          </div>

          <div>
            <strong>Destination Arrival:</strong>{" "}
            {assignment.destinationArrivalTime || "—"}
          </div>

          <div>
            <strong>Destination Departure:</strong>{" "}
            {assignment.destinationDepartureTime || "—"}
          </div>

          <div>
            <strong>Return Time:</strong>{" "}
            {assignment.returnTime || "—"}
          </div>

          <div>
            <strong>Total Customer Hours:</strong>{" "}
            {assignment.totalCustomerHours != null
              ? `${assignment.totalCustomerHours} hours`
              : "—"}
          </div>
        </div>
      </div>

      {/* Passenger Accountability */}
      <div>
        <h3 className="text-lg font-bold mb-3">
          Passenger Accountability
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <strong>Total Passengers at Departure:</strong>{" "}
            {assignment.totalPassengersDeparture ?? "—"}
          </div>

          <div>
            <strong>Students at Departure:</strong>{" "}
            {assignment.studentPassengersDeparture ?? "—"}
          </div>

          <div>
            <strong>Students on Return:</strong>{" "}
            {assignment.studentPassengersReturn ?? "—"}
          </div>
        </div>
      </div>

      
      {/* Meal Stop */}
      <div>
        <h3 className="text-lg font-bold mb-3">
          Meal Stop
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <strong>Meal Stop:</strong>{" "}
            {assignment.mealStop ? "Yes" : "No"}
          </div>

          <div>
            <strong>Arrival:</strong>{" "}
            {assignment.mealStopArrivalTime || "—"}
          </div>

          <div>
            <strong>Departure:</strong>{" "}
            {assignment.mealStopDepartureTime || "—"}
          </div>
        </div>
      </div>

      {/* Mileage and Fuel */}
      <div>
        <h3 className="text-lg font-bold mb-3">
          Mileage & Fuel
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <strong>Beginning Odometer:</strong>{" "}
            {assignment.beginningOdometer ?? "—"}
          </div>

          <div>
            <strong>Ending Odometer:</strong>{" "}
            {assignment.endingOdometer ?? "—"}
          </div>

          <div>
            <strong>Total Mileage:</strong>{" "}
            {assignment.beginningOdometer != null &&
            assignment.endingOdometer != null
              ? assignment.endingOdometer -
                assignment.beginningOdometer
              : "—"}
          </div>

          <div>
            <strong>Fuel Added:</strong>{" "}
            {assignment.fuelAdded != null
              ? `${assignment.fuelAdded} gallons`
              : "—"}
          </div>
        </div>
      </div>

      {/* Driver Hours */}
      <div>
        <h3 className="text-lg font-bold mb-3">
          Driver Hours
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <strong>Driver Start:</strong>{" "}
            {assignment.driverStartTime || "—"}
          </div>

          <div>
            <strong>Driver End:</strong>{" "}
            {assignment.driverEndTime || "—"}
          </div>

          <div>
            <strong>Total Driver Hours:</strong>{" "}
            {assignment.totalDriverHours != null
              ? `${assignment.totalDriverHours} hours`
              : "—"}
          </div>
        </div>
      </div>
      {/* Customer Signature */}
<div>
  <h3 className="text-lg font-bold mb-3">
    Customer Signature
  </h3>

  {assignment.customerSignature ? (
    <img
      src={assignment.customerSignature}
      alt="Customer signature"
      className="border rounded-lg max-w-md bg-white"
    />
  ) : (
    <p className="text-gray-500">
      No customer signature submitted.
    </p>
  )}
</div>

    </div>
  )}
</div>

      </div>

      <DispatchReviewForm
        tripId={trip.id}
        reviewedBy={trip.reviewedBy}
        reviewedDate={
          trip.reviewedDate
            ? trip.reviewedDate.toISOString().split("T")[0]
            : null
        }
        reviewComments={trip.reviewComments}
      />

    

    </main>
  );
}