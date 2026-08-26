"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DriverTripFormProps = {
  tripId: number;
  assignmentId: number;
};

function calculateHours(start: string, end: string) {
  if (!start || !end) return "";

  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  let startMinutes = startHour * 60 + startMinute;
  let endMinutes = endHour * 60 + endMinute;

  // Allow trips that cross midnight.
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }

  return ((endMinutes - startMinutes) / 60).toFixed(2);
}

export default function DriverTripForm({
  tripId,
  assignmentId,
}: DriverTripFormProps) {
  const [pickupDepartureTime, setPickupDepartureTime] = useState("");
  const [destinationArrivalTime, setDestinationArrivalTime] = useState("");
  const [destinationDepartureTime, setDestinationDepartureTime] =
    useState("");
  const [returnTime, setReturnTime] = useState("");

  const [mealStop, setMealStop] = useState(false);
  const [mealStopArrivalTime, setMealStopArrivalTime] = useState("");
  const [mealStopDepartureTime, setMealStopDepartureTime] = useState("");

  const [beginningOdometer, setBeginningOdometer] = useState("");
  const [endingOdometer, setEndingOdometer] = useState("");

  const [driverStartTime, setDriverStartTime] = useState("");
  const [driverEndTime, setDriverEndTime] = useState("");

  const [fuelAdded, setFuelAdded] = useState("");
  const [totalPassengersDeparture, setTotalPassengersDeparture] =
  useState("");
  const [studentPassengersDeparture, setStudentPassengersDeparture] =
  useState("");
  const [studentPassengersReturn, setStudentPassengersReturn] =
  useState("");
const [customerSignature, setCustomerSignature] = useState("");
const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
const [signatureSaved, setSignatureSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
useEffect(() => {
  loadSavedTripSheet();
}, [tripId, assignmentId]);

useEffect(() => {
  if (!customerSignature) return;

  const canvas = signatureCanvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const image = new Image();

  image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  image.src = customerSignature;
}, [customerSignature]);
useEffect(() => {
  if (!customerSignature) return;

  const canvas = signatureCanvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const image = new Image();

  image.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height
    );
  };

  image.src = customerSignature;
}, [customerSignature]);
async function loadSavedTripSheet() {
  try {
    const response = await fetch(
      `/api/driver/trip-sheet?tripId=${tripId}`
    );

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    if (!data) {
      return;
    }

    setPickupDepartureTime(data.pickupDepartureTime ?? "");
    setDestinationArrivalTime(data.destinationArrivalTime ?? "");
    setDestinationDepartureTime(data.destinationDepartureTime ?? "");
    setReturnTime(data.returnTime ?? "");

    setMealStop(Boolean(data.mealStop));
    setMealStopArrivalTime(data.mealStopArrivalTime ?? "");
    setMealStopDepartureTime(data.mealStopDepartureTime ?? "");

    setBeginningOdometer(
      data.beginningOdometer != null
        ? String(data.beginningOdometer)
        : ""
    );

    setEndingOdometer(
      data.endingOdometer != null
        ? String(data.endingOdometer)
        : ""
    );

    setDriverStartTime(
  data.driverStartTime ?? data.scheduledOnDutyTime ?? ""
);
    setDriverEndTime(data.driverEndTime ?? "");

    setFuelAdded(
      data.fuelAdded != null
        ? String(data.fuelAdded)
        : ""
    );

    setTotalPassengersDeparture(
      data.totalPassengersDeparture != null
        ? String(data.totalPassengersDeparture)
        : ""
    );

    setStudentPassengersDeparture(
      data.studentPassengersDeparture != null
        ? String(data.studentPassengersDeparture)
        : ""
    );

    setStudentPassengersReturn(
      data.studentPassengersReturn != null
        ? String(data.studentPassengersReturn)
        : ""
    );

setCustomerSignature(data.customerSignature ?? "");
setSignatureSaved(Boolean(data.customerSignature));

        setLoaded(true);
  } catch (error) {
    console.error("Error loading saved trip sheet:", error);
  }
}
  const totalCustomerHours = useMemo(
    () => calculateHours(pickupDepartureTime, returnTime),
    [pickupDepartureTime, returnTime]
  );

  const totalDriverHours = useMemo(
    () => calculateHours(driverStartTime, driverEndTime),
    [driverStartTime, driverEndTime]
  );

  const totalMileage = useMemo(() => {
    if (!beginningOdometer || !endingOdometer) return "";

    const beginning = Number(beginningOdometer);
    const ending = Number(endingOdometer);

    if (ending < beginning) return "";

    return String(ending - beginning);
  }, [beginningOdometer, endingOdometer]);
function startSignature(
  e: React.PointerEvent<HTMLCanvasElement>
) {
  if (signatureSaved) return;

  const canvas = signatureCanvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.beginPath();
  ctx.moveTo(
    e.nativeEvent.offsetX,
    e.nativeEvent.offsetY
  );

  canvas.setPointerCapture(e.pointerId);
}

