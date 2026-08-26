import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AppLayout from "@/components/AppLayout";

function formatTime(time?: string | null) {
  if (!time) return "TBD";

  const [hours, minutes] = time.split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes)) return time;

  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;

  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;

  const today = new Date();

  const selectedMonth = params.month
    ? Number(params.month)
    : today.getMonth();

  const selectedYear = today.getFullYear();

  const firstDay = new Date(selectedYear, selectedMonth, 1);
  const lastDay = new Date(selectedYear, selectedMonth + 1, 0);

  const trips = await prisma.trip.findMany({
    where: {
      tripDate: {
        gte: firstDay,
        lte: new Date(
          selectedYear,
          selectedMonth,
          lastDay.getDate(),
          23,
          59,
          59,
          999
        ),
      },
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
    orderBy: {
      tripDate: "asc",
    },
  });

  const tripsByDay: Record<number, typeof trips> = {};

  for (const trip of trips) {
    const day = new Date(trip.tripDate).getDate();

    if (!tripsByDay[day]) {
      tripsByDay[day] = [];
    }

    tripsByDay[day].push(trip);
  }

  const startingDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  while (calendarDays.length % 7 !== 0) {
    calendarDays.push(null);
  }

  const previousMonth =
    selectedMonth === 0 ? 11 : selectedMonth - 1;

  const nextMonth =
    selectedMonth === 11 ? 0 : selectedMonth + 1;

  return (
    <AppLayout title="Administrator Calendar">
  <div className="bg-white rounded-lg shadow p-2">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-2">
          <Link
            href={`/admin-calendar?month=${previousMonth}`}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            ← Previous
          </Link>

          <h2 className="text-2xl font-bold text-blue-900">
            {formatDate(firstDay)}
          </h2>

          <Link
            href={`/admin-calendar?month=${nextMonth}`}
            className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Next →
          </Link>
        </div>

        {/* SUMMARY */}
        <div className="mb-2 text-sm text-gray-700">
          <strong>{trips.length}</strong>{" "}
          trip{trips.length === 1 ? "" : "s"} scheduled this month
        </div>

        {/* CALENDAR */}
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto grid grid-cols-7 border-t border-l border-gray-300 leading-tight">

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
              className="border-r border-b border-gray-300 bg-gray-100 p-2 text-center text-sm font-semibold"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-[35px] border-r border-b border-gray-300 bg-gray-50"
                />
              );
            }

            const dayTrips = tripsByDay[day] || [];

            const isToday =
              today.getFullYear() === selectedYear &&
              today.getMonth() === selectedMonth &&
              today.getDate() === day;

            return (
              <div
                key={day}
                className={`min-h-[40px] border-r border-b border-gray-300 p-1 text-xs ${
                  isToday ? "bg-blue-50" : "bg-white"
                }`}
              >
                {/* DAY NUMBER */}
                <div
                  className={`text-sm font-bold mb-1 ${
                    isToday
                      ? "text-blue-700"
                      : "text-gray-700"
                  }`}
                >
                  {day}
                </div>

                {/* TRIPS */}
                <div className="space-y-1">
                  {dayTrips.map((trip) => {
  const assignment = trip.assignments[0];

  return (
    <details
  key={trip.id}
  className="mb-0.5 rounded border border-blue-300 bg-blue-50"
>
      <summary className="cursor-pointer px-1 py-0.5 text-[10px] font-semibold text-blue-900 hover:bg-blue-100">
        {formatTime(trip.scheduledOnDutyTime)}{" "}
        {trip.tripNumber} —{" "}
        {trip.charterParty?.companyName || "-"}
      </summary>

      <div className="px-2 pb-2 pt-1 text-xs text-gray-700 space-y-1">
        <div>
          <strong>Trip:</strong> {trip.tripNumber}
        </div>

        <div>
          <strong>Charter Party:</strong>{" "}
          {trip.charterParty?.companyName || "-"}
        </div>

        <div>
          <strong>Destination:</strong>{" "}
          {trip.destination || "-"}
        </div>

        <div>
          <strong>Driver:</strong>{" "}
          {assignment?.driver
            ? `${assignment.driver.firstName} ${assignment.driver.lastName}`
            : "Unassigned"}
        </div>

        <div>
          <strong>Bus:</strong>{" "}
          {assignment?.bus?.busNumber || "Unassigned"}
        </div>

        <div>
          <strong>On Duty:</strong>{" "}
          {formatTime(trip.scheduledOnDutyTime)}
        </div>

        <div>
          <strong>Start:</strong>{" "}
          {formatTime(trip.departureTime)}
        </div>

        <div>
          <strong>End:</strong>{" "}
          {formatTime(trip.returnToSchoolTime)}
        </div>

        <Link
          href={`/trips/${trip.id}`}
          className="inline-block mt-1 text-blue-700 font-semibold hover:underline"
        >
          Open Trip Details →
        </Link>
      </div>
    </details>
          );
      })}
    </div>
  </div>
              );
        })}
      </div>
    </div>
    </AppLayout>
  );
}