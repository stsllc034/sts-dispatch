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
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!driver) {
      return NextResponse.json(
        { error: "Driver session is invalid or expired." },
        { status: 401 }
      );
    }

    return NextResponse.json(driver);
  } catch (error) {
    console.error("DRIVER ME ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load driver information." },
      { status: 500 }
    );
  }
}