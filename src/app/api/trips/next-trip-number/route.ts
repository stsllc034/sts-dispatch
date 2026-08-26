import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const year = new Date().getFullYear();

    const lastTrip = await prisma.trip.findFirst({
      where: {
        tripNumber: {
          startsWith: `${year}-`,
        },
      },
      orderBy: {
        tripNumber: "desc",
      },
    });

    let nextNumber = 1;

    if (lastTrip) {
      const parts = lastTrip.tripNumber.split("-");
      nextNumber = Number(parts[1]) + 1;
    }

    const tripNumber = `${year}-${String(nextNumber).padStart(3, "0")}`;

    return NextResponse.json({ tripNumber });
  } catch (error) {
    console.error("Error generating trip number:", error);

    return NextResponse.json(
      { error: "Failed to generate trip number." },
      { status: 500 }
    );
  }
}