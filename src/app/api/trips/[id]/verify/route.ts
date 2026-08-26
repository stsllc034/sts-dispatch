import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tripId = Number(id);

    const body = await request.json();

    const action = body.action;
    const changeRequest = body.changeRequest || "";

    if (!["verify", "change"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid verification action." },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        charterParty: true,
      },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Trip not found." },
        { status: 404 }
      );
    }

    const now = new Date();

    if (action === "verify") {
      await prisma.trip.update({
        where: { id: tripId },
        data: {
          customerVerificationStatus: "Verified",
          customerVerifiedAt: now,
        },
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: "stsllc034@gmail.com",
        subject: `Customer Verified - Trip ${trip.tripNumber}`,
        html: `
          <h2>Customer Verification Received</h2>

          <p><strong>Trip Number:</strong> ${trip.tripNumber}</p>

          <p><strong>Trip Date:</strong>
            ${new Date(trip.tripDate).toLocaleDateString()}
          </p>

          <p><strong>Charter Party:</strong>
            ${trip.charterParty?.companyName ?? "Not specified"}
          </p>

          <p>
            <strong>Status:</strong>
            Customer has verified the trip details.
          </p>

          <p>
            <strong>Verified:</strong>
            ${now.toLocaleString()}
          </p>

          <p>
            Stephens Transportation Services
          </p>
        `,
      });

      return NextResponse.json({
        success: true,
        status: "Verified",
      });
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: {
        customerVerificationStatus: "Change Requested",
        customerChangeRequestedAt: now,
        customerChangeRequest: changeRequest,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "stsllc034@gmail.com",
      subject: `Customer Change Request - Trip ${trip.tripNumber}`,
      html: `
        <h2>Customer Change Request</h2>

        <p><strong>Trip Number:</strong> ${trip.tripNumber}</p>

        <p><strong>Trip Date:</strong>
          ${new Date(trip.tripDate).toLocaleDateString()}
        </p>

        <p><strong>Charter Party:</strong>
          ${trip.charterParty?.companyName ?? "Not specified"}
        </p>

        <p><strong>Requested Change:</strong></p>

        <p>
          ${changeRequest || "No details were provided."}
        </p>

        <p>
          Stephens Transportation Services
        </p>
      `,
    });

    return NextResponse.json({
      success: true,
      status: "Change Requested",
    });
  } catch (error) {
    console.error("Customer verification error:", error);

    return NextResponse.json(
      { error: "Unable to process customer verification." },
      { status: 500 }
    );
  }
}