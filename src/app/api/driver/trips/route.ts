import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sts_driver_session")?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Driver is not logged in." },
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

    const trips = await prisma.trip.findMany({
      where: {
        assignments: {
          some: {
            driverId: driver.id,
          },
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

    return NextResponse.json(trips);
  } catch (error) {
    console.error("DRIVER TRIPS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to load driver trips." },
      { status: 500 }
    );
  }
}