type Props = {
  trip: any;
};

export default function ConfirmationSection1({ trip }: Props) {
  return (
    <div className="border border-black mt-8">
      <h2 className="bg-blue-900 text-white px-4 py-2 text-lg font-bold">
        TRIP CONFIRMATION
      </h2>

      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <td className="border p-3 font-semibold w-1/4">
              Trip Number
            </td>

            <td className="border p-3">
              {trip.tripNumber}
            </td>

            <td className="border p-3 font-semibold w-1/4">
              Trip Date
            </td>

            <td className="border p-3">
              {new Date(trip.tripDate).toLocaleDateString()}
            </td>
          </tr>

          <tr>
            <td className="border p-3 font-semibold">
              Charter Party
            </td>

            <td className="border p-3">
              {trip.charterParty?.companyName}
            </td>

            <td className="border p-3 font-semibold">
              Contact Name
            </td>

            <td className="border p-3">
              {trip.contactName || trip.charterParty?.contactName || "-"}
            </td>
          </tr>

          <tr>
            <td className="border p-3 font-semibold">
              Contact Phone
            </td>

            <td className="border p-3">
              {trip.contactPhone || trip.charterParty?.phone || "-"}
            </td>

            <td className="border p-3 font-semibold">
              Passenger Count
            </td>

            <td className="border p-3">
              {trip.passengerCount}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}