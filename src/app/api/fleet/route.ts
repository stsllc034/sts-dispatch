import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const buses = await prisma.bus.findMany({
      orderBy: {
        busNumber: "asc",
      },
    });

    return NextResponse.json(buses);
  } catch (error) {
    console.error("Error loading buses:", error);

    return NextResponse.json(
      { error: "Failed to load buses." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const bus = await prisma.bus.create({
      data: {
        busNumber: body.busNumber,
        year: body.year,
        make: body.make,
        model: body.model,
        vin: body.vin,
        licensePlate: body.licensePlate,
        seatingCapacity: body.seatingCapacity,
        status: body.status,
      },
    });

    return NextResponse.json(bus);
  } catch (error) {
    console.error("Error saving bus:", error);

    return NextResponse.json(
      { error: "Failed to save bus." },
      { status: 500 }
    );
  }
}
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const bus = await prisma.bus.update({
      where: {
        id: body.id,
      },
      data: {
        busNumber: body.busNumber,
        year: body.year,
        make: body.make,
        model: body.model,
        vin: body.vin,
        licensePlate: body.licensePlate,
        seatingCapacity: body.seatingCapacity,
        status: body.status,
      },
    });

    return NextResponse.json(bus);
  } catch (error) {
    console.error("Error updating bus:", error);

    return NextResponse.json(
      { error: "Failed to update bus." },
      { status: 500 }
    );
  }
}