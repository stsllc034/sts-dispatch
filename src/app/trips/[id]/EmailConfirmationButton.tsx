"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import TripConfirmationPDF from "@/pdf/TripConfirmationPDF";

export default function EmailConfirmationButton({
  tripId,
}: {
  tripId: number;
}) {
  const [sending, setSending] = useState(false);

  const sendConfirmation = async () => {
    try {
      setSending(true);

const tripResponse = await fetch(`/api/trips/${tripId}`);

if (!tripResponse.ok) {
  throw new Error("Unable to load trip.");
}

const trip = await tripResponse.json();

const pdfBlob = await pdf(
  <TripConfirmationPDF trip={trip} />
).toBlob();

const pdfBase64 = await new Promise<string>((resolve, reject) => {
  const reader = new FileReader();

  reader.onloadend = () => {
    const result = reader.result as string;
    resolve(result.split(",")[1]);
  };

  reader.onerror = reject;
  reader.readAsDataURL(pdfBlob);
});
      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  tripId,
  subject: `Trip Confirmation - ${trip.tripNumber}`,
  html: `
    <h2>STS Trip Confirmation</h2>

    <p>
      <strong>Trip ID:</strong> ${trip.tripNumber}
    </p>

    <p>
      <strong>Trip Date:</strong> ${new Date(
        trip.tripDate
      ).toLocaleDateString()}
    </p>

    <p>
      <strong>Charter Party:</strong> ${
        trip.charterParty?.companyName ?? "Not specified"
      }
    </p>

    <p>
      <strong>Pickup Location:</strong> ${
        trip.pickupLocation ?? "Not specified"
      }
    </p>

    <p>
      <strong>Destination:</strong> ${
        trip.destination ?? "Not specified"
      }
    </p>

    <p>
      <strong>Passenger Count:</strong> ${
        trip.passengerCount ?? "Not specified"
      }
    </p>

    <p>
      Thank you,<br />
      Stephens Transportation Services
    </p>
  `,
  attachment: {
    filename: `STS-Trip-Confirmation-${trip.tripNumber}.pdf`,
    content: pdfBase64,
  },
}),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Unable to send trip confirmation.");
        return;
      }

      alert("Trip confirmation email sent successfully.");
    } catch (error) {
      console.error("Email error:", error);
      alert("Unable to send trip confirmation.");
    } finally {
      setSending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={sendConfirmation}
      disabled={sending}
      className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white px-5 py-3 rounded-lg"
    >
      {sending ? "Sending..." : "Email Confirmation"}
    </button>
  );
}