"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface Trip {
  id: number;
  tripNumber: string;
  tripDate: string;
  pickupLocation: string;
  destination: string;
  scheduledOnDutyTime: string | null;
  departureTime: string | null;
  returnToSchoolTime: string | null;
  status: string;
}
function formatTime(time?: string | null) {
  if (!time) return "TBD";

  const [hours, minutes] = time.split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes)) return time;

  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;

  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}
export default function DriverCalendarPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const response = await fetch("/api/driver/trips");

      if (!response.ok) {
        throw new Error("Unable to load trips.");
      }

      const data = await response.json();
      setTrips(data);
    } catch (error) {
      console.error("Error loading driver calendar:", error);
    } finally {
      setLoading(false);
    }
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tripsByDate = useMemo(() => {
    const grouped: Record<string, Trip[]> = {};

    trips.forEach((trip) => {
      const date = new Date(trip.tripDate);

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(trip);
    });

    return grouped;
  }, [trips]);

  function previousMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const today = new Date();

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">
              My Calendar
            </h1>

            <p className="text-gray-600 mt-1">
              View your scheduled work days and assigned trips.
            </p>
          </div>

          <Link
            href="/driver"
            className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-lg text-center"
          >
            Back to Driver Portal
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={previousMonth}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              ←
            </button>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-900">
                {monthName}
              </h2>

              <button
                type="button"
                onClick={goToToday}
                className="text-sm text-blue-700 hover:underline mt-1"
              >
                Today
              </button>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 border-t border-l border-gray-300">
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day) => (
              <div
                key={day}
                className="border-r border-b border-gray-300 bg-gray-100 p-2 text-center font-semibold text-sm"
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[90px] border-r border-b border-gray-300 bg-gray-50"
                  />
                );
              }

              const dateKey = `${year}-${String(month + 1).padStart(
                2,
                "0"
              )}-${String(day).padStart(2, "0")}`;

              const dayTrips = tripsByDate[dateKey] || [];

              const isToday =
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === day;

              return (
                <div
                  key={day}
                  className={`min-h-[90px] border-r border-b border-gray-300 p-2 ${
                    isToday ? "bg-blue-50" : "bg-white"
                  }`}
                >
                  <div
                    className={`text-sm font-bold mb-2 ${
                      isToday
                        ? "text-blue-900 bg-blue-200 rounded-full w-7 h-7 flex items-center justify-center"
                        : "text-gray-700"
                    }`}
                  >
                    {day}
                  </div>

                  {dayTrips.map((trip) => (
                    <Link
                      key={trip.id}
                      href={`/driver/trips/${trip.id}`}
                      className="block bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded-md p-2 mb-1"
                    >
                      <div className="font-bold text-blue-900 text-sm">
  Trip {trip.tripNumber}
</div>

<div className="text-xs text-gray-700 truncate">
  {trip.destination}
</div>

<div className="text-xs text-gray-700 mt-1">
  On Duty: {formatTime(trip.scheduledOnDutyTime)}
</div>

<div className="text-xs text-gray-700">
  Start: {formatTime(trip.departureTime)}
</div>

<div className="text-xs text-gray-700">
  End: {formatTime(trip.returnToSchoolTime)}
</div>
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="text-center text-gray-500 mt-4">
            Loading your calendar...
          </div>
        )}

        {!loading && trips.length === 0 && (
          <div className="bg-white rounded-xl shadow p-6 mt-6 text-center">
            <p className="text-gray-500">
              You currently have no trips scheduled.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}