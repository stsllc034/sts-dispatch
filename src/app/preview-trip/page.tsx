"use client";

import { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import TripConfirmationPDF from "@/pdf/TripConfirmationPDF";

export default function PreviewTripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTrip() {
      try {
        const { id } = await params;

        const response = await fetch(`/api/trips/${id}`);

        if (!response.ok) {
          throw new Error("Unable to load trip.");
        }

        const data = await response.json();
        setTrip(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load trip confirmation.");
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [params]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading Trip Confirmation...</p>
      </main>
    );
  }

  if (error || !trip) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">
          {error || "Trip not found."}
        </p>
      </main>
    );
  }

  return (
    <main className="w-full h-screen bg-gray-200">
      <PDFViewer
        width="100%"
        height="100%"
        showToolbar
      >
        <TripConfirmationPDF trip={trip} />
      </PDFViewer>
    </main>
  );
}