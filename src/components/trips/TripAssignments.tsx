type TripAssignmentsProps = {
  trip: any;
  drivers: any[];
  buses: any[];
  updateField: (field: string, value: string) => void;
};

export default function TripAssignments({
  trip,
  drivers,
  buses,
  updateField,
}: TripAssignmentsProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        Driver Assignments
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block font-semibold mb-2">
            Driver
          </label>

          <select
            value={trip.driverId}
            onChange={(e) =>
              updateField("driverId", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Driver</option>

            {drivers.map((driver: any) => (
              <option key={driver.id} value={driver.id}>
                {driver.firstName} {driver.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Bus
          </label>

          <select
            value={trip.busId}
            onChange={(e) =>
              updateField("busId", e.target.value)
            }
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select Bus</option>

            {buses.map((bus: any) => (
              <option key={bus.id} value={bus.id}>
                {bus.busNumber}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="mt-6">
        <button
          type="button"
          className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2 rounded-lg"
        >
          + Add Assignment
        </button>
      </div>

    </div>
  );
}