interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string | null;
  licenseNo: string | null;
  active: boolean;
}

interface DriverTableProps {
  drivers: Driver[];
}

export default function DriverTable({
  drivers,
}: DriverTableProps) {
  if (drivers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          Driver List
        </h2>

        <p className="text-gray-500">
          No drivers have been added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-4">
        Driver List
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="text-left p-3">Driver</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">License</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((driver) => (
              <tr
                key={driver.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">
                  {driver.firstName} {driver.lastName}
                </td>

                <td className="p-3">
                  {driver.phone ?? "-"}
                </td>

                <td className="p-3">
                  {driver.email ?? "-"}
                </td>

                <td className="p-3">
                  {driver.licenseNo ?? "-"}
                </td>

                <td className="p-3">
                  {driver.active ? "🟢 Active" : "🔴 Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}