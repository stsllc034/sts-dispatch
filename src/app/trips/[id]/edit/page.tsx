import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import TripEditForm from "@/components/TripEditForm";
type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTripPage({ params }: Props) {
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
const drivers = await prisma.driver.findMany({
  where: { active: true },
  orderBy: { lastName: "asc" },
});

const buses = await prisma.bus.findMany({
  where: { active: true },
  orderBy: { busNumber: "asc" },
});

const charterParties = await prisma.charterParty.findMany({
  where: { active: true },
  orderBy: { companyName: "asc" },
});
  if (!trip) {
    notFound();
  }

    return (
  <main className="max-w-5xl mx-auto p-8">

    <div className="flex justify-between items-center mb-8">

      <h1 className="text-3xl font-bold text-blue-900">
        Edit Trip {trip.tripNumber}
      </h1>

      <Link
        href="/trips"
        className="bg-gray-700 hover:bg-gray-800 text-white px-5 py-3 rounded-lg"
      >
        Back to Trips
      </Link>

    </div>

    <div className="bg-white rounded-xl shadow p-8">

     <TripEditForm
  trip={trip}
  drivers={drivers}
  buses={buses}
  charterParties={charterParties}
/>

        
      </div>

    </main>
  );
}