import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const charterParties = await prisma.charterParty.findMany({
      orderBy: {
        companyName: "asc",
      },
    });

    return NextResponse.json(charterParties);
  } catch (error) {
    console.error("Error loading charter parties:", error);

    return NextResponse.json(
      { error: "Failed to load charter parties." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const charterParty = await prisma.charterParty.create({
      data: {
        companyName: body.companyName,
        contactName: body.contactName,
        phone: body.phone,
        email: body.email,
        billingAddress: body.billingAddress,
        city: body.city,
        state: body.state,
        zip: body.zip,
        pickupAddress: body.pickupAddress,
        notes: body.notes,
        active: body.active ?? true,
      },
    });

    return NextResponse.json(charterParty, { status: 201 });
  } catch (error) {
    console.error("Error creating charter party:", error);

    return NextResponse.json(
      { error: "Failed to create charter party." },
      { status: 500 }
    );
  }
}