"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  Building2,
  User,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Flag,
  ArrowLeft,
  Utensils,
  FileText,
} from "lucide-react";
import { useParams } from "next/navigation";

type Trip = {
  id: number;
  tripNumber: string;
  tripDate: string;
  tripType?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  pickupLocation?: string | null;
  arrivalTime?: string | null;
  departureTime?: string | null;
  destination?: string | null;
  eventTime?: string | null;
  destinationArrivalTime?: string | null;
  departDestinationTime?: string | null;
  returnToSchoolTime?: string | null;
  mealStop?: boolean;
  passengerCount?: number | null;
  tripDetails?: string | null;
  charterParty?: {
    companyName?: string | null;
    name?: string | null;
  } | null;

customerVerificationStatus?: string;
};

function display(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}

export default function VerifyTripPage() {
  const params = useParams();
  const id = params.id as string;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTrip() {
      try {
        const response = await fetch(`/api/trips/${id}`);

        if (!response.ok) {
          throw new Error("Unable to load trip.");
        }

        const data = await response.json();
setTrip(data);

setVerified(data.customerVerificationStatus === "Verified");
      } catch (err) {
        console.error(err);
        setError("Unable to load the trip details.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadTrip();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-xl w-full text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-3">
            Unable to Load Trip
          </h1>

          <p className="text-gray-600">
            {error || "Trip not found."}
          </p>
        </div>
      </main>
    );
  }

  const charterParty =
    trip.charterParty?.companyName ||
    trip.charterParty?.name ||
    "-";

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          <div className="bg-blue-900 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  STS Trip Confirmation
                </h1>

                <p className="text-blue-100 mt-1">
                  Please review your trip details
                </p>
              </div>

              <img
                src="/images/sts-logo.png"
                alt="Stephens Transportation Services"
                className="h-16 w-auto bg-white rounded p-1"
              />
            </div>
          </div>

          {/* TRIP INFORMATION */}
          <div className="p-6">

            <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-300 rounded-lg overflow-hidden">

              <Info
  icon={<CalendarDays />}
  label="Trip Number"
  value={display(trip.tripNumber)}
/>

<Info
  icon={<CalendarDays />}
  label="Trip Date"
  value={new Date(trip.tripDate).toLocaleDateString()}
/>

<Info
  icon={<Users />}
  label="Trip Type"
  value={display(trip.tripType)}
/>

              <Info
  icon={<Building2 size={18} strokeWidth={2.2} />}
  label="Charter Party"
  value={charterParty}
/>

<Info
  icon={<User size={18} strokeWidth={2.2} />}
  label="Contact Name"
  value={display(trip.contactName)}
/>

<Info
  icon={<Phone size={18} strokeWidth={2.2} />}
  label="Contact Phone"
  value={display(trip.contactPhone)}
/>

              <Info
  icon={<MapPin size={18} strokeWidth={2.2} />}
  label="Pickup Location"
  value={display(trip.pickupLocation)}
/>

<Info
  icon={<Clock size={18} strokeWidth={2.2} />}
  label="Arrival Time"
  value={display(trip.arrivalTime)}
/>

<Info
  icon={<ArrowRight size={18} strokeWidth={2.2} />}
  label="Departure Time"
  value={display(trip.departureTime)}
/>

              <Info
  icon={<Flag size={18} strokeWidth={2.2} />}
  label="Destination"
  value={display(trip.destination)}
/>

<Info
  icon={<Clock size={18} strokeWidth={2.2} />}
  label="Event Time"
  value={display(trip.eventTime)}
/>

<Info
  icon={<Clock size={18} strokeWidth={2.2} />}
  label="Destination Arrival Time"
  value={display(trip.destinationArrivalTime)}
/>

             <Info
  icon={<ArrowRight size={18} strokeWidth={2.2} />}
  label="Depart Destination Time"
  value={display(trip.departDestinationTime)}
/>

<Info
  icon={<ArrowLeft size={18} strokeWidth={2.2} />}
  label="Return Time"
  value={display(trip.returnToSchoolTime)}
/>

<Info
  icon={<Utensils size={18} strokeWidth={2.2} />}
  label="Meal Stop"
  value={trip.mealStop ? "Yes" : "No"}
/>

            </div>

            {/* PASSENGER COUNT / TRIP DETAILS */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 border border-gray-300 rounded-lg overflow-hidden">

              <Info
  icon={<Users size={18} strokeWidth={2.2} />}
  label="Passenger Count"
  value={display(trip.passengerCount)}
/>

              <div className="md:col-span-2 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase">
  <FileText size={18} strokeWidth={2.2} />
  <span>Trip Details</span>
</div>

                <div className="mt-2 text-gray-700 whitespace-pre-wrap">
                  {trip.tripDetails || "No trip details provided."}
                </div>
              </div>

            </div>

            {/* VERIFICATION */}
            <div className="mt-6 border border-blue-200 bg-blue-50 rounded-xl p-6">

              <h2 className="text-xl font-bold text-blue-900">
                Customer Verification
              </h2>

              <p className="mt-2 text-gray-700">
                Please review all of the trip information above.
                If everything is correct, click the button below to
                verify the trip details.
              </p>

              <p className="mt-2 text-gray-700">
                If any changes are needed, please contact Stephens
                Transportation Services before the trip.
              </p>

              {!verified ? (
  <div className="mt-5 space-y-3">
    <button
      type="button"
      className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 px-6 rounded-lg"
      onClick={async () => {
        try {
          const response = await fetch(`/api/trips/${trip.id}/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "verify",
            }),
          });

          if (!response.ok) {
            throw new Error("Verification failed");
          }

          setVerified(true);
        } catch (error) {
          console.error(error);
          alert("Unable to verify trip details. Please try again.");
        }
      }}
    >
      ✓ VERIFY DETAILS
    </button>

    <button
      type="button"
      className="w-full border-2 border-blue-900 text-blue-900 hover:bg-blue-50 font-bold py-3 px-6 rounded-lg"
      onClick={async () => {
        const changeRequest = window.prompt(
          "Please tell us what needs to be changed:"
        );

        if (!changeRequest?.trim()) {
          return;
        }

        try {
          const response = await fetch(`/api/trips/${trip.id}/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "change",
              changeRequest: changeRequest.trim(),
            }),
          });

          if (!response.ok) {
            throw new Error("Change request failed");
          }

          alert(
            "Your change request has been sent to Stephens Transportation Services."
          );
        } catch (error) {
          console.error(error);
          alert(
            "Unable to send the change request. Please try again."
          );
        }
      }}
    >
      ⚠ NEED A CHANGE
    </button>
  </div>
) : (
  <div className="mt-5 bg-green-100 border border-green-300 text-green-800 rounded-lg p-4 text-center font-bold">
    ✓ Trip details verified
  </div>
)}

            </div>

            {/* STS CONTACT */}
            <div className="mt-5 text-center text-sm text-gray-500">
              <p className="font-semibold text-gray-700">
                Stephens Transportation Services
              </p>

              <p>
                Daniel Stephens • (951) 557-1108
              </p>

              <p>
                stsllc034@gmail.com
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border-b md:border-r border-gray-300 p-4">
      <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase">
        {icon && (
          <span className="flex items-center justify-center text-blue-900">
            {icon}
          </span>
        )}

        <span>{label}</span>
      </div>

      <div className={icon ? "mt-1 ml-7 text-gray-800" : "mt-1 text-gray-800"}>
        {value}
      </div>
    </div>
  );
}