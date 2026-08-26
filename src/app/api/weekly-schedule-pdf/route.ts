import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import PDFDocument from "pdfkit";
import path from "path";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit",
  });
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");

    if (!startParam || !endParam) {
      return NextResponse.json(
        {
          error: "Start and end dates are required.",
        },
        { status: 400 }
      );
    }

    const startDate = new Date(`${startParam}T00:00:00`);
    const endDate = new Date(`${endParam}T23:59:59`);
console.log("PDF START:", startParam);
console.log("PDF END:", endParam);
console.log("PDF START DATE:", startDate);
console.log("PDF END DATE:", endDate);
    const trips = await prisma.trip.findMany({
      
      where: {
        tripDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        charterParty: true,
        assignments: {
          include: {
            bus: true,
          },
        },
      },
      orderBy: {
        tripDate: "asc",
      },
    });
console.log("PDF TRIPS FOUND:", trips.length);
console.log(
  "PDF TRIP NUMBERS:",
  trips.map((trip) => trip.tripNumber)
);
    const doc = new PDFDocument({
      size: "LETTER",
      layout: "landscape",
      margin: 36,
    });

    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      const logoPath = path.join(
  process.cwd(),
  "public",
  "images",
  "sts-logo.png"
);

// Header
doc.rect(0, 0, doc.page.width, 62)
  .fill("#173B7A");

doc.image(logoPath, 665, 12, {
  width: 75,
});

doc
  .font("Helvetica-Bold")
  .fontSize(18)
  .fillColor("white")
  .text(
    "STS WEEKLY TRANSPORTATION SCHEDULE",
    36,
    18,
    {
      width: 600,
      align: "left",
    }
  );

doc
  .font("Helvetica")
  .fontSize(9)
  .fillColor("#DCE7F7")
  .text(
    "Stephens Transportation Services",
    36,
    40
  );

doc
  .font("Helvetica-Bold")
  .fontSize(13)
  .fillColor("#173B7A")
  .text(
    `${formatDate(startDate)} thru ${formatDate(endDate)}`,
    0,
    82,
    {
      align: "center",
    }
  );

const tableTop = 115;

const columns = [
  { title: "DATE", width: 54 },
  { title: "TRIP #", width: 77 },
  { title: "CHARTER\nPARTY", width: 99 },
  { title: "# OF\nBUSES", width: 61 },
  { title: "DESTINATION", width: 138 },
  { title: "PASSENGER\nCOUNT", width: 84 },
  { title: "PICKUP\nTIME", width: 126 },
  { title: "RETURN\nTIME", width: 126 },
];

const tableWidth = columns.reduce(
  (total, column) => total + column.width,
  0
);

const pageWidth = doc.page.width;
const tableLeft = (pageWidth - tableWidth) / 2;

let x = tableLeft;

// Table header
doc
  .font("Helvetica-Bold")
  .fontSize(8)
  .fillColor("white");

for (const column of columns) {
  doc
    .rect(x, tableTop, column.width, 28)
    .fill("#173B7A");

  doc
    .fillColor("white")
    .text(column.title, x + 3, tableTop + 8, {
      width: column.width - 6,
      align: "center",
    });

  x += column.width;
}

let y = tableTop + 28;

// Table rows
for (const trip of trips) {
  const rowHeight = 24;

  x = tableLeft;

  const values = [
    formatShortDate(new Date(trip.tripDate)),
    trip.tripNumber,
    trip.charterParty?.companyName || "-",
    String(trip.assignments?.length || 0),
    trip.destination || "-",
    trip.passengerCount != null
      ? String(trip.passengerCount)
      : "TBD",
    trip.departureTime || "-",
    trip.returnToSchoolTime || "-",
  ];

  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("black");

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    if (trips.indexOf(trip) % 2 === 1) {
      doc
        .rect(x, y, column.width, rowHeight)
        .fill("#EFF6FF");
    }

    doc
      .rect(x, y, column.width, rowHeight)
      .stroke();

    doc
      .fillColor("black")
      .fontSize(i === 4 ? 7 : 8)
      .text(values[i], x + 3, y + 7, {
        width: column.width - 6,
        height: rowHeight - 4,
        align: "center",
      });

    x += column.width;
  }

  y += rowHeight;

  if (y > doc.page.height - 45) {
    doc.addPage();
    y = 40;
  }
}

if (trips.length === 0) {
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor("gray");

  doc
    .rect(tableLeft, y, tableWidth, 30)
    .stroke();

  doc.text(
    "No trips scheduled for this week.",
    tableLeft,
    y + 9,
    {
      width: tableWidth,
      align: "center",
    }
  );
}

doc.end();
    });

    return new NextResponse(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          `attachment; filename="STS-Weekly-Schedule-${startParam}-to-${endParam}.pdf"`,
      },
    });
  } catch (error) {
    console.error("WEEKLY SCHEDULE PDF ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to generate weekly schedule PDF.",
      },
      { status: 500 }
    );
  }
}