import Image from "next/image";
import { prisma } from "@/lib/prisma";
import AppLayout from "@/components/AppLayout";
import { Mail } from "lucide-react";
import EmailScheduleButton from "./EmailScheduleButton";

function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });
}

function formatFullDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
}

export default async function WeeklySchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const params = await searchParams;

  const selectedWeek = Number(params.week ?? "0");

  const weekNumber =
    Number.isInteger(selectedWeek) && selectedWeek >= 0
      ? selectedWeek
      : 0;

  const today = new Date();

  // Week 0 starts on Monday
const startDate = new Date(today);
const dayOfWeek = startDate.getDay();
const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

startDate.setDate(
  today.getDate() - daysSinceMonday + weekNumber * 7
);
  startDate.setHours(0, 0, 0, 0);

  // Each schedule covers 7 days.
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  const trips = await prisma.trip.findMany({
    where: {
      tripDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      charterParty: true,
      assignments: {
        include: {
          bus: true,
        },
      },
    },
    orderBy: {
      tripDate: "asc",
    },
  });

  // Build the next 8 selectable weeks.
  const weekOptions = Array.from({ length: 8 }, (_, index) => {
  const weekStart = new Date(today);
  const dayOfWeek = weekStart.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  weekStart.setDate(
    today.getDate() - daysSinceMonday + index * 7
  );
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return {
      value: index,
      label: `${formatFullDate(weekStart)} thru ${formatFullDate(
        weekEnd
      )}`,
    };
  });

  return (
  <AppLayout title="Weekly Schedule">
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      {/* HEADER */}
      <div className="bg-blue-900 rounded-t-xl px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            STS Weekly Transportation Schedule
          </h1>

          <p className="text-blue-100 mt-1">
            Stephens Transportation Services
          </p>
        </div>

        <Image
          src="/images/sts-logo.png"
          alt="Stephens Transportation Services"
          width={150}
          height={65}
          priority
          className="object-contain bg-white rounded-lg p-1"
        />
      </div>

      {/* WEEK CONTROLS */}
      <div className="bg-white border border-gray-200 border-t-0 px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h2 className="text-xl font-bold text-blue-900">
              {formatFullDate(startDate)} thru{" "}
              {formatFullDate(endDate)}
            </h2>

            <p className="text-gray-600 text-sm mt-1">
              Select a week to view scheduled trips.
            </p>
          </div>

          <form
            method="GET"
            action="/weekly-schedule"
            className="flex items-center gap-3"
          >
            <label
              htmlFor="week"
              className="font-semibold text-gray-700"
            >
              Select Week:
            </label>

            <select
              id="week"
              name="week"
              defaultValue={String(weekNumber)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
            >
              {weekOptions.map((week) => (
                <option
                  key={week.value}
                  value={week.value}
                >
                  {week.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-lg font-semibold"
            >
              View Week
            </button>
          </form>

        </div>
      </div>

      {/* EMAIL BUTTON */}
      <div className="bg-white border-x border-gray-200 px-6 pb-5">
        <EmailScheduleButton
          startDate={`${startDate.getFullYear()}-${String(
            startDate.getMonth() + 1
          ).padStart(2, "0")}-${String(
            startDate.getDate()
          ).padStart(2, "0")}`}
          endDate={`${endDate.getFullYear()}-${String(
            endDate.getMonth() + 1
          ).padStart(2, "0")}-${String(
            endDate.getDate()
          ).padStart(2, "0")}`}
        />
      </div>

      {/* SCHEDULE */}
      <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm p-6">

        <div className="overflow-x-auto border border-gray-200 rounded-lg">

          <table className="w-full table-fixed border-collapse text-sm">

            <thead className="bg-blue-900 text-white">
              <tr className="text-center">

                <th className="w-[7%] px-3 py-3 font-semibold">
  DATE
</th>

                <th className="w-[10%] px-3 py-3 font-semibold">
                  TRIP #
                </th>

                <th className="w-[13%] px-3 py-3 font-semibold">
                  CHARTER
                  <br />
                  PARTY
                </th>

                <th className="w-[8%] px-3 py-3 font-semibold">
                  # OF
                  <br />
                  BUSES
                </th>

                <th className="w-[18%] px-3 py-3 font-semibold">
                  DESTINATION
                </th>

                <th className="w-[11%] px-3 py-3 font-semibold">
                  PASSENGER
                  <br />
                  COUNT
                </th>

                <th className="w-[16.5%] px-3 py-3 font-semibold">
                  PICKUP
                  <br />
                  TIME
                </th>

                <th className="w-[16.5%] px-3 py-3 font-semibold">
                  RETURN
                  <br />
                  TIME
                </th>

              </tr>
            </thead>

            <tbody>

              {trips.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-gray-500"
                  >
                    No trips scheduled for this week.
                  </td>
                </tr>
              ) : (
                trips.map((trip, index) => (

                  <tr
                    key={trip.id}
                    className={
                      index % 2 === 0
                        ? "bg-white text-center"
                        : "bg-blue-50 text-center"
                    }
                  >

                    <td className="border-t border-gray-200 px-3 py-3">
                      {formatShortDate(
                        new Date(trip.tripDate)
                      )}
                    </td>

                    <td className="border-t border-gray-200 px-3 py-3 font-semibold text-blue-900">
                      {trip.tripNumber}
                    </td>

                    <td className="border-t border-gray-200 px-3 py-3">
                      {trip.charterParty.companyName}
                    </td>

                    <td className="border-t border-gray-200 px-3 py-3">
                      {trip.assignments?.length || 0}
                    </td>

                    <td className="border-t border-gray-200 px-3 py-3">
                      {trip.destination || "-"}
                    </td>

                    <td className="border-t border-gray-200 px-3 py-3">
                      {trip.passengerCount ?? "TBD"}
                    </td>

                    <td className="border-t border-gray-200 px-3 py-3">
                      {trip.departureTime || "-"}
                    </td>

                    <td className="border-t border-gray-200 px-3 py-3">
                      {trip.returnToSchoolTime || "-"}
                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

        </div>
  </AppLayout>
);
}