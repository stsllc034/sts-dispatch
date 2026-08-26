type Props = {
  trip: any;
};

export default function ConfirmationItinerary({ trip }: Props) {
  return (
    <div className="border border-black mt-8">

      <h2 className="bg-blue-900 text-white px-4 py-2 text-lg font-bold">
        ITINERARY
      </h2>

      <table className="w-full border-collapse">

        <tbody>

          <tr>
            <td className="border p-3 font-semibold w-1/4">
              Pickup Location
            </td>

            <td className="border p-3">
              {trip.pickupLocation}
            </td>

            <td className="border p-3 font-semibold w-1/4">
              Arrival Time
            </td>

            <td className="border p-3">
              {trip.arrivalTime}
            </td>
          </tr>

          <tr>
            <td className="border p-3 font-semibold">
              Departure Time
            </td>

            <td className="border p-3">
              {trip.departureTime}
            </td>

            <td className="border p-3 font-semibold">
              Destination Arrival Time
            </td>

            <td className="border p-3">
              {trip.eventTime}
            </td>
          </tr>

          <tr>
            <td className="border p-3 font-semibold">
              Depart Destination Time
            </td>

            <td className="border p-3">
              {trip.departDestinationTime}
            </td>

            <td className="border p-3 font-semibold">
              Return Time
            </td>

            <td className="border p-3">
              {trip.returnToSchoolTime}
            </td>
          </tr>

          <tr>
            <td className="border p-3 font-semibold">
              Meal Stop
            </td>

            <td className="border p-3">
              {trip.mealStop ? "Yes" : "No"}
            </td>

            <td className="border p-3 font-semibold">
              Trip Type
            </td>

            <td className="border p-3">
              {trip.tripType}
            </td>
          </tr>

        </tbody>

      </table>

    </div>
  );
}