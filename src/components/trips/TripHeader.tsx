type TripHeaderProps = {
  trip: any;
  updateField: (field: string, value: string) => void;
};

export default function TripHeader({
  trip,
  updateField,
}: TripHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">

      <h2 className="text-2xl font-bold text-blue-900">
        Trip Confirmation
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div>
          <label className="block font-semibold mb-2">
            Trip ID
          </label>

          <input
            value={trip.tripId}
            readOnly
            className="w-full border rounded-lg p-3 bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Trip Date
          </label>

          <input
            type="date"
            value={trip.tripDate}
            onChange={(e) =>
              updateField("tripDate", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Date Request Received
          </label>

          <input
            type="date"
            value={trip.requestReceivedDate}
            onChange={(e) =>
              updateField("requestReceivedDate", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Date Request Confirmed
          </label>

          <input
            type="date"
            value={trip.requestConfirmedDate}
            onChange={(e) =>
              updateField("requestConfirmedDate", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

      </div>

    </div>
  );
}