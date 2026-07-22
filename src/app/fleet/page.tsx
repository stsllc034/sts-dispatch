import AppLayout from "@/components/AppLayout";

export default function FleetPage() {
  return (
    <AppLayout title="Fleet">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Fleet Management</h2>

        <p className="text-gray-600 mb-6">
          This page will manage all buses and vehicles in the STS fleet.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">Total Fleet</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">Available</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg">Out of Service</h3>
            <p className="text-3xl font-bold text-red-600">0</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}