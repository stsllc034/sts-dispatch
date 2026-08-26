import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sts_driver_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Not authorized." },
        { status: 401 }
      );
    }

    const driver = await prisma.driver.findFirst({
      where: {
        sessionToken,
        sessionExpiresAt: {
          gt: new Date(),
        },
        active: true,
      },
    });

    if (!driver) {
      return NextResponse.json(
        { error: "Driver session is invalid or expired." },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const tripId = Number(url.searchParams.get("tripId"));

    if (!tripId) {
      return NextResponse.json(
        { error: "Trip ID is required." },
        { status: 400 }
      );
    }

    const assignment = await prisma.tripAssignment.findFirst({
      where: {
        tripId,
        driverId: driver.id,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "This trip is not assigned to you." },
        { status: 403 }
      );
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("LOAD DRIVER TRIP SHEET ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load trip information." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sts_driver_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Not authorized." },
        { status: 401 }
      );
    }

    const driver = await prisma.driver.findFirst({
      where: {
        sessionToken,
        sessionExpiresAt: {
          gt: new Date(),
        },
        active: true,
      },
    });

    if (!driver) {
      return NextResponse.json(
        { error: "Driver session is invalid or expired." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const assignmentId = Number(body.assignmentId);
    const tripId = Number(body.tripId);

    if (!assignmentId || !tripId) {
      return NextResponse.json(
        { error: "Trip and assignment are required." },
        { status: 400 }
      );
    }

    const assignment = await prisma.tripAssignment.findFirst({
      where: {
        id: assignmentId,
        tripId,
        driverId: driver.id,
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "This trip is not assigned to you." },
        { status: 403 }
      );
    }

    const updatedAssignment =
      await prisma.tripAssignment.update({
        where: {
          id: assignmentId,
        },
        data: {
          beginningOdometer:
            body.beginningOdometer ?? null,

          endingOdometer:
            body.endingOdometer ?? null,

          fuelAdded:
            body.fuelAdded ?? null,

          pickupDepartureTime:
            body.pickupDepartureTime || null,

          destinationArrivalTime:
            body.destinationArrivalTime || null,

          destinationDepartureTime:
            body.destinationDepartureTime || null,

          returnTime:
            body.returnTime || null,

          totalCustomerHours:
            body.totalCustomerHours ?? null,

          mealStop:
            Boolean(body.mealStop),

          mealStopArrivalTime:
            body.mealStopArrivalTime || null,

          mealStopDepartureTime:
            body.mealStopDepartureTime || null,

totalPassengersDeparture:
  body.totalPassengersDeparture ?? null,

studentPassengersDeparture:
  body.studentPassengersDeparture ?? null,

studentPassengersReturn:
  body.studentPassengersReturn ?? null,


          driverStartTime:
  body.driverStartTime || null,

driverEndTime:
  body.driverEndTime || null,

totalDriverHours:
  body.totalDriverHours ?? null,

customerSignature:
  assignment.customerSignature || body.customerSignature || null,
        },
      });
    // Driver submitted the trip sheet
await prisma.trip.update({
  where: { id: tripId },
  data: { status: "Completed" },
});
    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error("SAVE DRIVER TRIP SHEET ERROR:", error);

    return NextResponse.json(
      { error: "Unable to save trip information." },
      { status: 500 }
    );
  }
}