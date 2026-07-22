import AppLayout from "@/components/AppLayout";

export default function Dashboard() {
  return (
    <AppLayout title="Administrator Dashboard">

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Today's Trips</h3>
          <p className="text-4xl font-bold text-blue-700">0</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Drivers Working</h3>
          <p className="text-4xl font-bold text-green-600">0</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Available Buses</h3>
          <p className="text-4xl font-bold text-orange-500">0</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Trips Awaiting Dispatch</h3>
          <p className="text-4xl font-bold text-red-600">0</p>
        </div>

      </div>

      <div className="bg-white rounded-xl shadow p-8">

        <h3 className="text-2xl font-bold mb-4">
          Welcome to the STS Dispatch System
        </h3>

        <p className="text-gray-700">
          From this dashboard you will manage trips, drivers,
          buses, charter parties, reports, and system settings.
        </p>

      </div>

    </AppLayout>
  );
}