"use client";

import { useState } from "react";

interface DispatchReviewFormProps {
  tripId: number;
  reviewedBy: string | null;
  reviewedDate: string | null;
  reviewComments: string | null;
}

export default function DispatchReviewForm({
  tripId,
  reviewedBy,
  reviewedDate,
  reviewComments,
}: DispatchReviewFormProps) {
  const [name, setName] = useState(reviewedBy || "");
  const [date, setDate] = useState(reviewedDate || "");
  const [comments, setComments] = useState(reviewComments || "");
  const [message, setMessage] = useState("");

  async function saveReview() {
    setMessage("");

    try {
      const response = await fetch(`/api/trips/${tripId}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewedBy: name,
          reviewedDate: date,
          reviewComments: comments,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save review.");
      }

      setMessage("Dispatch review saved successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save dispatch review."
      );
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-8 mt-6">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        Dispatch Review
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-semibold mb-2">
            Reviewed By
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-3"
            placeholder="Enter administrator name"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Review Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="block font-semibold mb-2">
          Comments
        </label>

        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={5}
          className="w-full border rounded-lg p-3"
          placeholder="Enter dispatch review comments..."
        />
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={saveReview}
          className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-lg"
        >
          Save Review
        </button>

        {message && (
          <span className="text-sm text-gray-600">
            {message}
          </span>
        )}
      </div>
    </div>
  );
}