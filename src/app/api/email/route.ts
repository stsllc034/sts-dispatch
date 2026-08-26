import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let recipient = body.to;

    // If no recipient was supplied but this is a trip email,
    // look up the Charter Party email from the trip.
    if (!recipient && body.tripId) {
      const trip = await prisma.trip.findUnique({
        where: {
          id: Number(body.tripId),
        },
        include: {
          charterParty: true,
        },
      });

      if (!trip) {
        return NextResponse.json(
          {
            success: false,
            error: "Trip could not be found.",
          },
          { status: 404 }
        );
      }

      recipient = trip.charterParty?.email;

      if (!recipient) {
        return NextResponse.json(
          {
            success: false,
            error:
              "No email address is saved for this Charter Party.",
          },
          { status: 400 }
        );
      }
    }

    if (!recipient) {
      return NextResponse.json(
        {
          success: false,
          error: "No recipient email address was provided.",
        },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Stephens Transportation Services" <stsllc034@gmail.com>',
      to: recipient,
      subject: body.subject,
      html: body.html,
      attachments: body.attachment
  ? [
      {
        filename: body.attachment.filename,
        content: Buffer.from(
          body.attachment.content,
          "base64"
        ),
        contentType: "application/pdf",
      },
    ]
  : body.pdfBase64
  ? [
      {
        filename: `Trip-Confirmation-${body.tripId}.pdf`,
        content: Buffer.from(
          body.pdfBase64,
          "base64"
        ),
        contentType: "application/pdf",
      },
    ]
  : [],
});
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}