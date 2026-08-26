type TripScheduleProps = {
  trip: any;
  updateField: (field: string, value: string) => void;
};

export default function TripSchedule({
  trip,
  updateField,
}: TripScheduleProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        Schedule
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

        <div>
          <label className="block font-semibold mb-2">
            Arrival Time
          </label>

          <input
            type="time"
            value={trip.arrivalTime}
            onChange={(e) =>
              updateField("arrivalTime", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Departure Time
          </label>

          <input
            type="time"
            value={trip.departureTime}
            onChange={(e) =>
              updateField("departureTime", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Event Time
          </label>

          <input
            type="time"
            value={trip.eventTime}
            onChange={(e) =>
              updateField("eventTime", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Depart Destination
          </label>

          <input
            type="time"
            value={trip.departDestinationTime}
            onChange={(e) =>
              updateField(
                "departDestinationTime",
                e.target.value
              )
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Return to School
          </label>

          <input
            type="time"
            value={trip.returnToSchoolTime}
            onChange={(e) =>
              updateField(
                "returnToSchoolTime",
                e.target.value
              )
            }
            className="w-full border rounded-lg p-3"
          />
        </div>

      </div>

    </div>
  );
}