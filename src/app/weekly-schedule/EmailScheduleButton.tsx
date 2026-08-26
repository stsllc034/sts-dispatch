"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";

interface EmailScheduleButtonProps {
  startDate: string;
  endDate: string;
}

export default function EmailScheduleButton({
  startDate,
  endDate,
}: EmailScheduleButtonProps) {
    const displayStartDate = new Date(`${startDate}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    }
  );

  const displayEndDate = new Date(`${endDate}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    }
  );
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
const [charterParties, setCharterParties] = useState<
  { id: number; companyName: string; email: string | null }[]
>([]);

useEffect(() => {
  async function loadCharterParties() {
    try {
      const response = await fetch("/api/charter-parties");
      const data = await response.json();

      setCharterParties(
        data.filter(
          (party: { email: string | null }) => party.email
        )
      );
    } catch (error) {
      console.error("Error loading carrier emails:", error);
    }
  }

  loadCharterParties();
}, []);
  async function sendToAll() {
  if (charterParties.length === 0) {
    alert("No carrier email addresses are available.");
    return;
  }

  try {
    setSending(true);

    const apiStartDate = startDate;
    const apiEndDate = endDate;

    const pdfResponse = await fetch(
      `/api/weekly-schedule-pdf?start=${apiStartDate}&end=${apiEndDate}`
    );

    if (!pdfResponse.ok) {
      throw new Error("Unable to generate the weekly schedule PDF.");
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    const bytes = new Uint8Array(pdfBuffer);
    let binary = "";

    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });

    const pdfBase64 = btoa(binary);

    for (const party of charterParties) {
      if (!party.email) continue;

      const emailResponse = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: party.email,
          subject: `STS Transportation Schedule - ${displayStartDate} thru ${displayEndDate}`,
          html: `
            <p>Hello ${party.companyName},</p>

            <p>
              Please see the attached transportation schedule for
              <strong>${displayStartDate} thru ${displayEndDate}</strong>
            </p>

            <p>
              Thank you,<br />
              Stephens Transportation Services
            </p>
          `,
          attachment: {
            filename: `STS-Weekly-Schedule-${startDate}-to-${endDate}.pdf`,
            content: pdfBase64,
          },
        }),
      });

      const result = await emailResponse.json();

      if (!emailResponse.ok || !result.success) {
        throw new Error(
          result.error || `Email could not be sent to ${party.email}.`
        );
      }
    }

    alert("Weekly schedule sent to all carriers successfully.");
  } catch (error) {
    console.error("Send To All Error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Unable to send the weekly schedule to all carriers."
    );
  } finally {
    setSending(false);
  }
}
async function sendSchedule() {
    if (!email) {
      alert("Please enter an email address.");
      return;
    }

    try {
      setSending(true);

const apiStartDate = startDate;
const apiEndDate = endDate;

const pdfResponse = await fetch(
  `/api/weekly-schedule-pdf?start=${apiStartDate}&end=${apiEndDate}`
);
  
      if (!pdfResponse.ok) {
        throw new Error("Unable to generate the weekly schedule PDF.");
      }

      const pdfBuffer = await pdfResponse.arrayBuffer();

      const bytes = new Uint8Array(pdfBuffer);
      let binary = "";

      bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });

      const pdfBase64 = btoa(binary);

      const emailResponse = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: `STS Transportation Schedule - ${displayStartDate} thru ${displayEndDate}`,
          html: `
            <p>Hello,</p>

            <p>
              Please see the attached transportation schedule for
              <strong>${displayStartDate} thru ${displayEndDate}</strong>
            </p>

            <p>
              Thank you,<br />
              Stephens Transportation Services
            </p>
          `,
          attachment: {
            filename: `STS-Weekly-Schedule-${startDate}-to-${endDate}.pdf`,
            content: pdfBase64,
          },
        }),
      });

      const result = await emailResponse.json();

      if (!emailResponse.ok || !result.success) {
        throw new Error(result.error || "Email could not be sent.");
      }

      alert("Weekly schedule emailed successfully.");
      setEmail("");
    } catch (error) {
      console.error("Email Schedule Error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to send the weekly schedule."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <select
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="border border-gray-300 rounded-lg px-3 py-2 w-64"
>
  <option value="">Select Carrier</option>

  {charterParties.map((party) => (
    <option key={party.id} value={party.email!}>
      {party.companyName} — {party.email}
    </option>
  ))}
</select>

      <button
        type="button"
        onClick={sendSchedule}
        disabled={sending}
        className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg flex items-center gap-2"
      >
        <Mail size={18} />
        {sending ? "Sending..." : "Email Schedule"}
      </button>
      <button
  type="button"
  onClick={sendToAll}
  disabled={sending}
  className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg flex items-center gap-2"
>
  <Mail size={18} />
  {sending ? "Sending..." : "Send to All Carriers"}
</button>
    </div>
  );
}