function drawSignature(
  e: React.PointerEvent<HTMLCanvasElement>
) {
  if (signatureSaved) return;

  const canvas = signatureCanvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (!canvas.hasPointerCapture(e.pointerId)) return;

  ctx.lineTo(
    e.nativeEvent.offsetX,
    e.nativeEvent.offsetY
  );

  ctx.stroke();
}

function endSignature(
  e: React.PointerEvent<HTMLCanvasElement>
) {
  if (signatureSaved) return;

  const canvas = signatureCanvasRef.current;
  if (!canvas) return;

  if (canvas.hasPointerCapture(e.pointerId)) {
    canvas.releasePointerCapture(e.pointerId);
  }

  setCustomerSignature(
    canvas.toDataURL("image/png")
  );
}

function clearSignature() {
  if (signatureSaved) return;

  const canvas = signatureCanvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  setCustomerSignature("");
}
  async function saveForm() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/driver/trip-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId,
          assignmentId,
          customerSignature,
          pickupDepartureTime,
          destinationArrivalTime,
          destinationDepartureTime,
          returnTime,
          totalCustomerHours:
            totalCustomerHours === "" ? null : Number(totalCustomerHours),

          mealStop,
          mealStopArrivalTime: mealStop
            ? mealStopArrivalTime
            : null,
          mealStopDepartureTime: mealStop
            ? mealStopDepartureTime
            : null,

          beginningOdometer:
            beginningOdometer === ""
              ? null
              : Number(beginningOdometer),

          endingOdometer:
            endingOdometer === ""
              ? null
              : Number(endingOdometer),

          fuelAdded:
  fuelAdded === "" ? null : Number(fuelAdded),

totalPassengersDeparture:
  totalPassengersDeparture === ""
    ? null
    : Number(totalPassengersDeparture),

studentPassengersDeparture:
  studentPassengersDeparture === ""
    ? null
    : Number(studentPassengersDeparture),

studentPassengersReturn:
  studentPassengersReturn === ""
    ? null
    : Number(studentPassengersReturn),


driverStartTime,
          driverEndTime,
          totalDriverHours:
            totalDriverHours === "" ? null : Number(totalDriverHours),
        
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save trip sheet.");
      }

      setMessage("Trip information saved successfully.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save trip information."
      );
    } finally {
      setSaving(false);
    }
  }
