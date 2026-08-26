import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const tripId = Number(body.tripId);
    const driverId = Number(body.driverId);
    const busId = Number(body.busId);

    if (!tripId || !driverId || !busId) {
      return NextResponse.json(
        { error: "Trip, driver, and bus are required." },
        { status: 400 }
      );
    }

    // Check whether this trip already has an assignment
    const existingAssignment = await prisma.tripAssignment.findFirst({
      where: {
        tripId,
      },
      orderBy: {
        id: "asc",
      },
    });

    let assignment;

    if (existingAssignment) {
      // Reassign the existing driver/bus
      assignment = await prisma.tripAssignment.update({
        where: {
          id: existingAssignment.id,
        },
        data: {
          driverId,
          busId,
        },
        include: {
          driver: true,
          bus: true,
          trip: true,
        },
      });
    } else {
      // No assignment exists yet — create one
      assignment = await prisma.tripAssignment.create({
        data: {
          tripId,
          driverId,
          busId,
        },
        include: {
          driver: true,
          bus: true,
          trip: true,
        },
      });
    }

    // Make sure the trip is scheduled
    await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        status: "Scheduled",
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Assignment Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save assignment.",
      },
      { status: 500 }
    );
  }
}