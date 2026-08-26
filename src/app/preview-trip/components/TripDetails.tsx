type Props = {
  trip: any;
};

export default function TripDetails({ trip }: Props) {
  return (
    <div className="border border-black mt-8">

      <h2 className="bg-blue-900 text-white px-4 py-2 text-lg font-bold">
        TRIP DETAILS
      </h2>

      <div className="p-6 min-h-40 whitespace-pre-wrap leading-7">
        {trip.tripDetails || "No trip details provided."}
      </div>

    </div>
  );
}