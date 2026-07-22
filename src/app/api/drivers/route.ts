import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const drivers = await prisma.driver.findMany({
    orderBy: [
      {
        lastName: "asc",
      },
      {
        firstName: "asc",
      },
    ],
  });

  return NextResponse.json(drivers);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Received:", body);

    const driver = await prisma.driver.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone || null,
        email: body.email || null,
        licenseNo: body.licenseNo || null,
        active: true,
      },
    });

    console.log("Created:", driver);

    return NextResponse.json(driver, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);

    return NextResponse.json(
      { error: "Unable to create driver." },
      { status: 500 }
    );
  }
}