useEffect(() => {
  if (!loaded) return;

  const timer = setTimeout(async () => {
    try {
      await fetch("/api/driver/trip-sheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId,
          assignmentId,
          customerSignature,
          pickupDepartureTime,
          destinationArrivalTime,
          destinationDepartureTime,
          returnTime,

          totalCustomerHours:
            totalCustomerHours === ""
              ? null
              : Number(totalCustomerHours),

          mealStop,

          mealStopArrivalTime: mealStop
            ? mealStopArrivalTime
            : null,

          mealStopDepartureTime: mealStop
            ? mealStopDepartureTime
            : null,

          beginningOdometer:
            beginningOdometer === ""
              ? null
              : Number(beginningOdometer),

          endingOdometer:
            endingOdometer === ""
              ? null
              : Number(endingOdometer),

          fuelAdded:
            fuelAdded === ""
              ? null
              : Number(fuelAdded),

          totalPassengersDeparture:
            totalPassengersDeparture === ""
              ? null
              : Number(totalPassengersDeparture),

          studentPassengersDeparture:
            studentPassengersDeparture === ""
              ? null
              : Number(studentPassengersDeparture),

          studentPassengersReturn:
            studentPassengersReturn === ""
              ? null
              : Number(studentPassengersReturn),

          
          driverStartTime,
          driverEndTime,

          totalDriverHours:
            totalDriverHours === ""
              ? null
              : Number(totalDriverHours),
              
        }),
      });
    } catch (error) {
      console.error("Auto-save error:", error);
    }
  }, 1000);

  return () => clearTimeout(timer);
}, [
  loaded,
  tripId,
  assignmentId,
  pickupDepartureTime,
  destinationArrivalTime,
  destinationDepartureTime,
  returnTime,
  totalCustomerHours,
  mealStop,
  mealStopArrivalTime,
  mealStopDepartureTime,
  beginningOdometer,
  endingOdometer,
  fuelAdded,
  totalPassengersDeparture,
  studentPassengersDeparture,
  studentPassengersReturn,
   driverStartTime,
  driverEndTime,
  totalDriverHours,
]);
  return (
    <div className="border-t pt-6">
      <h2 className="text-xl font-bold text-blue-900 mb-6">
        Driver Trip Sheet
      </h2>

      {/* CUSTOMER TRIP TIMES */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">
          Customer Trip Times
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Departure Time — Pickup
            </label>
            <input
              type="time"
              value={pickupDepartureTime}
              onChange={(e) =>
                setPickupDepartureTime(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Arrival Time — Destination
            </label>
            <input
              type="time"
              value={destinationArrivalTime}
              onChange={(e) =>
                setDestinationArrivalTime(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Departure Time — Destination
            </label>
            <input
              type="time"
              value={destinationDepartureTime}
              onChange={(e) =>
                setDestinationDepartureTime(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Return Time
            </label>
            <input
              type="time"
              value={returnTime}
              onChange={(e) => setReturnTime(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Total Customer Hours
            </label>
            <input
              type="text"
              value={
                totalCustomerHours
                  ? `${totalCustomerHours} hours`
                  : ""
              }
              readOnly
              placeholder="Automatic"
              className="w-full border rounded-lg p-3 bg-gray-100"
            />
          </div>
        </div>
      </div>
            {/* PASSENGER ACCOUNTABILITY */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">
          Passenger Accountability
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Total Passengers at Departure
            </label>

            <input
              type="number"
              min="0"
              value={totalPassengersDeparture}
              onChange={(e) =>
                setTotalPassengersDeparture(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Student Passengers at Departure
            </label>

            <input
              type="number"
              min="0"
              value={studentPassengersDeparture}
              onChange={(e) =>
                setStudentPassengersDeparture(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Student Passengers on Return
            </label>

            <input
              type="number"
              min="0"
              value={studentPassengersReturn}
              onChange={(e) =>
                setStudentPassengersReturn(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>
        </div>
      </div>
      
      {/* MEAL STOP */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">
          Meal Stop
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">
            Meal Stop
          </label>

          <select
            value={mealStop ? "yes" : "no"}
            onChange={(e) => {
              const yes = e.target.value === "yes";
              setMealStop(yes);

              if (!yes) {
                setMealStopArrivalTime("");
                setMealStopDepartureTime("");
              }
            }}
            className="w-full border rounded-lg p-3"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {mealStop && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Meal Stop Arrival Time
              </label>

              <input
                type="time"
                value={mealStopArrivalTime}
                onChange={(e) =>
                  setMealStopArrivalTime(e.target.value)
                }
                className="w-full border rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Meal Stop Departure Time
              </label>

              <input
                type="time"
                value={mealStopDepartureTime}
                onChange={(e) =>
                  setMealStopDepartureTime(e.target.value)
                }
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>
        )}
      </div>

      {/* MILEAGE */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">
          Mileage
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Beginning Odometer
            </label>

            <input
              type="number"
              min="0"
              value={beginningOdometer}
              onChange={(e) =>
                setBeginningOdometer(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Ending Odometer
            </label>

            <input
              type="number"
              min="0"
              value={endingOdometer}
              onChange={(e) =>
                setEndingOdometer(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Total Mileage
            </label>

            <input
              type="text"
              value={totalMileage}
              readOnly
              placeholder="Automatic"
              className="w-full border rounded-lg p-3 bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* DRIVER HOURS */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">
          Driver Hours
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Driver Start Time
            </label>

            <input
              type="time"
              value={driverStartTime}
              onChange={(e) =>
                setDriverStartTime(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Actual Off-Duty / Return to Yard
            </label>

            <input
              type="time"
              value={driverEndTime}
              onChange={(e) =>
                setDriverEndTime(e.target.value)
              }
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Total Driver Hours
            </label>

            <input
              type="text"
              value={
                totalDriverHours
                  ? `${totalDriverHours} hours`
                  : ""
              }
              readOnly
              placeholder="Automatic"
              className="w-full border rounded-lg p-3 bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* FUEL */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4">
          Fuel
        </h3>

        <label className="block text-sm font-semibold mb-2">
          Fuel Added (Gallons)
        </label>

        <select
          value={fuelAdded}
          onChange={(e) => setFuelAdded(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="">Select Gallons</option>

          {Array.from({ length: 75 }, (_, index) => index + 1).map(
            (gallons) => (
              <option key={gallons} value={gallons}>
                {gallons}
              </option>
            )
          )}
        </select>
      </div>
{/* CUSTOMER SIGNATURE */}
<div className="border-t pt-6 mt-6">
  <h2 className="text-xl font-semibold mb-3">
    Customer Signature
  </h2>

  <p className="text-sm text-gray-600 mb-2">
    Customer signature confirming the trip itinerary details.
  </p>

  <div className="border border-gray-400 rounded-lg bg-white overflow-hidden">
    <canvas
      ref={signatureCanvasRef}
      width={700}
      height={200}
      className="w-full touch-none"
      style={{ maxWidth: "100%", height: "200px" }}
      onPointerDown={startSignature}
      onPointerMove={drawSignature}
      onPointerUp={endSignature}
      onPointerCancel={endSignature}
    />
  </div>

  {!signatureSaved && (
  <button
    type="button"
    onClick={clearSignature}
    className="mt-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
  >
    Clear Signature
  </button>
)}
      {/* SAVE */}
      <div className="border-t pt-6">
        {message && (
          <div className="mb-4 p-4 rounded-lg bg-gray-100">
            {message}
          </div>
        )}

        <button
          type="button"
          onClick={saveForm}
          disabled={saving}
          className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 disabled:bg-gray-400"
        >
          {saving ? "Saving..." : "Save Trip Information"}
        </button>
      </div>
    </div>
    </div>
  );
}