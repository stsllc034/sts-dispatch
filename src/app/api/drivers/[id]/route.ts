import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes, scryptSync } from "crypto";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const driver = await prisma.driver.findUnique({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json(driver);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data: {
      firstName: string;
      lastName: string;
      phone: string | null;
      email: string | null;
      licenseNo: string | null;
      passwordHash?: string;
    } = {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone || null,
      email: body.email || null,
      licenseNo: body.licenseNo || null,
    };

    if (body.password && body.password.trim() !== "") {
      const salt = randomBytes(16).toString("hex");

      const hash = scryptSync(
        body.password,
        salt,
        64
      ).toString("hex");

      data.passwordHash = `${salt}:${hash}`;
    }

    const driver = await prisma.driver.update({
      where: {
        id: Number(id),
      },
      data,
    });

    return NextResponse.json(driver);
 } catch (error: any) {
  console.error("UPDATE DRIVER ERROR:", error);

  return NextResponse.json(
    {
      error: error?.message || "Unable to update driver.",
      code: error?.code || null,
      meta: error?.meta || null,
    },
    { status: 500 }
  );
}
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const driverId = Number(id);

    const assignmentCount = await prisma.tripAssignment.count({
      where: {
        driverId,
      },
    });

    if (assignmentCount > 0) {
      const driver = await prisma.driver.update({
        where: {
          id: driverId,
        },
        data: {
          active: false,
          sessionToken: null,
          sessionExpiresAt: null,
        },
      });

      return NextResponse.json({
        success: true,
        action: "deactivated",
        driver,
        message:
          "Driver has trip history and was deactivated instead of deleted.",
      });
    }

    await prisma.driver.delete({
      where: {
        id: driverId,
      },
    });

    return NextResponse.json({
      success: true,
      action: "deleted",
      message: "Driver deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE DRIVER ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to delete driver.",
      },
      { status: 500 }
    );
  }
}