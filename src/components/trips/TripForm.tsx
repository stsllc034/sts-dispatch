"use client";

import { useEffect, useState } from "react";

export default function TripForm() {
 const [trip, setTrip] = useState({
  tripId: "",
  tripDate: "",

  requestReceivedDate: "",
  requestConfirmedDate: "",

  charterPartyId: "",
  contactName: "",
  contactPhone: "",
  pickupLocation: "",

  driverId: "",
  busId: "",
  
  passengerCount: "",
  destination: "",
  tripDetails: "",

 arrivalTime: "",
scheduledOnDutyTime: "",
departureTime: "",
eventTime: "",
departDestinationTime: "",
returnToSchoolTime: "",

tripType: "Drop / Return",
mealStop: false,
notes: "",
status: "Draft",
});



  const [charterParties, setCharterParties] = useState<any[]>([]);
  const [drivers, setDrivers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [saved, setSaved] = useState(false);
  const [savedTripNumber, setSavedTripNumber] = useState("");
const [savedTripId, setSavedTripId] = useState<number | null>(null);
const [savedTripData, setSavedTripData] = useState({
  tripId: "",
  tripDate: "",
  charterPartyId: "",
  pickupLocation: "",
  destination: "",
  passengerCount: "",
});

  useEffect(() => {
  loadCharterParties();
  loadDrivers();
  loadBuses();
  loadNextTripNumber();
}, []);


async function loadCharterParties() {
  try {
    const response = await fetch("/api/charter-parties");
    const data = await response.json();
    setCharterParties(data);
  } catch (error) {
    console.error(error);
  }
}
async function loadDrivers() {
  try {
    const response = await fetch("/api/drivers");
    const data = await response.json();
    setDrivers(data);
  } catch (error) {
    console.error(error);
  }
}

async function loadBuses() {
  try {
    const response = await fetch("/api/fleet");
    const data = await response.json();
    setBuses(data);
  } catch (error) {
    console.error(error);
  }
}
  function updateField(
    field: keyof typeof trip,
    value: string
  ) {
    setTrip((prev) => ({
      ...prev,
      [field]: value,
    }));
  }
async function loadNextTripNumber() {
  try {
    const response = await fetch("/api/trips/next-trip-number");
    const data = await response.json();

    setTrip((prev) => ({
      ...prev,
      tripId: data.tripNumber,
    }));
  } catch (error) {
    console.error(error);
  }
}
  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  try {
    const response = await fetch("/api/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  // Identification
tripNumber: trip.tripId,
status: trip.status,

  // Request Tracking
  requestReceivedDate: trip.requestReceivedDate,
  requestConfirmedDate: trip.requestConfirmedDate,

  // Trip Date
  tripDate: trip.tripDate,

  // Charter Party
  charterPartyId: Number(trip.charterPartyId),
// Assignment
driverId: trip.driverId ? Number(trip.driverId) : null,
busId: trip.busId ? Number(trip.busId) : null,
  // Contact Information
  contactName: trip.contactName,
  contactPhone: trip.contactPhone,
  contactEmail: null,

  // Locations
  pickupLocation: trip.pickupLocation,
  destination: trip.destination,

  // Schedule
  arrivalTime: trip.arrivalTime,
  scheduledOnDutyTime: trip.scheduledOnDutyTime,
departureTime: trip.departureTime,
eventTime: trip.eventTime,
departDestinationTime: trip.departDestinationTime,
returnToSchoolTime: trip.returnToSchoolTime,

  // Trip Details
  passengerCount: trip.passengerCount,
  tripDetails: trip.tripDetails,

  // Trip Type
  tripType: trip.tripType,

  // Meal Stop
  mealStop: trip.mealStop,

  // Notes
  notes: trip.notes,
}),
    });

    if (!response.ok) {
  const error = await response.text();
  console.log(error);
  alert(error);
  return;
}
const savedTrip = await response.json();

setSavedTripData({
  tripId: trip.tripId,
  tripDate: trip.tripDate,
  charterPartyId: trip.charterPartyId,
  pickupLocation: trip.pickupLocation,
  destination: trip.destination,
  passengerCount: trip.passengerCount,
});

setSaved(true);
setSavedTripNumber(trip.tripId);
setSavedTripId(savedTrip.id);
    setTrip({
  tripId: "",
  tripDate: "",
  requestReceivedDate: "",
  requestConfirmedDate: "",
  charterPartyId: "",
  contactName: "",
  contactPhone: "",
  pickupLocation: "",
  driverId: "",
  busId: "",

  passengerCount: "",
  destination: "",
  tripDetails: "",

arrivalTime: "",
scheduledOnDutyTime: "",
departureTime: "",
eventTime: "",
departDestinationTime: "",
returnToSchoolTime: "",

tripType: "Drop / Return",
mealStop: false,
notes: "",
status: "Draft",

});

