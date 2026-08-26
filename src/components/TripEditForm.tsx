"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  trip: any;
  drivers: any[];
  buses: any[];
  charterParties: any[];
};

function formatDateInput(value: any) {
  if (!value) return "";

  const date = new Date(value);

  return `${date.getUTCFullYear()}-${String(
    date.getUTCMonth() + 1
  ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

export default function TripEditForm({
  trip,
  drivers,
  buses,
  charterParties,
}: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const assignment = trip.assignments?.[0];

  const [form, setForm] = useState({
    tripDate: formatDateInput(trip.tripDate),

    requestReceivedDate: formatDateInput(trip.requestReceivedDate),
    requestConfirmedDate: formatDateInput(trip.requestConfirmedDate),

    status: trip.status ?? "Draft",

    charterPartyId: trip.charterParty?.id ?? "",

    contactName: trip.contactName ?? "",
    contactPhone: trip.contactPhone ?? "",
    contactEmail: trip.contactEmail ?? "",

    pickupLocation: trip.pickupLocation ?? "",
    destination: trip.destination ?? "",

    scheduledOnDutyTime: trip.scheduledOnDutyTime ?? "",
    arrivalTime: trip.arrivalTime ?? "",
    departureTime: trip.departureTime ?? "",
    eventTime: trip.eventTime ?? "",
    departDestinationTime: trip.departDestinationTime ?? "",
    returnToSchoolTime: trip.returnToSchoolTime ?? "",

    passengerCount: trip.passengerCount ?? "",
    tripDetails: trip.tripDetails ?? "",

    tripType: trip.tripType ?? "Drop / Return",

    mealStop: trip.mealStop ?? false,

    notes: trip.notes ?? "",

    driverId: assignment?.driver?.id ?? "",
    busId: assignment?.bus?.id ?? "",
  });

  function updateField(field: string, value: any) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSaving(true);

    try {
      const response = await fetch(`/api/trips/${trip.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  ...form,
  passengerCount:
    form.passengerCount === "" ? null : Number(form.passengerCount),
  driverId:
    form.driverId === "" ? null : Number(form.driverId),
  busId:
    form.busId === "" ? null : Number(form.busId),
}),
      });

      if (!response.ok) {
  const errorText = await response.text();

  console.error("SAVE TRIP API ERROR:", {
    status: response.status,
    body: errorText,
  });

  alert(`Save failed (${response.status}): ${errorText}`);

  throw new Error("Failed to save trip.");
}

      router.push(`/trips/${trip.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to save trip.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {/* Trip Information */}
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-4">
          Trip Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Trip Date
            </label>

            <input
              type="date"
              value={form.tripDate}
              onChange={(e) => updateField("tripDate", e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option>Draft</option>
              <option>Confirmed</option>
              <option>Driver Assigned</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Date Request Received
            </label>

            <input
              type="date"
              value={form.requestReceivedDate}
              onChange={(e) =>
                updateField("requestReceivedDate", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Date Request Confirmed
            </label>

            <input
              type="date"
              value={form.requestConfirmedDate}
              onChange={(e) =>
                updateField("requestConfirmedDate", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Charter Party
            </label>

            <select
              value={form.charterPartyId}
              onChange={(e) =>
                updateField("charterPartyId", Number(e.target.value))
              }
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="">Select Charter Party</option>

              {charterParties.map((party) => (
                <option key={party.id} value={party.id}>
                  {party.companyName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Driver
            </label>

            <select
              value={form.driverId}
              onChange={(e) =>
                updateField(
                  "driverId",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="">Select Driver</option>

              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.firstName} {driver.lastName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Bus
            </label>

            <select
              value={form.busId}
              onChange={(e) =>
                updateField(
                  "busId",
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="">Select Bus</option>

              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  Bus {bus.busNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Passenger Count
            </label>

            <input
              type="number"
              value={form.passengerCount}
              onChange={(e) =>
                updateField("passengerCount", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>
      </div>

      {/* Charter Party Contact */}
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-4">
          Charter Party Contact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Contact Name
            </label>

            <input
              type="text"
              value={form.contactName}
              onChange={(e) =>
                updateField("contactName", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Contact Phone
            </label>

            <input
              type="text"
              value={form.contactPhone}
              onChange={(e) =>
                updateField("contactPhone", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Contact Email
            </label>

            <input
              type="email"
              value={form.contactEmail}
              onChange={(e) =>
                updateField("contactEmail", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>
      </div>

      {/* Locations */}
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-4">
          Trip Locations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Pickup Location
            </label>

            <input
              type="text"
              value={form.pickupLocation}
              onChange={(e) =>
                updateField("pickupLocation", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Destination
            </label>

            <input
              type="text"
              value={form.destination}
              onChange={(e) =>
                updateField("destination", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-4">
          Trip Schedule
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
  <label className="block text-sm font-semibold mb-2">
    Scheduled On-Duty Time
  </label>

  <input
    type="time"
    value={form.scheduledOnDutyTime}
    onChange={(e) =>
      updateField("scheduledOnDutyTime", e.target.value)
    }
    className="w-full border rounded-lg px-4 py-3"
  />
</div>  
          <div>
            <label className="block text-sm font-semibold mb-2">
              Arrival Time
            </label>

            <input
              type="time"
              value={form.arrivalTime}
              onChange={(e) =>
                updateField("arrivalTime", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Departure Time
            </label>

            <input
              type="time"
              value={form.departureTime}
              onChange={(e) =>
                updateField("departureTime", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Event Time
            </label>

            <input
              type="time"
              value={form.eventTime}
              onChange={(e) =>
                updateField("eventTime", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Depart Destination
            </label>

            <input
              type="time"
              value={form.departDestinationTime}
              onChange={(e) =>
                updateField("departDestinationTime", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Return to School
            </label>

            <input
              type="time"
              value={form.returnToSchoolTime}
              onChange={(e) =>
                updateField("returnToSchoolTime", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div>
        <h2 className="text-xl font-bold text-blue-900 mb-4">
          Trip Details
        </h2>

        <textarea
          rows={5}
          value={form.tripDetails}
          onChange={(e) =>
            updateField("tripDetails", e.target.value)
          }
          className="w-full border rounded-lg px-4 py-3"
          placeholder="Trip details..."
        />
      </div>

      {/* Trip Type and Meal Stop */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Trip Type
            </label>

            <select
              value={form.tripType}
              onChange={(e) =>
                updateField("tripType", e.target.value)
              }
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="Drop / Return">Drop / Return</option>
              <option value="Drop One Way">Drop One Way</option>
              <option value="Return One Way">Return One Way</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Meal Stop
            </label>

            <select
              value={form.mealStop ? "Yes" : "No"}
              onChange={(e) =>
                updateField("mealStop", e.target.value === "Yes")
              }
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Internal Notes */}
      <div>
        <label className="block text-sm font-semibold mb-2">
          Internal Notes
        </label>

        <textarea
          rows={4}
          value={form.notes}
          onChange={(e) =>
            updateField("notes", e.target.value)
          }
          className="w-full border rounded-lg px-4 py-3"
          placeholder="Trip notes..."
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => router.push(`/trips/${trip.id}`)}
          className="px-6 py-3 rounded-lg bg-gray-600 text-white hover:bg-gray-700"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-lg bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}