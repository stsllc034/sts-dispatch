import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes, scryptSync } from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  const drivers = await prisma.driver.findMany({
  where: {
    active: true,
  },
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

    let passwordHash: string | undefined;

    if (body.password && body.password.trim() !== "") {
      const salt = randomBytes(16).toString("hex");

      const hash = scryptSync(
        body.password,
        salt,
        64
      ).toString("hex");

      passwordHash = `${salt}:${hash}`;
    }

    const driver = await prisma.driver.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone || null,
        email: body.email
          ? body.email.toLowerCase().trim()
          : null,
        licenseNo: body.licenseNo || null,
        passwordHash,
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