import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const admins = await sql`
      SELECT
        "id",
        "email",
        "passwordHash",
        "active"
      FROM "Administrator"
      WHERE "email" = ${normalizedEmail}
        AND "active" = true
      LIMIT 1
    `;

    const admin = admins[0];

    console.log(
      "ADMIN LOGIN CHECK:",
      normalizedEmail,
      !!admin,
      !!admin?.passwordHash
    );

    if (!admin || !admin.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const [salt, storedHash] = admin.passwordHash.split(":");

    if (!salt || !storedHash) {
      return NextResponse.json(
        { error: "Administrator login is not configured." },
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

    await sql`
      UPDATE "Administrator"
      SET
        "sessionToken" = ${sessionToken},
        "sessionExpiresAt" = ${sessionExpiresAt}
      WHERE "id" = ${admin.id}
    `;

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set(
      "sts_admin_session",
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
    console.error("ADMIN LOGIN ERROR:", error);

    return NextResponse.json(
      { error: "Unable to log in." },
      { status: 500 }
    );
  }
}