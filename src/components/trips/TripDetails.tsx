type TripDetailsProps = {
  trip: any;
  updateField: (field: string, value: string) => void;
};

export default function TripDetails({
  trip,
  updateField,
}: TripDetailsProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        Trip Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div>
          <label className="block font-semibold mb-2">
            Passenger Count
          </label>

          <input
            type="number"
            value={trip.passengerCount}
            onChange={(e) =>
              updateField("passengerCount", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Trip Type
          </label>

          <select
            value={trip.tripType}
            onChange={(e) =>
              updateField("tripType", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          >
            <option value="Drop / Return">
              Drop / Return
            </option>

            <option value="Drop One Way">
              Drop One Way
            </option>

            <option value="Return One Way">
              Return One Way
            </option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Meal Stop
          </label>

          <select
            value={trip.mealStop ? "Yes" : "No"}
            onChange={(e) =>
              updateField(
                "mealStop",
                e.target.value === "Yes" ? "true" : ""
              )
            }
            className="w-full border rounded-lg p-3"
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>

      </div>

    </div>
  );
}