await loadNextTripNumber();

  } catch (error) {
    console.error(error);
    alert("Unable to save trip.");
  }
}

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-blue-900">
  Trip Confirmation
</h1>

<p className="text-gray-600 mt-1">
  Complete the trip confirmation information before assigning drivers and buses.
</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block font-semibold mb-2">
            Trip ID
          </label>

          <input
            value={trip.tripId}
            readOnly
            className="w-full border rounded-lg p-3 bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Trip Date
          </label>

          <input
            type="date"
            value={trip.tripDate}
            onChange={(e) =>
              updateField("tripDate", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Date Request Received
          </label>

          <input
            type="date"
            value={trip.requestReceivedDate}
            onChange={(e) =>
              updateField("requestReceivedDate", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Date Request Confirmed
          </label>

          <input
            type="date"
            value={trip.requestConfirmedDate}
            onChange={(e) =>
              updateField("requestConfirmedDate", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Charter Party
          </label>

          <select
          value={trip.charterPartyId}
          onChange={(e) => {
  const selectedId = e.target.value;

  updateField("charterPartyId", selectedId);

  const party = charterParties.find(
    (p: any) => p.id === Number(selectedId)
  );

  if (party) {
   console.log("Party:", party);
console.log("Pickup:", party.pickupAddress);

    setTrip((prev) => ({
      ...prev,
      contactName: party.contactName ?? "",
      contactPhone: party.phone  ?? "",
      pickupLocation: party.pickupAddress ?? "",
    }));
  }
}}
          className="w-full border rounded-lg p-3"
>
         <option value="">Select Charter Party</option>

         {charterParties.map((party: any) => (
        <option key={party.id} value={party.id}>
        {party.companyName}
       </option>
  ))}
</select>
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Driver
          </label>

          <select
  value={trip.driverId}
  onChange={(e) =>
    updateField("driverId", e.target.value)
  }
  className="w-full border rounded-lg p-3"
>
  <option value="">Select Driver</option>

{drivers.map((driver: any) => (
  <option key={driver.id} value={driver.id}>
    {driver.firstName} {driver.lastName}
  </option>
))}
</select>
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Contact Name
          </label>

          <input
            value={trip.contactName}
            onChange={(e) =>
              updateField("contactName", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Bus Number
          </label>

<select
  value={trip.busId}
  onChange={(e) =>
    updateField("busId", e.target.value)
  }
  className="w-full border rounded-lg p-3"
>
  <option value="">Awaiting Bus Assignment</option>

{buses.map((bus: any) => (
  <option key={bus.id} value={bus.id}>
    {bus.busNumber}
  </option>
))}
</select>
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Contact Phone
          </label>

          <input
            value={trip.contactPhone}
            onChange={(e) =>
              updateField("contactPhone", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Passenger Count
          </label>

          <input
            type="number"
            value={trip.passengerCount}
            onChange={(e) =>
              updateField("passengerCount", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

      </div>

      <div>
        <label className="block font-semibold mb-2">
          Pickup Location
        </label>

        <input
          value={trip.pickupLocation}
          onChange={(e) =>
            updateField("pickupLocation", e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2">
          Destination
        </label>

        <input
          value={trip.destination}
          onChange={(e) =>
            updateField("destination", e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
<div>
  <label className="block font-semibold mb-2">
    On Duty Time
  </label>

  <input
    type="time"
    value={trip.scheduledOnDutyTime}
    onChange={(e) =>
      updateField("scheduledOnDutyTime", e.target.value)
    }
    className="w-full border rounded-lg p-3"
  />
</div>

  <div>
    <label className="block font-semibold mb-2">
      Arrival Time
    </label>

    <input
      type="time"
      value={trip.arrivalTime}
      onChange={(e) =>
        updateField("arrivalTime", e.target.value)
      }
      className="w-full border rounded-lg p-3"
    />
  </div>

  <div>
    <label className="block font-semibold mb-2">
      Departure Time
    </label>

    <input
      type="time"
      value={trip.departureTime}
      onChange={(e) =>
        updateField("departureTime", e.target.value)
      }
      className="w-full border rounded-lg p-3"
    />
  </div>

  <div>
    <label className="block font-semibold mb-2">
      Event Time
    </label>

    <input
      type="time"
      value={trip.eventTime}
      onChange={(e) =>
        updateField("eventTime", e.target.value)
      }
      className="w-full border rounded-lg p-3"
    />
  </div>

  <div>
    <label className="block font-semibold mb-2">
      Depart Destination
    </label>

    <input
      type="time"
      value={trip.departDestinationTime}
      onChange={(e) =>
        updateField("departDestinationTime", e.target.value)
      }
      className="w-full border rounded-lg p-3"
    />
  </div>

  <div>
    <label className="block font-semibold mb-2">
      Return to School
    </label>

    <input
      type="time"
      value={trip.returnToSchoolTime}
      onChange={(e) =>
        updateField("returnToSchoolTime", e.target.value)
      }
      className="w-full border rounded-lg p-3"
    />
  </div>

</div>

      <div>
        <label className="block font-semibold mb-2">
          Trip Details
        </label>

        <textarea
          rows={5}
          value={trip.tripDetails}
          onChange={(e) =>
            updateField("tripDetails", e.target.value)
          }
          className="w-full border rounded-lg p-3"
        />
      </div>

      <div>
  <label className="block font-semibold mb-2">
    Internal Notes
  </label>

  <textarea
    rows={4}
    value={trip.notes}
    onChange={(e) =>
      updateField("notes", e.target.value)
    }
    className="w-full border rounded-lg p-3"
  />
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  <div>
    <label className="block font-semibold mb-2">
      Trip Type
    </label>

    <select
      value={trip.tripType}
      onChange={(e) =>
        updateField("tripType", e.target.value)
      }
      className="w-full border rounded-lg p-3"
    >
      <option value="Drop / Return">Drop / Return</option>
      <option value="Drop One Way">Drop One Way</option>
      <option value="Return One Way">Return One Way</option>
    </select>
  </div>

  <div>
    <label className="block font-semibold mb-2">
      Meal Stop
    </label>

    <select
      value={trip.mealStop ? "Yes" : "No"}
      onChange={(e) =>
        setTrip((prev) => ({
          ...prev,
          mealStop: e.target.value === "Yes",
        }))
      }
      className="w-full border rounded-lg p-3"
    >
      <option>No</option>
      <option>Yes</option>
    </select>
  </div>

  <div>
    <label className="block font-semibold mb-2">
      Status
    </label>

    <select
      value={trip.status}
      onChange={(e) =>
        updateField("status", e.target.value)
      }
      className="w-full border rounded-lg p-3"
    >
      <option>Draft</option>
      <option>Confirmed</option>
      <option>Driver Assigned</option>
      <option>Completed</option>
      <option>Cancelled</option>
    </select>
  </div>

</div>
{saved && (
  <div className="rounded-lg border border-green-300 bg-green-50 p-5">
    <h2 className="text-xl font-bold text-green-800">
      ✓ Trip Confirmation Saved
    </h2>

    <p className="text-green-700 mt-2">
      Your Trip Confirmation has been saved successfully.
    </p>

    <div className="flex gap-3 mt-5">
      <button
  type="button"
  onClick={() => {
    window.open(`/preview-trip/${savedTripId}`, "_blank");
  }}
  className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-lg"
>
  Preview PDF
</button>
      <button
  type="button"
  onClick={async () => {
  try {
    const response = await fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tripId: savedTripId,
        subject: `Trip Confirmation - ${savedTripData.tripId}`,
        html: `
          <h2>STS Trip Confirmation</h2>
          <p><strong>Trip ID:</strong> ${savedTripData.tripId}</p>
<p><strong>Trip Date:</strong> ${savedTripData.tripDate}</p>
<p><strong>Charter Party:</strong> ${savedTripData.charterPartyId}</p>
<p><strong>Pickup Location:</strong> ${savedTripData.pickupLocation}</p>
<p><strong>Destination:</strong> ${savedTripData.destination}</p>
<p><strong>Passenger Count:</strong> ${savedTripData.passengerCount}</p>
        `,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Unable to send email.");
      return;
    }

    alert("Trip confirmation email sent successfully.");
  } catch (error) {
    console.error("Email error:", error);
    alert("Unable to send trip confirmation email.");
  }
}}
  className="bg-green-700 hover:bg-green-800 text-white px-5 py-2 rounded-lg"
>
  Email Confirmation
</button>
<button
  type="button"
  onClick={() => {
    setTrip((prev) => ({
      ...prev,
      status: "Driver Assigned",
    }));

    alert("Driver assigned successfully.");
  }}
  className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-2 rounded-lg"
>
  Assign Driver
</button>

     </div>
  </div>
)}

<div className="flex justify-end">
  <button
    type="submit"
    className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold"
  >
    Save Confirmation
  </button>
</div>

</form>
  );
}