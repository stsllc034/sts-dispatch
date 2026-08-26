import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
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

    return NextResponse.json(trips);
  } catch (error) {
    console.error("Error loading trips:", error);

    return NextResponse.json(
      { error: "Failed to load trips." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const trip = await prisma.trip.create({
      data: {
       // Identification
tripNumber: body.tripNumber,
status: body.status || "Draft",

// Request Tracking
requestReceivedDate: body.requestReceivedDate
  ? new Date(body.requestReceivedDate)
  : null,

requestConfirmedDate: body.requestConfirmedDate
  ? new Date(body.requestConfirmedDate)
  : null,

// Trip Date
tripDate: new Date(`${body.tripDate}T12:00:00.000Z`),

// Charter Party
charterPartyId: Number(body.charterPartyId),

// Contact Information
contactName: body.contactName,
contactPhone: body.contactPhone || null,
contactEmail: body.contactEmail || null,

// Locations
pickupLocation: body.pickupLocation,
destination: body.destination,

// Schedule
arrivalTime: body.arrivalTime || null,
departureTime: body.departureTime || null,
eventTime: body.eventTime || null,
departDestinationTime: body.departDestinationTime || null,
returnToSchoolTime: body.returnToSchoolTime || null,

// Trip Details
passengerCount: body.passengerCount
  ? Number(body.passengerCount)
  : null,

tripDetails: body.tripDetails || null,

// Trip Type
tripType: body.tripType || null,

// Meal Stop
mealStop: Boolean(body.mealStop),

// Notes
notes: body.notes || null,
...(body.driverId && body.busId
  ? {
      assignments: {
        create: {
          driverId: Number(body.driverId),
          busId: Number(body.busId),
        },
      },
    }
  : {}),
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

    return NextResponse.json(trip);
   } catch (error) {
  console.error("Trip Save Error:", error);

  return NextResponse.json(
    {
      error:
     (error as any).message || "Failed to save trip"
    },
    { status: 500 }
  );
}
}