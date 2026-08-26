import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sts_driver_session")?.value;

    if (sessionToken) {
      await prisma.driver.updateMany({
        where: {
          sessionToken,
        },
        data: {
          sessionToken: null,
          sessionExpiresAt: null,
        },
      });
    }

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set("sts_driver_session", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("DRIVER LOGOUT ERROR:", error);

    return NextResponse.json(
      { error: "Unable to log out." },
      { status: 500 }
    );
  }
}