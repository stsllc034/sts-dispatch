import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tripId = Number(id);

    if (!Number.isInteger(tripId)) {
      return NextResponse.json(
        { error: "Invalid trip ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const trip = await prisma.trip.update({
      where: {
        id: tripId,
      },
      data: {
        reviewedBy: body.reviewedBy || null,
        reviewedDate: body.reviewedDate
          ? new Date(`${body.reviewedDate}T00:00:00`)
          : null,
        reviewComments: body.reviewComments || null,
      },
    });

    return NextResponse.json({
      success: true,
      trip,
    });
  } catch (error) {
    console.error("DISPATCH REVIEW ERROR:", error);

    return NextResponse.json(
      { error: "Failed to save dispatch review." },
      { status: 500 }
    );
  }
}