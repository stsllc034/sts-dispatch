import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const driver = await prisma.driver.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        active: true,
      },
    });

    if (!driver || !driver.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const [salt, storedHash] = driver.passwordHash.split(":");

    if (!salt || !storedHash) {
      return NextResponse.json(
        { error: "Driver login is not configured." },
        { status: 500 }
      );
    }

    const passwordHash = scryptSync(
      password,
      salt,
      64
    ).toString("hex");

    const passwordMatches = timingSafeEqual(
      Buffer.from(passwordHash, "hex"),
      Buffer.from(storedHash, "hex")
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const sessionToken = randomBytes(32).toString("hex");

    const sessionExpiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7
    );

    await prisma.driver.update({
      where: {
        id: driver.id,
      },
      data: {
        sessionToken,
        sessionExpiresAt,
      },
    });

    const response = NextResponse.json({
      success: true,
      driver: {
        id: driver.id,
        firstName: driver.firstName,
        lastName: driver.lastName,
      },
    });

    response.cookies.set(
      "sts_driver_session",
      sessionToken,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: sessionExpiresAt,
        path: "/",
      }
    );

    return response;
  } catch (error) {
    console.error("DRIVER LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "Unable to log in." },
      { status: 500 }
    );
  }
}