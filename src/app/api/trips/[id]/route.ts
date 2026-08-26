import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: Params
) {
  const { id } = await params;

  try {
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
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load trip" },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: Request,
  { params }: Params
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const existingTrip = await prisma.trip.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        assignments: true,
      },
    });

    if (!existingTrip) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }

    const trip = await prisma.trip.update({
      where: {
        id: Number(id),
      },

      data: {
        // Trip Information
        tripDate: new Date(`${body.tripDate}T12:00:00.000Z`),
        status: body.status,

        // Request Tracking
        requestReceivedDate: body.requestReceivedDate
          ? new Date(`${body.requestReceivedDate}T12:00:00.000Z`)
          : null,

        requestConfirmedDate: body.requestConfirmedDate
          ? new Date(`${body.requestConfirmedDate}T12:00:00.000Z`)
          : null,

        // Charter Party
        // Charter Party
charterParty: {
  connect: {
    id: Number(body.charterPartyId),
  },
},

        // Contact Information
        contactName: body.contactName || null,
        contactPhone: body.contactPhone || null,
        contactEmail: body.contactEmail || null,

        // Locations
        pickupLocation: body.pickupLocation || null,
        destination: body.destination,

        // Schedule
scheduledOnDutyTime: body.scheduledOnDutyTime || null,
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

    // Update the existing driver/bus assignment without deleting
    // the driver's trip sheet information.
    if (
      existingTrip.assignments.length > 0 &&
      body.driverId &&
      body.busId
    ) {
      await prisma.tripAssignment.update({
        where: {
          id: existingTrip.assignments[0].id,
        },
        data: {
          driverId: Number(body.driverId),
          busId: Number(body.busId),
        },
      });
    }

    const updatedTrip = await prisma.trip.findUnique({
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

    return NextResponse.json(updatedTrip);
 } catch (error: any) {
  console.error("UPDATE TRIP ERROR:", error);

  return NextResponse.json(
    {
      error: error.message,
      code: error.code ?? null,
      meta: error.meta ?? null,
    },
    { status: 500 }
  );
}
}

  